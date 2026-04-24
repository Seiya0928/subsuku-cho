import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const sessionId = new URL(req.url).searchParams.get('session_id');
  if (!sessionId) return NextResponse.json({ ok: false }, { status: 400 });

  const res = await fetch(
    `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
    { headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` } }
  );
  const data = await res.json();

  if (res.ok && data.payment_status === 'paid') {
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false }, { status: 402 });
}
