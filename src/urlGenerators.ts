// URL生成関数のテンプレート

import { CITYCODE_TOWNWORK, PREFECTURE_SLUG } from './constants'

/**
 * タウンワークの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @returns タウンワークの検索URL
 */
export function townworkSearchUrl(keyword: string, cityCodes: string[]): string {
    // 市区町村コードをタウンワークのコードに変換
    const townworkCodes = cityCodes
        .map(citycode => {
            const mapping = CITYCODE_TOWNWORK.find(m => m.citycode === citycode)
            return mapping?.townwork_code
        })
        .filter((code): code is string => code !== null && code !== undefined)

    if (townworkCodes.length === 0) {
        throw new Error('有効な市区町村コードが見つかりません')
    }

    // 都道府県コードを取得（市区町村コードの最初の2桁）
    const prefectureCode = cityCodes[0].substring(0, 2)
    const prefectureSlug = PREFECTURE_SLUG[prefectureCode]

    if (!prefectureSlug) {
        throw new Error('都道府県が見つかりません')
    }

    // maパラメータ（6桁）とsaパラメータ（9桁）に分類
    const maParams: string[] = []
    const saParams: string[] = []

    for (const code of townworkCodes) {
        if (code.length === 9) {
            // 政令市の区コード
            saParams.push(code)
        } else if (code.length === 6) {
            // 市区町村コード
            maParams.push(code)
        }
    }

    // URLのクエリパラメータを組み立て
    const params = new URLSearchParams()

    // maパラメータを追加
    for (const ma of maParams) {
        params.append('ma', ma)
    }

    // saパラメータを追加
    for (const sa of saParams) {
        params.append('sa', sa)
    }

    // キーワードを追加（URLSearchParamsが自動的にエンコードする）
    if (keyword.trim()) {
        params.append('kw', keyword)
    }

    // saパラメータがある場合はactパラメータを追加
    if (saParams.length > 0) {
        params.append('act', 'true')
    }

    // URLを組み立て
    const queryString = params.toString()
    return `https://townwork.net/prefectures/${prefectureSlug}/job_search/?${queryString}`
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
