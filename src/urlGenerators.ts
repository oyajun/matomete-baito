// URL生成関数のテンプレート

import { CITYCODE_BAITORU_URL, CITYCODE_TOWNWORK, PREFECTURE_SLUG } from './constants'

/**
 * タウンワークの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @returns タウンワークの検索URL
 */
export function townworkSearchUrl(keyword: string, cityCodes: string[]): string {
    // 重複を削除
    const uniqueCityCodes = [...new Set(cityCodes)]

    // 市区町村コードをタウンワークのコードに変換
    const townworkCodes = uniqueCityCodes
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
    const uniqueCityCodes = [...new Set(cityCodes)]
    const normalizedCodes = [...new Set(uniqueCityCodes
        .map(code => code.substring(0, 5))
        .filter(code => code.length === 5))]

    if (normalizedCodes.length === 0) {
        throw new Error('市区町村コードを指定してください')
    }

    const orderIndex = (() => {
        const entries = Object.keys(CITYCODE_BAITORU_URL)
        const indexMap = new Map<string, number>()
        entries.forEach((code, idx) => indexMap.set(code, idx))
        return indexMap
    })()

    const orderedCodes = [...normalizedCodes].sort((a, b) => {
        const ai = orderIndex.get(a) ?? Number.MAX_SAFE_INTEGER
        const bi = orderIndex.get(b) ?? Number.MAX_SAFE_INTEGER
        return ai - bi
    })

    const paths = orderedCodes.map(code => {
        const path = CITYCODE_BAITORU_URL[code]
        if (!path) {
            throw new Error(`バイトルのURLパスが見つかりません: ${code}`)
        }
        return path
    })

    const basePath = (() => {
        const prefixes = paths.map(path => {
            const trimmed = path.endsWith('/') ? path.slice(0, -1) : path
            const lastSlash = trimmed.lastIndexOf('/')
            if (lastSlash === -1) {
                throw new Error('バイトルのURLパス形式が不正です')
            }
            return trimmed.slice(0, lastSlash + 1)
        })

        const uniqueBases = new Set(prefixes)
        if (uniqueBases.size !== 1) {
            throw new Error('同じエリア内の市区町村を選択してください')
        }

        return prefixes[0]
    })()

    const slugs = paths.map(path => {
        const trimmed = path.endsWith('/') ? path.slice(0, -1) : path
        const lastSlash = trimmed.lastIndexOf('/')
        return trimmed.slice(lastSlash + 1)
    })

    // 同じスラッグはまとめる
    const uniqueSlugs = [...new Set(slugs)]

    const combinedSlug = uniqueSlugs.join('-')
    const encodedKeyword = encodeURIComponent(keyword.trim())
    const keywordSegment = encodedKeyword ? `wrd${encodedKeyword}/` : ''

    return `https://www.baitoru.com${basePath}${combinedSlug}/${keywordSegment}`
}
