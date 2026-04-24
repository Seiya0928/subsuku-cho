'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PlusCircle, Trash2, TrendingDown, Crown, ChevronDown, ChevronUp, Pencil, Check, ShieldCheck, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Subscription, Category, CATEGORIES, CATEGORY_COLORS, PRESETS, BillingCycle,
} from '@/lib/types';
import {
  getSubscriptions, saveSubscriptions, isPremium, toMonthly, FREE_LIMIT,
} from '@/lib/storage';

const STORAGE_KEY = 'subsuku_cho_subs';

function fmt(n: number) {
  return n.toLocaleString('ja-JP');
}

function genId() {
  return Math.random().toString(36).slice(2);
}

const EMPTY: Omit<Subscription, 'id' | 'createdAt'> = {
  name: '', amount: 0, billingCycle: 'monthly', category: 'その他',
  renewalDay: 1, isActive: true, color: '#6b7280',
};

const DUMMY_DATA: Omit<Subscription, 'id' | 'createdAt'>[] = [
  { name: 'Netflix',  amount: 790,  billingCycle: 'monthly', category: '動画', renewalDay: 1, isActive: true,  color: '#ef4444' },
  { name: 'Spotify',  amount: 980,  billingCycle: 'monthly', category: '音楽', renewalDay: 1, isActive: false, color: '#22c55e' },
];

