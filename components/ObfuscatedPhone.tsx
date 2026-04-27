'use client';

// 電話番号をJSで組み立てる（クローラー対策）
// ソースHTMLに完全な番号が現れない
const PARTS = ['070', '8456', '7355'];

export function ObfuscatedPhone() {
  const number = PARTS.join('-');
  return (
    <span aria-label={`電話番号: ${number}`}>
      {PARTS[0]}
      <span aria-hidden="true">-</span>
      {PARTS[1]}
      <span aria-hidden="true">-</span>
      {PARTS[2]}
    </span>
  );
}
