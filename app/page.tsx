'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PlusCircle, Trash2, TrendingDown, Crown, ChevronDown, ChevronUp, Pencil, Check } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Subscription, Category, CATEGORIES, CATEGORY_COLORS, PRESETS, BillingCycle,
} from '@/lib/types';
import {
  getSubscriptions, saveSubscriptions, isPremium, toMonthly, FREE_LIMIT,
} from '@/lib/storage';

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

export default function HomePage() {
  const [subs, setSubs]         = useState<Subscription[]>([]);
  const [premium, setPrem]      = useState(false);
  const [showAdd, setShowAdd]   = useState(false);
  const [showPreset, setShowPreset] = useState(false);
  const [form, setForm]         = useState({ ...EMPTY });
  const [purchasing] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [editAmount, setEditAmount]   = useState('');
  const editRef = useRef<HTMLInputElement>(null);

  const [stripeError, setStripeError] = useState('');

  useEffect(() => {
    setSubs(getSubscriptions());
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

  // 集計
  const monthlyTotal = subs.reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0);
  const yearlyTotal  = monthlyTotal * 12;
  const activeTotal  = subs.filter(s => s.isActive).reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0);
  const wasteTotal   = subs.filter(s => !s.isActive).reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0);

  const categoryData = CATEGORIES.map(cat => ({
    name: cat,
    value: subs
      .filter(s => s.category === cat)
      .reduce((acc, s) => acc + toMonthly(s.amount, s.billingCycle), 0),
  })).filter(d => d.value > 0);

  const canAdd = premium || subs.length < FREE_LIMIT;
  const presetNotAdded = PRESETS.filter(p => !subs.some(s => s.name === p.name));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-md mx-auto px-4 py-6 space-y-5">

        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">サブスク帳</h1>
            <p className="text-xs text-gray-500">月額費用を一目で把握</p>
          </div>
          {!premium ? (
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              <Crown size={12} />
              {purchasing ? '処理中...' : '¥480 解放'}
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

        {/* サマリーカード */}
        <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">月額合計</p>
            <p className="text-4xl font-black text-white">¥{fmt(monthlyTotal)}</p>
            <p className="text-gray-500 text-sm mt-1">
              年間 <span className="text-white font-bold">¥{fmt(yearlyTotal)}</span>
            </p>
          </div>

          {subs.length > 0 && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800">
              <div className="text-center">
                <p className="text-gray-400 text-xs">使用中</p>
                <p className="text-green-400 font-bold text-lg">
                  ¥{fmt(activeTotal)}<span className="text-xs text-gray-500">/月</span>
                </p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">未使用（無駄）</p>
                <p className="text-red-400 font-bold text-lg">
                  ¥{fmt(wasteTotal)}<span className="text-xs text-gray-500">/月</span>
                </p>
              </div>
            </div>
          )}

          {wasteTotal > 0 && (
            <div className="bg-red-950 border border-red-900 rounded-xl p-3 flex items-start gap-2">
              <TrendingDown size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-red-300 text-xs leading-relaxed">
                未使用サブスクで年間
                <span className="font-bold text-red-200"> ¥{fmt(wasteTotal * 12)} </span>
                が消えています
              </p>
            </div>
          )}
        </div>

        {/* 円グラフ */}
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

        {/* リスト */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              {subs.length}件登録中{!premium && ` (無料 ${subs.length}/${FREE_LIMIT})`}
            </p>
            <p className="text-xs text-gray-600">価格は目安・編集可</p>
          </div>

          {subs.map(s => (
            <div
              key={s.id}
              className={`bg-gray-900 rounded-xl p-3.5 flex items-center gap-3 ${!s.isActive ? 'opacity-50' : ''}`}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
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
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <p className="text-xs text-gray-400">
                      ¥{fmt(s.amount)}/{s.billingCycle === 'monthly' ? '月' : '年'}
                      {s.billingCycle === 'yearly' && (
                        <span className="ml-1 text-gray-500">(月換算 ¥{fmt(toMonthly(s.amount, s.billingCycle))})</span>
                      )}
                    </p>
                    <button onClick={() => startEdit(s)} className="text-gray-600 hover:text-gray-400">
                      <Pencil size={11} />
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(s.id)}
                  className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                    s.isActive
                      ? 'border-green-700 text-green-400'
                      : 'border-red-900 text-red-500'
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
          ))}
        </div>

        {/* 登録上限メッセージ */}
        {!canAdd && (
          <div className="bg-amber-950 border border-amber-800 rounded-xl p-3 text-center">
            <p className="text-amber-300 text-xs">無料プランは5件まで</p>
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="mt-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-4 py-1.5 rounded-full transition-colors disabled:opacity-50"
            >
              ¥480 で無制限に解放
            </button>
          </div>
        )}

        {/* プリセット追加 */}
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

        {/* 手動追加フォーム */}
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

        <p className="text-center text-gray-700 text-xs pb-2">
          データはこのデバイスにのみ保存されます
        </p>
        <p className="text-center text-gray-700 text-xs pb-4">
          <a href="/legal" className="underline hover:text-gray-500">特定商取引法に基づく表記</a>
        </p>
      </div>
    </div>
  );
}
