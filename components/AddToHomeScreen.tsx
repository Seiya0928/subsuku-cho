'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export function AddToHomeScreen() {
  const [show, setShow]     = useState(false);
  const [open, setOpen]     = useState(false);

  useEffect(() => {
    const ua         = navigator.userAgent;
    const isIOS      = /iPhone|iPad|iPod/.test(ua);
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as { standalone?: boolean }).standalone === true;

    // iOS かつ まだ PWA 化していない場合のみ表示（ブラウザ種別は問わない）
    setShow(isIOS && !standalone);
  }, []);

  if (!show) return null;

  return (
    <div className="rounded-xl bg-gray-800/60 border border-gray-700/50 overflow-hidden">
      {/* ── トリガー行 ── */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
        aria-expanded={open}
      >
        <span className="text-sm text-gray-300 leading-snug">
          📱 このページ、アプリとして使えます
          <span className="block text-xs text-gray-500 mt-0.5">
            iPhone：Safariで開く → 共有 → ホーム画面に追加
          </span>
        </span>
        {open
          ? <ChevronUp  size={15} className="text-gray-500 flex-shrink-0" />
          : <ChevronDown size={15} className="text-gray-500 flex-shrink-0" />}
      </button>

      {/* ── 展開パネル ── */}
      {open && (
        <div className="border-t border-gray-700/50 px-4 pt-3 pb-4 space-y-3">
          {/* 手順 */}
          <p className="text-xs text-amber-400/90 bg-amber-950/40 border border-amber-900/40 rounded-lg px-3 py-2 leading-relaxed">
            InstagramやChromeで開いている場合は、まず Safari で開いてから追加してください。
          </p>

          <ol className="space-y-2">
            {[
              <>Safari で <span className="font-medium text-white">このページ</span> を開く</>,
              <>下部の <span className="text-blue-400 font-medium">共有（□↑）</span> をタップ</>,
              <>「ホーム画面に追加」→「追加」で完了</>,
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300 leading-relaxed">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-gray-700 text-gray-400 flex items-center justify-center text-[10px] font-bold mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>

          {/* メリット */}
          <div className="bg-gray-900/70 rounded-lg px-3 py-2.5 space-y-1.5">
            <p className="text-xs text-gray-400">ホーム画面に追加すると</p>
            {[
              'アプリのようにすぐ開ける',
              '毎月のサブスク確認に便利です',
            ].map(t => (
              <p key={t} className="text-xs text-gray-300 flex items-center gap-1.5">
                <span className="text-amber-400">✓</span>{t}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