export default function HomePage() {
  const [subs, setSubs]             = useState<Subscription[]>([]);
  const [premium, setPrem]          = useState(false);
  const [showAdd, setShowAdd]       = useState(false);
  const [showPreset, setShowPreset] = useState(false);
  const [form, setForm]             = useState({ ...EMPTY });
  const [purchasing]                = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [stripeError, setStripeError] = useState('');
  const editRef   = useRef<HTMLInputElement>(null);
  const appRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      const initial = DUMMY_DATA.map(d => ({ ...d, id: genId(), createdAt: new Date().toISOString() }));
      saveSubscriptions(initial);
      setSubs(initial);
    } else {
      setSubs(getSubscriptions());
    }

    setPrem(isPremium());
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setStripeError(decodeURIComponent(err));
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const save = useCallback((next: Subscription[]) => {
    setSubs(next);
    saveSubscriptions(next);
  }, []);

  const addSub = () => {
    if (!form.name || !form.amount) return;
    const next = [...subs, { ...form, id: genId(), createdAt: new Date().toISOString() }];
    save(next);
    setForm({ ...EMPTY });
    setShowAdd(false);
    setShowPreset(false);
  };

  const addPreset = (p: typeof PRESETS[0]) => {
    if (!canAdd) return;
    const next = [...subs, { ...p, id: genId(), createdAt: new Date().toISOString() }];
    save(next);
  };

  const startEdit = (s: Subscription) => {
    setEditingId(s.id);
    setEditAmount(String(s.amount));
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const commitEdit = (id: string) => {
    const n = Number(editAmount);
    if (n > 0) save(subs.map(s => s.id === id ? { ...s, amount: n } : s));
    setEditingId(null);
  };

  const toggleActive = (id: string) => {
    save(subs.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const remove = (id: string) => {
    save(subs.filter(s => s.id !== id));
  };

  const handlePurchase = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/checkout';
    document.body.appendChild(form);
    form.submit();
  };

  const scrollToApp = () => {
    appRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 集計
  const monthlyTotal  = subs.reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0);
  const yearlyTotal   = monthlyTotal * 12;
  const activeTotal   = subs.filter(s => s.isActive).reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0);
  const wasteTotal    = subs.filter(s => !s.isActive).reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0);
  const inactiveSubs  = subs.filter(s => !s.isActive);

  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: subs
      .filter(s => s.category === cat)
      .reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0),
  })).filter(d => d.value > 0);

  const canAdd = premium || subs.length < FREE_LIMIT;
  const presetNotAdded = PRESETS.filter(p => !subs.some(s => s.name === p.name));

  // 動的CTAテキスト
  const ctaLabel = wasteTotal > 0
    ? `今すぐ¥${fmt(wasteTotal)}/月の無駄を止める（買い切り¥480）`
    : '今すぐ無駄な支出を止める（買い切り¥480）';

  const ctaHint = wasteTotal > 0
    ? inactiveSubs.length === 1
      ? `この中の1つを解約するだけで、¥${fmt(wasteTotal)}/月の支出を止められます`
      : `未使用サブスクを見直すだけで、最大¥${fmt(wasteTotal)}/月の支出を止められます`
    : 'たった1つ解約するだけで、このアプリ代は回収できます';

  const PurchaseButton = ({ className }: { className?: string }) => (
    <button
      onClick={handlePurchase}
      disabled={purchasing}
      className={`w-full bg-amber-500 hover:bg-amber-400 text-black font-bold transition-colors disabled:opacity-50 flex flex-col items-center gap-0.5 ${className ?? 'text-sm py-3.5 rounded-xl'}`}
    >
      <span className="flex items-center gap-1.5"><Crown size={14} />{ctaLabel}</span>
      <span className="text-xs font-normal opacity-70">一度の支払いで永久利用</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">

        {/* ━━ ヒーローセクション ━━ */}
        {!premium && (
          <section className="space-y-5 pt-2">
            <div className="space-y-3">
              <p className="text-xs text-amber-400 font-semibold tracking-widest uppercase">無駄な支出を止めるツール</p>
              <h1 className="text-2xl font-black leading-snug tracking-tight">
                使っていないサブスクを<br />見える化して、<br />毎月のムダを削減する
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                使っていないサブスクは、毎月静かにお金を減らします。<br />
                登録するだけで、契約中のサブスクと月額合計が一目で分かる。
              </p>
            </div>

            <ul className="space-y-2">
              {[
                '無料で5件まで登録可能',
                '未使用の支出を見つけて、すぐに見直せる',
                'データはこのデバイス内のみ保存',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-300">
                  <span className="text-amber-400 font-bold">✓</span>{item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-3">
              <button
                onClick={scrollToApp}
                className="w-full bg-white hover:bg-gray-100 text-black text-sm font-bold py-3.5 rounded-xl transition-colors"
              >
                無料で使う
              </button>
              <div className="space-y-1.5">
                <p className="text-center text-xs text-gray-400">{ctaHint}</p>
                <PurchaseButton />
              </div>
            </div>
          </section>
        )}

        {/* ━━ ヘッダー（アプリ部分） ━━ */}
        <div ref={appRef} className="flex items-center justify-between pt-2">
          <div>
            <h2 className="text-lg font-bold">サブスク帳</h2>
            <p className="text-xs text-gray-500">無駄な支出を見える化する</p>
          </div>
          {!premium ? (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              <Crown size={12} />
              {purchasing ? '処理中...' : '支出を止める ¥480'}
            </button>
          ) : (
            <span className="flex items-center gap-1 text-amber-400 text-xs font-bold">
              <Crown size={12} /> プレミアム
            </span>
          )}
        </div>

        {stripeError && (
          <div className="bg-red-950 border border-red-800 rounded-xl px-3 py-2">
            <p className="text-red-300 text-xs">エラー: {stripeError}</p>
          </div>
        )}

        {/* ━━ サマリーカード（最重要：最大強調） ━━ */}
        <div className="bg-gray-900 rounded-2xl p-6 space-y-4">
          {/* 月額合計 */}
          <div className="text-center space-y-1">
            <p className="text-gray-400 text-xs font-medium tracking-wide">現在のサブスク支出</p>
            <p className="text-5xl font-black text-amber-400 leading-none">
              ¥{fmt(monthlyTotal)}
            </p>
            <p className="text-sm font-bold text-amber-400 opacity-70">/ 月</p>
            <p className="text-gray-400 text-sm mt-2">
              年間：約 <span className="text-white font-bold">¥{fmt(yearlyTotal)}</span>
            </p>
          </div>

          {/* 使用中 / 未使用 グリッド */}
          {subs.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-800">
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-0.5">使用中</p>
                <p className="text-green-400 font-bold text-xl">
                  ¥{fmt(activeTotal)}<span className="text-xs text-gray-500">/月</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs mb-0.5">未使用（損失）</p>
                <p className={`font-bold text-xl ${wasteTotal > 0 ? 'text-red-400' : 'text-gray-600'}`}>
                  ¥{fmt(wasteTotal)}<span className="text-xs text-gray-500">/月</span>
                </p>
              </div>
            </div>
          )}

          {/* ② 未使用合計の強調ブロック */}
          {subs.length > 0 && (
            <div className={`rounded-xl p-3.5 space-y-1 ${wasteTotal > 0 ? 'bg-red-950 border border-red-900' : 'bg-gray-800'}`}>
              {wasteTotal > 0 ? (
                <>
                  <div className="flex items-center gap-2">
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                    <p className="text-xs text-red-300 font-semibold">未使用の可能性がある支出</p>
                  </div>
                  <p className="text-red-200 text-2xl font-black pl-5">¥{fmt(wasteTotal)}<span className="text-sm font-normal opacity-70"> / 月</span></p>
                  <p className="text-red-400/70 text-xs pl-5 leading-relaxed">
                    この金額は今すぐ見直せる可能性があります。<br />
                    年間換算で <span className="text-red-300 font-bold">¥{fmt(wasteTotal * 12)}</span> が消えています。
                  </p>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-xs">✓</span>
                  <p className="text-gray-400 text-xs">未使用の支出はまだありません</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ━━ 円グラフ ━━ */}
        {categoryData.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-3">カテゴリ別内訳</p>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={120} height={120}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%" cy="50%"
                    innerRadius={30} outerRadius={55}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={CATEGORY_COLORS[entry.name as Category]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v) => [`¥${fmt(Number(v))}/月`, '']}
                    contentStyle={{ background: '#1f2937', border: 'none', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {categoryData.sort((a, b) => b.value - a.value).map(d => (
                  <div key={d.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: CATEGORY_COLORS[d.name as Category] }}
                      />
                      <span className="text-xs text-gray-300">{d.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">¥{fmt(d.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ━━ サブスクリスト ━━ */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {subs.length}件登録中{!premium && ` (無料 ${subs.length}/${FREE_LIMIT})`}
            </p>
            <p className="text-xs text-gray-600">価格は目安・編集可</p>
          </div>

          {subs.map(s => {
            const monthlyAmount = toMonthly(s.amount, s.billingCycle);
            return (
              <div
                key={s.id}
                className={`rounded-xl p-4 flex items-start gap-3 ${
                  s.isActive ? 'bg-gray-900' : 'bg-red-950/30 border border-red-900/50'
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: CATEGORY_COLORS[s.category] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <span className="text-xs text-gray-500 flex-shrink-0">{s.category}</span>
                  </div>
                  {editingId === s.id ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-gray-400">¥</span>
                      <input
                        ref={editRef}
                        type="number"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && commitEdit(s.id)}
                        className="w-20 bg-gray-800 text-white text-xs rounded px-1.5 py-0.5 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-400">/{s.billingCycle === 'monthly' ? '月' : '年'}</span>
                      <button onClick={() => commitEdit(s.id)} className="text-green-400 ml-1">
                        <Check size={13} />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-0.5 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs text-gray-400">
                          ¥{fmt(s.amount)}/{s.billingCycle === 'monthly' ? '月' : '年'}
                          {s.billingCycle === 'yearly' && (
                            <span className="ml-1 text-gray-500">(月換算 ¥{fmt(monthlyAmount)})</span>
                          )}
                        </p>
                        <button onClick={() => startEdit(s)} className="text-gray-600 hover:text-gray-400">
                          <Pencil size={11} />
                        </button>
                      </div>
                      {/* ① 未使用損失表示 */}
                      {!s.isActive && (
                        <p className="text-xs text-red-400 font-semibold">
                          毎月¥{fmt(monthlyAmount)}の無駄
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  {/* ⑤ 未使用タグ強化 */}
                  <button
                    onClick={() => toggleActive(s.id)}
                    className={`text-xs px-2 py-0.5 rounded-full border font-semibold transition-colors ${
                      s.isActive
                        ? 'border-green-800 text-green-500 bg-green-950/50'
                        : 'border-red-700 text-red-400 bg-red-950/60'
                    }`}
                  >
                    {s.isActive ? '使用中' : '未使用'}
                  </button>
                  <button
                    onClick={() => remove(s.id)}
                    className="text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ━━ CTA（非プレミアム・制限前） ━━ */}
        {!premium && subs.length > 0 && canAdd && (
          <div className="space-y-2">
            <p className="text-center text-xs text-gray-400">{ctaHint}</p>
            <PurchaseButton />
          </div>
        )}

        {/* ━━ 登録上限メッセージ ━━ */}
        {!canAdd && (
          <div className="bg-amber-950 border border-amber-800 rounded-2xl p-5 space-y-3">
            <div>
              <p className="text-amber-300 text-sm font-bold">5件まで無料で使えます。</p>
              <p className="text-amber-200/70 text-xs mt-1 leading-relaxed">
                これ以上登録するには無制限化が必要です。
              </p>
            </div>
            <div className="space-y-1.5">
              <p className="text-center text-xs text-amber-200/50">{ctaHint}</p>
              <PurchaseButton className="text-sm py-3 rounded-xl" />
            </div>
          </div>
        )}

        {/* ━━ プリセット追加 ━━ */}
        {canAdd && presetNotAdded.length > 0 && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowPreset(v => !v)}
              className="w-full px-4 py-3 flex items-center justify-between text-sm text-gray-300"
            >
              <span>よく使われるサービスから追加<span className="ml-2 text-xs text-gray-600">※価格は目安</span></span>
              {showPreset ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showPreset && (
              <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                {presetNotAdded.map(p => (
                  <button
                    key={p.name}
                    onClick={() => addPreset(p)}
                    disabled={!canAdd}
                    className="text-left bg-gray-800 hover:bg-gray-700 rounded-xl p-2.5 transition-colors disabled:opacity-40"
                  >
                    <p className="text-xs font-medium text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">¥{fmt(p.amount)}/月</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ━━ 手動追加フォーム ━━ */}
        {canAdd && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowAdd(v => !v)}
              className="w-full px-4 py-3 flex items-center gap-2 text-sm text-blue-400"
            >
              <PlusCircle size={16} />
              手動で追加
              {showAdd ? <ChevronUp size={16} className="ml-auto" /> : <ChevronDown size={16} className="ml-auto" />}
            </button>
            {showAdd && (
              <div className="px-4 pb-4 space-y-3">
                <input
                  type="text"
                  placeholder="サービス名"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="金額"
                    value={form.amount || ''}
                    onChange={e => setForm(f => ({ ...f, amount: Number(e.target.value) }))}
                    className="flex-1 bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <select
                    value={form.billingCycle}
                    onChange={e => setForm(f => ({ ...f, billingCycle: e.target.value as BillingCycle }))}
                    className="bg-gray-800 text-white text-sm rounded-lg px-2 py-2 outline-none"
                  >
                    <option value="monthly">月払い</option>
                    <option value="yearly">年払い</option>
                  </select>
                </div>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                  className="w-full bg-gray-800 text-white text-sm rounded-lg px-3 py-2 outline-none"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={addSub}
                    disabled={!form.name || !form.amount}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white text-sm font-bold py-2 rounded-lg transition-colors"
                  >
                    追加する
                  </button>
                  <button
                    onClick={() => { setShowAdd(false); setForm({ ...EMPTY }); }}
                    className="px-4 text-gray-400 text-sm"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ━━ 安心セクション ━━ */}
        <div className="bg-gray-900 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-400 flex-shrink-0" />
            <p className="text-sm font-bold text-white">安心して使えます</p>
          </div>
          <ul className="space-y-2">
            {[
              '決済はStripeを使用（業界標準のセキュリティ）',
              'アカウント登録不要',
              'データはこのデバイス内のみ保存',
            ].map(item => (
              <li key={item} className="flex items-start gap-2 text-xs text-gray-400 leading-relaxed">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* ━━ フッター ━━ */}
        <div className="pb-4 space-y-2 text-center">
          <p className="text-gray-700 text-xs">
            <a href="/legal" className="underline hover:text-gray-500">特定商取引法に基づく表記</a>
          </p>
        </div>

      </div>
    </div>
  );
}
