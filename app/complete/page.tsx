'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompletePage() {
  const router = useRouter();

  useEffect(() => {
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

      {/* イラスト: 2人が手を振っている */}
      <div className="flex justify-center items-center gap-4 my-8">
        <svg viewBox="0 0 120 160" className="w-32 h-40">
          <circle cx="50" cy="30" r="18" fill="#F5C6A0" />
          <path d="M32,28 Q35,8 55,10 Q70,12 68,30" fill="#2D7A6B" />
          <circle cx="44" cy="32" r="2" fill="#333" />
          <circle cx="56" cy="32" r="2" fill="#333" />
          <path d="M44,38 Q50,44 56,38" fill="none" stroke="#333" strokeWidth="1.5" />
          <rect x="36" y="48" width="28" height="40" rx="5" fill="#4A9BE8" />
          <text x="50" y="74" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">S</text>
          <path d="M64,52 L85,25" stroke="#F5C6A0" strokeWidth="8" strokeLinecap="round" />
          <circle cx="87" cy="22" r="6" fill="#F5C6A0" />
          <path d="M36,55 L22,70" stroke="#F5C6A0" strokeWidth="8" strokeLinecap="round" />
          <rect x="12" y="68" width="16" height="20" rx="3" fill="#F4A83D" />
          <path d="M36,86 L28,130 L72,130 L64,86" fill="#E85D3A" />
          <line x1="40" y1="130" x2="38" y2="152" stroke="#F5C6A0" strokeWidth="6" strokeLinecap="round" />
          <line x1="60" y1="130" x2="62" y2="152" stroke="#F5C6A0" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="36" cy="155" rx="8" ry="5" fill="#2D7A6B" />
          <ellipse cx="64" cy="155" rx="8" ry="5" fill="#2D7A6B" />
        </svg>

        <svg viewBox="0 0 120 160" className="w-32 h-40">
          <circle cx="60" cy="30" r="18" fill="#F5C6A0" />
          <path d="M42,28 Q40,5 60,8 Q80,5 78,28" fill="#E85D3A" />
          <path d="M78,28 Q82,45 75,55" fill="#E85D3A" />
          <circle cx="54" cy="32" r="2" fill="#333" />
          <circle cx="66" cy="32" r="2" fill="#333" />
          <path d="M54,38 Q60,44 66,38" fill="none" stroke="#333" strokeWidth="1.5" />
          <rect x="46" y="48" width="28" height="40" rx="5" fill="#4A4A8A" />
          <path d="M46,52 L25,25" stroke="#F5C6A0" strokeWidth="8" strokeLinecap="round" />
          <circle cx="23" cy="22" r="6" fill="#F5C6A0" />
          <path d="M74,55 L88,70" stroke="#F5C6A0" strokeWidth="8" strokeLinecap="round" />
          <path d="M85,60 Q95,55 90,50" fill="none" stroke="#4A9BE8" strokeWidth="3" />
          <rect x="80" y="65" width="16" height="18" rx="3" fill="#4A9BE8" />
          <path d="M46,86 L42,130 L78,130 L74,86" fill="#E85DA0" />
          <line x1="50" y1="130" x2="48" y2="152" stroke="#F5C6A0" strokeWidth="6" strokeLinecap="round" />
          <line x1="70" y1="130" x2="72" y2="152" stroke="#F5C6A0" strokeWidth="6" strokeLinecap="round" />
          <ellipse cx="46" cy="155" rx="8" ry="5" fill="#4A9BE8" />
          <ellipse cx="74" cy="155" rx="8" ry="5" fill="#4A9BE8" />
        </svg>
      </div>

      <h2 className="text-3xl font-black text-center mb-8">完了しました</h2>

      <button
        onClick={() => router.push('/')}
        className="w-full py-4 border-2 border-gray-800 rounded-md font-bold text-lg text-center hover:bg-gray-50 transition-colors"
      >
        入退室画面にもどる
      </button>
    </div>
  );
}
