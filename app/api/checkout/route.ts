import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const origin = new URL(req.url).origin;

  try {
    const body = new URLSearchParams({
      mode:                                              'payment',
      'line_items[0][price_data][currency]':             'jpy',
      'line_items[0][price_data][product_data][name]':   'サブスク帳 プレミアム（買い切り）',
      'line_items[0][price_data][unit_amount]':          '480',
      'line_items[0][quantity]':                         '1',
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/`,
    });

    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method:  'POST',
      headers: {
        'Authorization':  `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type':   'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    const data = await res.json();

    if (!res.ok || !data.url) {
      throw new Error(data.error?.message ?? 'Stripe session creation failed');
    }

    return NextResponse.redirect(data.url, 303);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(msg)}`, 303);
  }
}
