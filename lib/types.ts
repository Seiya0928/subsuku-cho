export type BillingCycle = 'monthly' | 'yearly';

export type Category =
  | '動画'
  | '音楽'
  | 'AI・ツール'
  | 'クラウド'
  | 'ゲーム'
  | 'ニュース'
  | '趣味'
  | 'その他';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: BillingCycle;
  category: Category;
  renewalDay: number; // 1-31
  isActive: boolean;
  color: string;
  createdAt: string;
}

export const CATEGORIES: Category[] = [
  '動画', '音楽', 'AI・ツール', 'クラウド', 'ゲーム', 'ニュース', '趣味', 'その他',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  '動画':      '#ef4444',
  '音楽':      '#8b5cf6',
  'AI・ツール': '#3b82f6',
  'クラウド':  '#06b6d4',
  'ゲーム':    '#f59e0b',
  'ニュース':  '#10b981',
  '趣味':      '#f97316',
  'その他':    '#6b7280',
};

export const PRESETS: Omit<Subscription, 'id' | 'createdAt'>[] = [
  { name: 'Netflix',        amount: 1490, billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#ef4444' },
  { name: 'Amazon Prime',   amount: 600,  billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#f59e0b' },
  { name: 'Disney+',        amount: 990,  billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#3b82f6' },
  { name: 'dアニメストア',   amount: 550,  billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#8b5cf6' },
  { name: 'U-NEXT',         amount: 2189, billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#1e293b' },
  { name: 'Hulu',           amount: 1026, billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#10b981' },
  { name: 'Spotify',        amount: 980,  billingCycle: 'monthly', category: '音楽',      renewalDay: 1,  isActive: true, color: '#22c55e' },
  { name: 'Apple Music',    amount: 1080, billingCycle: 'monthly', category: '音楽',      renewalDay: 1,  isActive: true, color: '#f97316' },
  { name: 'YouTube Premium',amount: 1280, billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#ef4444' },
  { name: 'ChatGPT Plus',   amount: 3000, billingCycle: 'monthly', category: 'AI・ツール', renewalDay: 1,  isActive: true, color: '#10b981' },
  { name: 'Claude Pro',     amount: 3000, billingCycle: 'monthly', category: 'AI・ツール', renewalDay: 1,  isActive: true, color: '#f97316' },
  { name: 'Adobe CC',       amount: 6480, billingCycle: 'monthly', category: 'AI・ツール', renewalDay: 1,  isActive: true, color: '#ef4444' },
  { name: 'iCloud+ 50GB',   amount: 130,  billingCycle: 'monthly', category: 'クラウド',  renewalDay: 1,  isActive: true, color: '#3b82f6' },
  { name: 'iCloud+ 200GB',  amount: 400,  billingCycle: 'monthly', category: 'クラウド',  renewalDay: 1,  isActive: true, color: '#3b82f6' },
  { name: 'Google One 100GB',amount: 250, billingCycle: 'monthly', category: 'クラウド',  renewalDay: 1,  isActive: true, color: '#ef4444' },
  { name: 'Nintendo Switch Online', amount: 306, billingCycle: 'monthly', category: 'ゲーム', renewalDay: 1, isActive: true, color: '#ef4444' },
  { name: 'Xbox Game Pass', amount: 850,  billingCycle: 'monthly', category: 'ゲーム',    renewalDay: 1,  isActive: true, color: '#22c55e' },
  { name: 'Microsoft 365',  amount: 1082, billingCycle: 'monthly', category: 'AI・ツール', renewalDay: 1,  isActive: true, color: '#3b82f6' },
  { name: 'ABEMA プレミアム',  amount: 960, billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#00c4cc' },
  { name: '楽天マガジン',      amount: 418, billingCycle: 'monthly', category: 'ニュース',  renewalDay: 1,  isActive: true, color: '#ef4444' },
  { name: 'ニコニコプレミアム', amount: 550, billingCycle: 'monthly', category: '動画',      renewalDay: 1,  isActive: true, color: '#ffffff' },
  { name: 'LINE MUSIC',       amount: 980, billingCycle: 'monthly', category: '音楽',      renewalDay: 1,  isActive: true, color: '#22c55e' },
  { name: 'AWA',              amount: 980, billingCycle: 'monthly', category: '音楽',      renewalDay: 1,  isActive: true, color: '#8b5cf6' },
];
