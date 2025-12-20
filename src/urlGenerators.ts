// URL生成関数のテンプレート
// あとから実装する

/**
 * タウンワークの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @returns タウンワークの検索URL
 */
export function townworkSearchUrl(keyword: string, cityCodes: string[]): string {
  // TODO: 実装する
  // キーワードをエンコード
  const encodedKeyword = encodeURIComponent(keyword)
  
  // 市区町村コードをタウンワークのコードに変換してURLを組み立てる
  // 仮実装
  return `https://townwork.net/search/?keyword=${encodedKeyword}&cities=${cityCodes.join(',')}`
}

/**
 * バイトルの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @returns バイトルの検索URL
 */
export function baitoruSearchUrl(keyword: string, cityCodes: string[]): string {
  // TODO: 実装する
  // キーワードをエンコード
  const encodedKeyword = encodeURIComponent(keyword)
  
  // 市区町村コードをバイトルのコードに変換してURLを組み立てる
  // 仮実装
  return `https://www.baitoru.com/kw${encodedKeyword}/?cities=${cityCodes.join(',')}`
}
