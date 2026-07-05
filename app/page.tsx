'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Scanner from './components/Scanner';

export default function Home() {
  const router = useRouter();
  const [memberId, setMemberId] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
        sessionStorage.setItem('memberConsent', member.consent ? '1' : '0');
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

  const handleSubmit = () => {
    if (memberId.length === 0) {
      setError('番号を入力してください');
      return;
    }
    const padded = memberId.padStart(6, '0');
    lookupMember(padded);
  };

  return (
    <div className="px-6 pb-8">
      <h1 className="text-2xl font-black text-center pt-6 pb-4">
        まるいち入退室フォーム
      </h1>

      <Scanner onScan={handleScan} />

      {error && (
        <p className="text-red-500 text-center mt-4 font-bold">{error}</p>
      )}

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

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-[#2D7A6B] text-white py-3 rounded-md font-bold text-lg mt-3 disabled:opacity-50"
      >
        送信
      </button>
    </div>
  );
}
