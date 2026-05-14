@AGENTS.md

# ユースセンターまるいち 入退室管理システム

## プロジェクト概要
長野県富士見町のユースセンター「まるいち」の入退室管理Webアプリ。
QRコードまたは手動番号入力でメンバーを識別し、入室・退室を記録する。

## 技術スタック
- **フレームワーク**: Next.js 16 (App Router) + TypeScript
- **スタイリング**: Tailwind CSS v4
- **カメラスキャン**: @zxing/library（QRコード・バーコード読取）
- **ホスティング**: Vercel（自動デプロイ。main push → Production）
- **データ管理**: Googleスプレッドシート + Google Apps Script
- **リポジトリ**: https://github.com/fujimiyc/maruichi

## 外部サービス連携（重要）

### メンバー検索（読み取り）
- Google Sheets の**公開CSV**エンドポイント（`/gviz/tq?tqx=out:csv`）で取得
- スプレッドシートID: `1mt4MVLIH8m7anp5ypBc9fNVtxHvf_Hvyi7BRbgrBaEg`
- シート名: `新規登録者名簿`（B列=ID 6桁ゼロ埋め, C列=氏名）
- 60秒キャッシュ（`next: { revalidate: 60 }`）
- **`googleapis`パッケージは使わない**。認証不要の公開CSVで十分
- スプレッドシートの共有設定が「制限付き」でも動作する（「ウェブに公開」設定に依存）

### 入退室記録（書き込み）
- **Google Apps Script (GAS)** 経由でスプレッドシートの「入退室一覧」シートに書き込み
- GAS URL: コード内にハードコード（`attendance/route.ts`参照）
- GASはオーナー権限で実行されるため、シート保護の影響を受けない
- Apps Scriptのコードはスプレッドシートの「拡張機能 → Apps Script」にある
- **GAS変更時は必ず新しいバージョンでデプロイし直すこと**

## ファイル構成
```
app/
├── page.tsx                 # メイン画面（カメラスキャン＋番号入力＋送信ボタン）
├── confirm/page.tsx         # 確認画面（名前表示＋入室する/退室する/もどるボタン）
├── complete/page.tsx        # 完了画面（入室完了!/退室完了!＋3秒後自動リダイレクト）
├── api/
│   ├── member/route.ts      # GET /api/member?id=000001 → 公開CSVからメンバー検索
│   └── attendance/route.ts  # POST /api/attendance → GASに入退室データ送信
├── components/
│   └── Scanner.tsx          # QRコードカメラスキャンコンポーネント
├── layout.tsx               # ルートレイアウト（430px幅、中央寄せ）
└── globals.css              # TailwindCSS + カスタムフォント
middleware.ts                # APIレート制限（60秒30リクエスト）
next.config.ts               # セキュリティヘッダー（CSP, HSTS等）
public/
└── complete.png             # 完了画面イラスト
data/                        # 未使用（過去の名残）
```

## 画面フロー
```
メイン画面（/）
  タイトル「まるいち入退室フォーム」（ロゴ画像なし）
  カメラスキャンまたは6桁番号入力 → 送信ボタン
    ↓
  /api/member?id=XXX で公開CSVからメンバー検索
    ↓
確認画面（/confirm）
  名前を表示。「入室する」「退室する」ボタンを選択
  ボタン押下でローディングスピナー表示
  「入退室画面にもどる」ボタンあり
    ↓
  /api/attendance へPOST（GASに送信）
    ↓
完了画面（/complete）
  「入室完了！」or「退室完了！」+ complete.png
  3秒後に自動で/へリダイレクト
```

## セキュリティ対策
- **next.config.ts**: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **middleware.ts**: APIレート制限（60秒あたり30リクエスト/IP）
- **attendance/route.ts**: 入力バリデーション（ID 6桁数字, 名前 50字以内, アクション 入室/退室のみ）

## カラー定義
- メインカラー（緑）: `#2D7A6B`
- 退室カラー（黒）: `#000000`
- エラー文字: `#FF0000`
- 背景: `#FFFFFF`

## スプレッドシートのシート構成
1. **新規登録（フォーム回答）**: Googleフォームの回答が入る
2. **新規登録者名簿**: メンバー台帳。B列=ID, C列=氏名
3. **入退室一覧**: アプリからの入退室ログ
4. **本日の入退室**: 当日の入退室データ
5. **日別集計**: 年間の日別来館者数

## Apps Script の関数一覧
- `doPost(e)`: 入退室記録エンドポイント。入退室一覧に書込＋本日の入退室を自動更新
- `transferFormToRegistry()`: フォーム回答→名簿転記（トリガー自動実行）
- `updateTodayAttendance()`: 本日の入退室シート更新
- `setupDailyFormulas()`: 日別集計の数式一括セット（年度変更時に再実行）
- `setupTriggers()`: フォーム送信トリガー設定（初回のみ）

## デプロイ
```bash
git push origin main  # → Vercelが自動デプロイ（1〜2分）
```

## 注意事項
- GAS変更時は「デプロイを管理 → 新しいバージョンでデプロイ」が必須
- スプレッドシートのID列（B列）は「書式なしテキスト」にすること
- `data/` フォルダは未使用（過去の名残）
- Vercelアカウント: fujimi.yc@gmail.com / GitHub: fujimiyc
