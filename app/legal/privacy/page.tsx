export default function PrivacyPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-gray-300">
      <h1 className="text-2xl font-bold text-white mb-2">プライバシーポリシー</h1>
      <p className="text-xs text-gray-500 mb-10">最終更新日：2026年4月24日</p>

      <div className="space-y-8 text-sm leading-relaxed">

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">1. 収集する情報</h2>
          <p>
            本アプリ（サブスク帳）は、ユーザーが登録したサブスクリプション情報をブラウザの
            <strong className="text-gray-100"> localStorage </strong>
            に保存します。このデータは外部サーバーには一切送信・保存されません。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">2. 利用目的</h2>
          <p>収集したデータはサービス提供（サブスク情報の表示・管理）のためのみ使用します。</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">3. 第三者提供</h2>
          <p>ユーザーの情報を第三者に提供・開示することはありません。</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">4. 外部サービス（Stripe）</h2>
          <p>
            プレミアム機能の決済には <strong className="text-gray-100">Stripe</strong> を使用しています。
            決済情報（カード番号等）は本アプリには渡らず、Stripe が直接処理します。
            Stripeのプライバシーポリシーは{' '}
            <a
              href="https://stripe.com/jp/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white"
            >
              こちら
            </a>
            をご確認ください。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">5. Cookie・トラッキング</h2>
          <p>現時点では Cookie およびトラッキング技術は使用していません。</p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">6. 免責事項</h2>
          <p>
            ブラウザのキャッシュ削除・デバイス変更等によるデータ消失について、当方は責任を負いません。
            重要なデータは定期的に手元で記録されることをお勧めします。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">7. プライバシーポリシーの変更</h2>
          <p>
            本ポリシーは予告なく変更する場合があります。変更後はこのページに最新版を掲載します。
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-semibold text-white">8. お問い合わせ</h2>
          <p>
            プライバシーに関するお問い合わせは{' '}
            <a href="mailto:zhenye271@gmail.com" className="underline hover:text-white">
              zhenye271@gmail.com
            </a>{' '}
            までご連絡ください。
          </p>
        </section>

      </div>

      <div className="mt-10">
        <a href="/" className="text-sm text-gray-400 hover:text-white">← アプリに戻る</a>
      </div>
    </main>
  );
}
