'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
  const router = useRouter();
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedName = sessionStorage.getItem('memberName');
    const savedId = sessionStorage.getItem('memberId');

    if (!savedName || !savedId) {
      router.push('/');
      return;
    }

    setMemberName(savedName);
    setMemberId(savedId);
  }, [router]);

  const handleAction = async (action: '入室' | '退室') => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: memberId,
          name: memberName,
          action,
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

  return (
    <div className="px-6 pb-8">
      <h1 className="text-2xl font-black text-center pt-6 pb-4">
        まるいち入退室フォーム
      </h1>

      <div className="text-center mb-8 mt-4">
        <p className="text-gray-600 font-bold mb-4">お名前</p>
        <p className="text-4xl font-black">{memberName}</p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => handleAction('入室')}
          disabled={isSubmitting}
          className="flex-1 py-4 bg-[#2D7A6B] text-white font-bold text-xl rounded-md disabled:opacity-50"
        >
          入室
        </button>
        <button
          onClick={() => handleAction('退室')}
          disabled={isSubmitting}
          className="flex-1 py-4 bg-black text-white font-bold text-xl rounded-md disabled:opacity-50"
        >
          退室
        </button>
      </div>

      <button
        onClick={() => router.push('/')}
        className="w-full py-3 mt-4 border-2 border-gray-800 rounded-md font-bold text-lg text-center hover:bg-gray-50 transition-colors"
      >
        もどる
      </button>
    </div>
  );
}
