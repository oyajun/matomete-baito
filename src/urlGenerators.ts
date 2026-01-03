// URL生成関数

import { CITYCODE_BAITORU_URL, CITYCODE_TOWNWORK, PREFECTURE_SLUG, EMPLOYMENT_TYPES, PREFECTURES, RECOP_REGION_MAP, RECOP_PREFECTURE_MAP } from './constants'
import type { EmploymentTypeId } from './constants'
import citycodeBaitoruUrlRaw from './data/citycode_baitoruurl.json?raw'

// ヘルパー関数
function getUniqueCodes(codes: string[]): string[] {
    return [...new Set(codes)]
}

function findPrefectureByCode(prefectureCode: string) {
    const prefecture = PREFECTURES.find(p => p.code === prefectureCode)
    if (!prefecture) {
        throw new Error('都道府県が見つかりません')
    }
    return prefecture
}

function appendEmploymentParams(
    params: URLSearchParams,
    employmentTypes: EmploymentTypeId[],
    paramName: string,
    getCode: (typeId: EmploymentTypeId) => string | undefined
): void {
    for (const typeId of employmentTypes) {
        const code = getCode(typeId)
        if (code) {
            params.append(paramName, code)
        }
    }
}

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
 * @param employmentTypes 雇用形態の配列
 * @returns 検索URL
 */
export function townworkSearchUrl(keyword: string, cityCodes: string[], employmentTypes: EmploymentTypeId[] = []): string {
    const uniqueCityCodes = getUniqueCodes(cityCodes)

    // 市区町村コードをタウンワークのコードに変換
    const townworkCodes = uniqueCityCodes
        .map(citycode => CITYCODE_TOWNWORK.find(m => m.citycode === citycode)?.townwork_code)
        .filter((code): code is string => code !== null && code !== undefined)

    if (townworkCodes.length === 0) {
        throw new Error('有効な市区町村コードが見つかりません')
    }

    // 都道府県コードを取得
    const prefectureCode = cityCodes[0].substring(0, 2)
    const prefectureSlug = PREFECTURE_SLUG[prefectureCode]
    if (!prefectureSlug) {
        throw new Error('都道府県が見つかりません')
    }

    // maパラメータ（6桁）とsaパラメータ（9桁）に分類
    const { ma: maParams, sa: saParams } = townworkCodes.reduce(
        (acc, code) => {
            if (code.length === 9) {
                acc.sa.push(code)
            } else if (code.length === 6) {
                acc.ma.push(code)
            }
            return acc
        },
        { ma: [] as string[], sa: [] as string[] }
    )

    // URLのクエリパラメータを組み立て
    const params = new URLSearchParams()
    maParams.forEach(ma => params.append('ma', ma))
    saParams.forEach(sa => params.append('sa', sa))

    // 雇用形態パラメータを追加
    appendEmploymentParams(params, employmentTypes, 'emp', (typeId) =>
        EMPLOYMENT_TYPES.find(t => t.id === typeId)?.townworkCode
    )

    // キーワードを追加
    if (keyword.trim()) {
        params.append('kw', keyword)
    }

    return `https://townwork.net/prefectures/${prefectureSlug}/job_search/?${params.toString()}`
}

/**
 * バイトルの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @param employmentTypes 雇用形態の配列
 * @returns バイトルの検索URL
 */
export function baitoruSearchUrl(keyword: string, cityCodes: string[], employmentTypes: EmploymentTypeId[] = []): string {
    const uniqueCityCodes = getUniqueCodes(cityCodes)

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

    // 雇用形態セグメントの生成
    const employmentSegment = (() => {
        if (employmentTypes.length === 0) return ''

        const codes = employmentTypes.flatMap(typeId =>
            EMPLOYMENT_TYPES.find(t => t.id === typeId)?.baitoruCodes.map(code => `btp${code}`) ?? []
        )

        const uniqueCodes = getUniqueCodes(codes)
        const specifiedOrder = ['btp1', 'btp3', 'btp4', 'btp5', 'btp8', 'btp9', 'btp7']
        const orderedCodes = specifiedOrder.filter(code => uniqueCodes.includes(code))

        return orderedCodes.length > 0 ? `${orderedCodes.join('-')}/` : ''
    })()

    const encodedKeyword = encodeURIComponent(keyword.trim())
    const keywordSegment = encodedKeyword ? `wrd${encodedKeyword}/` : ''

    return `https://www.baitoru.com${basePath}${combinedSlug}/${employmentSegment}${keywordSegment}`
}

/**
 * シゴトinの検索URLを生成する
 * @param keyword 検索キーワード
 * @param cityCodes 市区町村コードの配列
 * @param employmentTypes 雇用形態の配列
 * @returns シゴトinの検索URL
 */
export function shigotoinSearchUrl(keyword: string, cityCodes: string[], employmentTypes: EmploymentTypeId[] = []): string {
    if (cityCodes.length === 0) {
        throw new Error('市区町村コードを指定してください')
    }

    // 最初の市区町村コードのみを使用
    const firstCityCode = cityCodes[0]
    const prefectureCode = firstCityCode.substring(0, 2)
    const prefecture = findPrefectureByCode(prefectureCode)

    // 市区町村コードから市区町村名を取得
    const city = prefecture.cities.find(c => c.code === firstCityCode)
    if (!city) {
        throw new Error('市区町村が見つかりません')
    }

    // lqパラメータの形式: 都道府県名 市区町村名
    const lq = `${prefecture.name} ${city.name}`

    // URLパラメータを手動で組み立て
    const queryParts: string[] = ['dst=0']

    // 雇用形態パラメータを追加
    employmentTypes.forEach(typeId => {
        const typeDef = EMPLOYMENT_TYPES.find(t => t.id === typeId)
        typeDef?.shigotoinCodes.forEach(code => {
            queryParts.push(`empls[]=${encodeURIComponent(code)}`)
        })
    })

    queryParts.push(`lq=${encodeURIComponent(lq)}`)

    if (keyword.trim()) {
        queryParts.push(`q=${encodeURIComponent(keyword)}`)
    }

    return `https://shigotoin.com/search?${queryParts.join('&')}`
}

/**
 * リクオプの検索URLを生成する
 * @param domain 企業のドメイン
 * @param cityCodes 市区町村コードの配列
 * @returns リクオプの検索URL
 */
export function recopSearchUrl(domain: string, cityCodes: string[]): string {
    if (cityCodes.length === 0) {
        throw new Error('市区町村コードを指定してください')
    }

    // 最初の市区町村コードから都道府県コードを取得
    const firstCityCode = cityCodes[0]
    const prefectureCode = firstCityCode.substring(0, 2)

    // 地域名（英語）を取得
    const region = RECOP_REGION_MAP[prefectureCode]
    if (!region) {
        throw new Error(`地域が見つかりません: ${prefectureCode}`)
    }

    // 都道府県名（英語）を取得
    const prefecture = RECOP_PREFECTURE_MAP[prefectureCode]
    if (!prefecture) {
        throw new Error(`都道府県が見つかりません: ${prefectureCode}`)
    }

    // 地域コードは市区町村コードの最初の5桁をカンマで連結
    const areaCodes = cityCodes.map(code => code.substring(0, 5)).join(',')

    // https://企業のドメイン/jobfind-pc/area/地域/都道府県/地域コード
    return `https://${domain}/jobfind-pc/area/${region}/${prefecture}/${areaCodes}`
}
