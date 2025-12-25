// URL生成関数のテンプレート

import { CITYCODE_BAITORU_URL, CITYCODE_TOWNWORK, PREFECTURE_SLUG } from './constants'
import citycodeBaitoruUrlRaw from './data/citycode_baitoruurl.json?raw'

// JSONの記述順を保持するために生データから順序を抽出する
const BAITORU_CODE_ORDER = (() => {
    const codes: string[] = []
    const pattern = /"(\d{5})"\s*:/g
    let match: RegExpExecArray | null
    while ((match = pattern.exec(citycodeBaitoruUrlRaw)) !== null) {
        codes.push(match[1])
    }
    return codes
})()

const BAITORU_ORDER_INDEX = (() => {
    const map = new Map<string, number>()
    BAITORU_CODE_ORDER.forEach((code, idx) => map.set(code, idx))
    return map
})()

/**
 * タウンワークの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @returns { url: アフィリエイトURL, html: トラッキングピクセル付きHTMLリンク }
 */
export function townworkSearchUrl(keyword: string, cityCodes: string[]): { url: string; html: string } {
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

    // タウンワークのURLを組み立て（vosパラメータは最後に手動で追加）
    const queryString = params.toString()
    const vosParam = 'vos=dtwmprsc0000060019'
    const separator = queryString ? '&' : ''
    const townworkUrl = `https://townwork.net/prefectures/${prefectureSlug}/job_search/?${queryString}${separator}${vosParam}`

    // ValueCommerceのアフィリエイトリンク（通常のURL用）
    const affiliateUrl = `https://ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892409137&vc_url=${encodeURIComponent(townworkUrl)}`

    // HTML用にエスケープしたアフィリエイトリンク
    const affiliateUrlForHtml = affiliateUrl.replace(/&/g, '&amp;')
    
    // トラッキングピクセル付きHTMLリンクを生成
    const html = `<a href="${affiliateUrlForHtml}" rel="nofollow" target="_blank"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&amp;pid=892409137" height="1" width="0" border="0">タウンワークで検索</a>`

    return {
        url: affiliateUrl,
        html
    }
}

/**
 * バイトルの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @returns バイトルの検索URL
 */
export function baitoruSearchUrl(keyword: string, cityCodes: string[]): string {
    const uniqueCityCodes = [...new Set(cityCodes)]

    // 6桁コードをcitycode_baitoruurl.jsonの記述順でソート
    const sortedCityCodes = [...uniqueCityCodes].sort((a, b) => {
        const a5 = a.substring(0, 5)
        const b5 = b.substring(0, 5)
        const ai = BAITORU_ORDER_INDEX.get(a5) ?? Number.MAX_SAFE_INTEGER
        const bi = BAITORU_ORDER_INDEX.get(b5) ?? Number.MAX_SAFE_INTEGER
        return ai - bi
    })

    // 5桁に変換して重複を除去（順序を保持）
    const normalizedCodes: string[] = []
    const seenCodes = new Set<string>()
    for (const code of sortedCityCodes) {
        const code5 = code.substring(0, 5)
        if (code5.length === 5 && !seenCodes.has(code5)) {
            seenCodes.add(code5)
            normalizedCodes.push(code5)
        }
    }

    if (normalizedCodes.length === 0) {
        throw new Error('市区町村コードを指定してください')
    }

    const orderedCodes = normalizedCodes

    const paths = orderedCodes.map(code => {
        const path = CITYCODE_BAITORU_URL[code]
        if (!path) {
            throw new Error(`バイトルのURLパスが見つかりません: ${code}`)
        }
        return path
    })

    const parsedPaths = paths.map(path => {
        const trimmed = path.replace(/^\/+|\/+$/g, '')
        const segments = trimmed.split('/')

        if (segments.length < 4) {
            throw new Error('バイトルのURLパス形式が不正です')
        }

        const [region, jlist, prefecture, ...rest] = segments
        const slug = rest.pop()
        if (!slug) {
            throw new Error('バイトルのURLパス形式が不正です')
        }

        const category = rest.join('/')
        return { region, jlist, prefecture, category, slug }
    })

    const prefix = (() => {
        const first = parsedPaths[0]
        const isSamePrefix = parsedPaths.every(p =>
            p.region === first.region && p.jlist === first.jlist && p.prefecture === first.prefecture
        )
        if (!isSamePrefix) {
            throw new Error('同じ都道府県内の市区町村を選択してください')
        }
        return `/${first.region}/${first.jlist}/${first.prefecture}/`
    })()

    // カテゴリとスラッグをJSONの順序で結合
    const categoryOrder: string[] = []
    const seenCategories = new Set<string>()
    for (const { category } of parsedPaths) {
        if (category && !seenCategories.has(category)) {
            seenCategories.add(category)
            categoryOrder.push(category)
        }
    }

    // 政令市がない県の場合、カテゴリは空になる
    const categoryPath = categoryOrder.length > 0 ? `${categoryOrder.join('-')}/` : ''
    const basePath = `${prefix}${categoryPath}`

    // スラッグもJSONの順序で重複を除去して結合
    const slugOrder: string[] = []
    const seenSlugs = new Set<string>()
    for (const { slug } of parsedPaths) {
        if (!seenSlugs.has(slug)) {
            seenSlugs.add(slug)
            slugOrder.push(slug)
        }
    }

    const combinedSlug = slugOrder.join('-')
    const encodedKeyword = encodeURIComponent(keyword.trim())
    const keywordSegment = encodedKeyword ? `wrd${encodedKeyword}/` : ''

    return `https://www.baitoru.com${basePath}${combinedSlug}/${keywordSegment}`
}
