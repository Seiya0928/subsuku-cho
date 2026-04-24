'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { setPremium } from '@/lib/storage';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) { setStatus('error'); return; }

    fetch(`/api/verify?session_id=${sessionId}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setPremium();
          setStatus('ok');
          setTimeout(() => router.push('/'), 2500);
        } else {
          setStatus('error');
        }
      })
      .catch(() => setStatus('error'));
  }, [searchParams, router]);

  return (
    <div className="text-center space-y-4">
      {status === 'loading' && <p className="text-gray-400 text-sm">確認中...</p>}
      {status === 'ok' && (
        <>
          <div className="text-5xl">🎉</div>
          <p className="text-white text-xl font-bold">プレミアム解放完了！</p>
          <p className="text-gray-400 text-sm">サブスクを無制限に登録できるようになりました</p>
          <p className="text-gray-500 text-xs">トップに戻ります...</p>
        </>
      )}
      {status === 'error' && (
        <>
          <p className="text-red-400 text-sm">確認に失敗しました</p>
          <button onClick={() => router.push('/')} className="text-blue-400 text-sm underline">
            トップに戻る
          </button>
        </>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Suspense fallback={<p className="text-gray-400 text-sm">読み込み中...</p>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
