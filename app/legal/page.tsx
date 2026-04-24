export default function LegalPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-gray-300">
      <h1 className="text-2xl font-bold text-white mb-8">特定商取引法に基づく表記</h1>

      <table className="w-full text-sm border-collapse">
        <tbody>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top w-40">販売者名</th>
            <td className="py-4">渡邉真也</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">所在地</th>
            <td className="py-4">請求があった場合、遅滞なく開示します</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">運営責任者</th>
            <td className="py-4">渡邉真也</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">電話番号</th>
            <td className="py-4">070-8456-7355</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">連絡先</th>
            <td className="py-4">zhenye271@gmail.com</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">販売価格</th>
            <td className="py-4">480円（税込）※買い切り</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">商品・サービス内容</th>
            <td className="py-4">サブスク帳プレミアム機能（月額サブスクリプション管理アプリの無制限登録・全機能解放）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">支払方法</th>
            <td className="py-4">クレジットカード（Stripe経由）</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">支払時期</th>
            <td className="py-4">購入手続き完了時</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">引渡し時期</th>
            <td className="py-4">決済完了後、即時にプレミアム機能が有効化されます</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">追加手数料</th>
            <td className="py-4">商品・サービスの特性上、追加手数料は発生いたしません</td>
          </tr>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 pr-6 text-gray-400 whitespace-nowrap align-top">返品・キャンセル</th>
            <td className="py-4">デジタルコンテンツの性質上、購入完了後の返金・キャンセルはお受けできません。ご不明な点は購入前にお問い合わせください。</td>
          </tr>
        </tbody>
      </table>

      <p className="mt-8 text-xs text-gray-500">
        ご不明な点は <a href="mailto:zhenye271@gmail.com" className="underline">zhenye271@gmail.com</a> までお問い合わせください。
      </p>

      <div className="mt-8">
        <a href="/" className="text-sm text-gray-400 hover:text-white">← アプリに戻る</a>
      </div>
    </main>
  );
}
