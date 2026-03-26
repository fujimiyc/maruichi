'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Logo from './components/Logo';
import Scanner from './components/Scanner';

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<'入室' | '退室'>('入室');
  const [memberId, setMemberId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('mode');
    if (saved === '入室' || saved === '退室') {
      setMode(saved);
    }
  }, []);

  const handleModeChange = (newMode: '入室' | '退室') => {
    setMode(newMode);
    sessionStorage.setItem('mode', newMode);
    setError('');
  };

  const lookupMember = useCallback(async (id: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/member?id=${id}`);
      if (res.ok) {
        const member = await res.json();
        sessionStorage.setItem('memberId', member.id);
        sessionStorage.setItem('memberName', member.name);
        router.push('/confirm');
      } else {
        setError('メンバーが見つかりません');
        setIsLoading(false);
      }
    } catch {
      setError('通信エラーが発生しました');
      setIsLoading(false);
    }
  }, [isLoading, router]);

  const handleScan = useCallback((result: string) => {
    lookupMember(result);
  }, [lookupMember]);

  const handleManualSubmit = (action: '入室' | '退室') => {
    handleModeChange(action);
    if (memberId.length === 0) {
      setError('番号を入力してください');
      return;
    }
    const padded = memberId.padStart(6, '0');
    sessionStorage.setItem('mode', action);
    lookupMember(padded);
  };

  return (
    <div className="px-6 pb-8">
      <Logo />

      {/* タブ切替 */}
      <div className="flex border border-gray-300 rounded-md overflow-hidden mb-6">
        <button
          onClick={() => handleModeChange('入室')}
          className={`flex-1 py-3 text-center font-bold text-lg transition-colors ${
            mode === '入室'
              ? 'bg-[#2D7A6B] text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          入室
        </button>
        <button
          onClick={() => handleModeChange('退室')}
          className={`flex-1 py-3 text-center font-bold text-lg transition-colors ${
            mode === '退室'
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-500'
          }`}
        >
          退室
        </button>
      </div>

      {/* カメラスキャン */}
      <Scanner onScan={handleScan} />

      {/* エラーメッセージ */}
      {error && (
        <p className="text-red-500 text-center mt-4 font-bold">{error}</p>
      )}

      {/* 手動入力 */}
      <div className="mt-6">
        <p className="text-center font-bold mb-3">番号直接入力はこちら</p>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="000000"
          value={memberId}
          onChange={(e) => {
            setMemberId(e.target.value.replace(/\D/g, ''));
            setError('');
          }}
          className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg text-center placeholder-red-300 focus:outline-none focus:border-[#2D7A6B]"
        />
      </div>

      {/* ボタン */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleManualSubmit('入室')}
          disabled={isLoading}
          className="flex-1 bg-[#2D7A6B] text-white py-3 rounded-md font-bold text-lg disabled:opacity-50"
        >
          入室
        </button>
        <button
          onClick={() => handleManualSubmit('退室')}
          disabled={isLoading}
          className="flex-1 bg-black text-white py-3 rounded-md font-bold text-lg disabled:opacity-50"
        >
          退室
        </button>
      </div>
    </div>
  );
}
