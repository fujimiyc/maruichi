'use client';

import { useEffect, useRef, useState } from 'react';

interface ScannerProps {
  onScan: (result: string) => void;
}

export default function Scanner({ onScan }: ScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const scanningRef = useRef(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let reader: import('@zxing/library').BrowserMultiFormatReader | null = null;
    let cancelled = false;

    const startScanner = async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/library');
        reader = new BrowserMultiFormatReader();

        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsScanning(true);

          reader.decodeFromVideoDevice(null, videoRef.current, (result) => {
            if (result && !scanningRef.current) {
              scanningRef.current = true;
              const text = result.getText();
              // 6桁数字を抽出
              const match = text.match(/(\d{6})/);
              if (match) {
                onScan(match[1]);
              } else {
                scanningRef.current = false;
              }
            }
          });
        }
      } catch {
        if (!cancelled) {
          setHasCamera(false);
        }
      }
    };

    startScanner();

    return () => {
      cancelled = true;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (reader) {
        reader.reset();
      }
    };
  }, [onScan]);

  if (!hasCamera) {
    return (
      <div className="bg-gray-200 rounded-lg flex items-center justify-center aspect-[4/3]">
        <div className="text-center">
          <p className="text-red-500 font-bold text-lg">カメラスキャン</p>
          <p className="text-gray-500 text-sm mt-2">カメラを使用できません</p>
          <p className="text-gray-500 text-sm">下の番号入力をご利用ください</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200 rounded-lg overflow-hidden aspect-[4/3] relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${isScanning ? '' : 'hidden'}`}
      />
      {!isScanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-red-500 font-bold text-lg">カメラスキャン</p>
        </div>
      )}
    </div>
  );
}
