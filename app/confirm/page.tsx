'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '../components/Logo';

export default function ConfirmPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'入室' | '退室'>('入室');
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedMode = sessionStorage.getItem('mode') as '入室' | '退室';
    const savedName = sessionStorage.getItem('memberName');
    const savedId = sessionStorage.getItem('memberId');

    if (!savedName || !savedId) {
      router.push('/');
      return;
    }

    setMode(savedMode || '入室');
    setMemberName(savedName);
    setMemberId(savedId);
  }, [router]);

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: memberId,
          name: memberName,
          action: mode,
        }),
      });

      if (res.ok) {
        router.push('/complete');
      } else {
        alert('エラーが発生しました');
        setIsSubmitting(false);
      }
    } catch {
      alert('通信エラーが発生しました');
      setIsSubmitting(false);
    }
  };

  const isEntry = mode === '入室';

  return (
    <div className="px-6 pb-8">
      <Logo />

      {/* タイトルバー */}
      <div
        className={`py-3 text-center font-bold text-lg text-white rounded-md mb-6 ${
          isEntry ? 'bg-[#2D7A6B]' : 'bg-black'
        }`}
      >
        {mode}
      </div>

      {/* 名前表示 */}
      <div className="text-center mb-8">
        <p className="text-gray-600 font-bold mb-4">お名前</p>
        <p className="text-4xl font-black">{memberName}</p>
      </div>

      {/* 確認ボタン */}
      <button
        onClick={handleConfirm}
        disabled={isSubmitting}
        className={`w-full py-4 text-white font-bold text-xl rounded-md disabled:opacity-50 ${
          isEntry ? 'bg-[#2D7A6B]' : 'bg-black'
        }`}
      >
        {mode}する
      </button>
    </div>
  );
}
