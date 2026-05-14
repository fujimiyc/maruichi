'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CompletePage() {
  const router = useRouter();
  const [action, setAction] = useState('');

  useEffect(() => {
    const savedAction = sessionStorage.getItem('completedAction');
    if (savedAction) {
      setAction(savedAction);
    }

    const timer = setTimeout(() => {
      router.push('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="px-6 pb-8">
      <h1 className="text-2xl font-black text-center pt-6 pb-4">
        まるいち入退室フォーム
      </h1>

      <div className="flex justify-center my-8">
        <Image
          src="/complete.png"
          alt="完了イラスト"
          width={280}
          height={200}
        />
      </div>

      <h2 className="text-3xl font-black text-center mb-8">
        {action ? `${action}完了！` : '完了しました'}
      </h2>

      <button
        onClick={() => router.push('/')}
        className="w-full py-4 border-2 border-gray-800 rounded-md font-bold text-lg text-center hover:bg-gray-50 transition-colors"
      >
        入退室画面にもどる
      </button>
    </div>
  );
}
