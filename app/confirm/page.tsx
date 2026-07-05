'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmPage() {
  const router = useRouter();
  const [memberName, setMemberName] = useState('');
  const [memberId, setMemberId] = useState('');
  const [hasConsent, setHasConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittingAction, setSubmittingAction] = useState<'入室' | '退室' | null>(null);

  useEffect(() => {
    const savedName = sessionStorage.getItem('memberName');
    const savedId = sessionStorage.getItem('memberId');
    const savedConsent = sessionStorage.getItem('memberConsent');

    if (!savedName || !savedId) {
      router.push('/');
      return;
    }

    setMemberName(savedName);
    setMemberId(savedId);
    setHasConsent(savedConsent !== '0');
  }, [router]);

  const handleConfirm = async (action: '入室' | '退室') => {
    if (isSubmitting) return;

    // 保護者同意がない場合は入室不可（退室は可能）
    if (action === '入室' && !hasConsent) {
      alert('保護者の同意が確認できていないため入室できません。\nスタッフにお声がけください。');
      return;
    }

    setIsSubmitting(true);
    setSubmittingAction(action);

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: memberId,
          name: memberName,
          action: action,
        }),
      });

      if (res.ok) {
        sessionStorage.setItem('completedAction', action);
        router.push('/complete');
      } else {
        let message = 'エラーが発生しました';
        try {
          const data = await res.json();
          if (data.error) message = data.error;
        } catch {
          // JSONでない場合は既定メッセージのまま
        }
        alert(message);
        setIsSubmitting(false);
        setSubmittingAction(null);
      }
    } catch {
      alert('通信エラーが発生しました');
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  return (
    <div className="px-6 pb-8">
      <h1 className="text-2xl font-black text-center pt-6 pb-4">
        まるいち入退室フォーム
      </h1>

      <div className="text-center mb-8">
        <p className="text-gray-600 font-bold mb-4">お名前</p>
        <p className="text-4xl font-black">{memberName}</p>
      </div>

      {!hasConsent && !isSubmitting && (
        <div className="bg-orange-100 border-2 border-orange-400 text-orange-800 rounded-md px-4 py-3 mb-6 text-center font-bold">
          保護者の同意が確認できていないため
          <br />
          入室できません。
          <br />
          スタッフにお声がけください。
        </div>
      )}

      {isSubmitting ? (
        <div className="flex flex-col items-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#2D7A6B] rounded-full animate-spin mb-6"></div>
          <p className="text-lg font-bold text-gray-600">
            {submittingAction === '入室' ? '入室' : '退室'}処理中...
          </p>
        </div>
      ) : (
        <>
          <div className="flex gap-4">
            <button
              onClick={() => handleConfirm('入室')}
              className={`flex-1 py-4 font-bold text-xl rounded-md transition-opacity ${
                hasConsent
                  ? 'bg-[#2D7A6B] text-white active:opacity-70'
                  : 'bg-gray-300 text-gray-500'
              }`}
            >
              入室する
            </button>
            <button
              onClick={() => handleConfirm('退室')}
              className="flex-1 bg-black text-white py-4 font-bold text-xl rounded-md active:opacity-70 transition-opacity"
            >
              退室する
            </button>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full border-2 border-gray-800 text-gray-800 py-4 font-bold text-lg rounded-md mt-4"
          >
            入退室画面にもどる
          </button>
        </>
      )}
    </div>
  );
}
