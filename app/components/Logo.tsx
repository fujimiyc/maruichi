'use client';

export default function Logo() {
  return (
    <div className="flex flex-col items-center pt-6 pb-4">
      {/* ロゴ: ユースセンターまるいち */}
      <div className="relative w-28 h-28">
        {/* 屋根 */}
        <svg viewBox="0 0 120 120" className="w-full h-full">
          {/* 丸い背景 */}
          <circle cx="60" cy="65" r="48" fill="#F5F5F0" stroke="#333" strokeWidth="2" />
          {/* 屋根の三角 */}
          <polygon points="20,58 60,25 100,58" fill="#2D7A6B" stroke="#333" strokeWidth="2" />
          {/* 屋根の装飾 */}
          <circle cx="60" cy="38" r="8" fill="#E85D3A" />
          <text x="60" y="42" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">★</text>
          {/* 窓 */}
          <rect x="38" y="62" width="16" height="16" rx="2" fill="#2D7A6B" opacity="0.7" />
          <rect x="66" y="62" width="16" height="16" rx="2" fill="#2D7A6B" opacity="0.7" />
          {/* ドア */}
          <rect x="50" y="72" width="20" height="22" rx="2" fill="#E85D3A" opacity="0.8" />
        </svg>
      </div>
      <div className="flex items-center gap-1 -mt-2">
        <span className="text-xs text-orange-500 font-bold tracking-wider">ユースセンター</span>
      </div>
      <h1 className="text-2xl font-black text-orange-500 -mt-1" style={{ fontFamily: 'sans-serif' }}>
        まるいち
      </h1>
    </div>
  );
}
