'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

// メールアドレスを分割して保持（クローラー対策）
const USER   = 'zhenye271';
const DOMAIN = 'gmail.com';

export function ObfuscatedEmail() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${USER}@${DOMAIN}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="inline-flex items-center gap-2">
      <span className="select-all">
        {USER}
        <span className="text-gray-500">[at]</span>
        {DOMAIN}
      </span>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded px-2 py-0.5 transition-colors"
        aria-label="メールアドレスをコピー"
      >
        {copied
          ? <><Check size={11} className="text-green-400" />コピー済</>
          : <><Copy size={11} />コピー</>}
      </button>
    </span>
  );
}
