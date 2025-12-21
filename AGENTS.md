# AGENTS.md

## Project Name
これらは、変数として、あとから簡単に変更できるようにすること
- 日本語名: まとめてバイト
- 英語名: MatometeBaito
- 英語名: matomete-baito
- URL: matomete-baito.com

## Functions
検索条件を指定して、URLを組み立てて、対応サイトの検索結果ページのリンクを表示する。

## 検索条件
### キーワード
スペースはHTMLエンコードされた空白に変換される。
### 市区町村
県をドロップダウンで選択  
市区町村をチェックボックスで指定  
政令市は、市区町村の代わりに市区をチェックボックスで指定  
例: 横浜市中区、横浜市西区、横浜市南区

## 対応サイト
- タウンワーク
- バイトル

## 関数仕様
### townworkSearchUrl(keyword: string, cityCodes: string[]): string
- ma : 市コード/郡コード（townwork）
- sa : 区コード（政令市、特別行政区の場合のみ）（townwork）
- keyword: 検索キーワード (スペースはHTMLエンコードされた空白に変換)
#### 例
https://townwork.net/prefectures/okinawa/job_search/?ma=047005&ma=047006&kw=%E3%82%AB%E3%83%95%E3%82%A7
https://townwork.net/prefectures/kanagawa/job_search/?ma=014014&sa=014001001&sa=014001002&act=true

### baitoruSearchUrl(keyword: string, cityCodes: string[]): string 


## 処理内容
1. キーワードと市区町村コードの配列を受け取る
2. 対応サイトごとに、検索URLを組み立てて返す。（市区町村コードから、各サイトのコードや文字列に変換）
3. 組み立てたURLをリストで表示する

## ユーザーフロー
1. ユーザーがキーワードと市区町村を指定して検索ボタンを押す
2. 指定された条件をもとに、対応サイトの検索URLを組み立てる
3. 組み立てたURLをリストで表示する
4. ユーザーがリンクをクリックすると、対応サイトの検索結果ページが新しいタブで開く
5. 一括で全てのリンクを開くボタンも提供する

## 注意点
- クライアントのみで動作する
- レスポンシブデザイン対応

## Tech stack
- npm
- TypeScript
- Node.js
- Vite
- React
- eslint

## Setup commands
- Install deps: `npm install`
- Start dev server: `npm run dev`
- Run tests: `npm test`

## Code style
- TypeScript strict mode
- Single quotes, no semicolons
- Use functional patterns where possible

