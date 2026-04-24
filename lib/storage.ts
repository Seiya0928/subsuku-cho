import { Subscription } from './types';

const STORAGE_KEY = 'subsuku_cho_subs';
const PREMIUM_KEY = 'subsuku_cho_premium';
export const FREE_LIMIT = 5;

export function getSubscriptions(): Subscription[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSubscriptions(subs: Subscription[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(subs));
}

export function isPremium(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(PREMIUM_KEY) === 'true';
}

export function setPremium(): void {
  localStorage.setItem(PREMIUM_KEY, 'true');
}

export function toMonthly(amount: number, cycle: 'monthly' | 'yearly'): number {
  return cycle === 'yearly' ? Math.round(amount / 12) : amount;
}
