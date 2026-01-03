// プロジェクト名
export const PROJECT_NAME_JA = 'まとめてバイト'
export const PROJECT_NAME_EN = 'MatometeBaito'
export const PROJECT_URL = 'matomete-baito.com'

// 都道府県と市区町村のデータ型定義
export interface City {
    code: string
    name: string
}

export interface Prefecture {
    code: string
    name: string
    cities: City[]
}

// 都道府県と市区町村のデータをJSONファイルから読み込み
import prefecturesData from './data/prefectures.json'
import citycodeData from './data/citycode_townwork.json'
import citycodeBaitoruUrlData from './data/citycode_baitoruurl.json'

export const PREFECTURES: Prefecture[] = prefecturesData as Prefecture[]

// 市区町村コードとタウンワークコードのマッピング
export interface CitycodeMapping {
    citycode: string
    townwork_code: string | null
}

export const CITYCODE_TOWNWORK: CitycodeMapping[] = citycodeData as CitycodeMapping[]

// 市区町村コードとバイトルURLパスのマッピング
export const CITYCODE_BAITORU_URL: Record<string, string> = citycodeBaitoruUrlData as Record<string, string>

// 都道府県コードとタウンワークのslugのマッピング
export const PREFECTURE_SLUG: Record<string, string> = {
    '01': 'hokkaido',
    '02': 'aomori',
    '03': 'iwate',
    '04': 'miyagi',
    '05': 'akita',
    '06': 'yamagata',
    '07': 'fukushima',
    '08': 'ibaraki',
    '09': 'tochigi',
    '10': 'gunma',
    '11': 'saitama',
    '12': 'chiba',
    '13': 'tokyo',
    '14': 'kanagawa',
    '15': 'niigata',
    '16': 'toyama',
    '17': 'ishikawa',
    '18': 'fukui',
    '19': 'yamanashi',
    '20': 'nagano',
    '21': 'gifu',
    '22': 'shizuoka',
    '23': 'aichi',
    '24': 'mie',
    '25': 'shiga',
    '26': 'kyoto',
    '27': 'osaka',
    '28': 'hyogo',
    '29': 'nara',
    '30': 'wakayama',
    '31': 'tottori',
    '32': 'shimane',
    '33': 'okayama',
    '34': 'hiroshima',
    '35': 'yamaguchi',
    '36': 'tokushima',
    '37': 'kagawa',
    '38': 'ehime',
    '39': 'kochi',
    '40': 'fukuoka',
    '41': 'saga',
    '42': 'nagasaki',
    '43': 'kumamoto',
    '44': 'oita',
    '45': 'miyazaki',
    '46': 'kagoshima',
    '47': 'okinawa'
}

// 雇用形態の定義
export type EmploymentTypeId = 'part_time' | 'full_time' | 'contract' | 'dispatch' | 'outsourcing'

export interface EmploymentTypeDefinition {
    id: EmploymentTypeId
    label: string
    townworkCode: string
    baitoruCodes: string[]
    shigotoinCodes: string[]
}

export const EMPLOYMENT_TYPES: EmploymentTypeDefinition[] = [
    { id: 'part_time', label: 'アルバイト・パート', townworkCode: '01', baitoruCodes: ['1'], shigotoinCodes: ['04'] },
    { id: 'full_time', label: '正社員', townworkCode: '02', baitoruCodes: ['3'], shigotoinCodes: ['01'] },
    { id: 'contract', label: '契約社員', townworkCode: '03', baitoruCodes: ['4'], shigotoinCodes: ['03'] },
    { id: 'dispatch', label: '派遣社員', townworkCode: '04', baitoruCodes: ['5', '8', '9'], shigotoinCodes: ['02', '08'] },
    { id: 'outsourcing', label: '業務委託', townworkCode: '05', baitoruCodes: ['7'], shigotoinCodes: ['06'] },
]

// リクオプ企業の定義
export interface RecopCompany {
    name: string
    domain: string
}

export interface RecopCategory {
    category: string
    companies: RecopCompany[]
}

export const RECOP_CATEGORIES: RecopCategory[] = [
    {
        category: 'コンビニ',
        companies: [
            { name: 'セブンイレブン', domain: 'ptj.sej.co.jp/arbeit/recruitment' },
            { name: 'ローソン', domain: 'crew.lawson.co.jp' },
        ]
    },
    {
        category: 'ドラッグストア',
        companies: [
            { name: 'ツルハ', domain: 'tsuruha-g.work' },
            { name: 'ウエルシア', domain: 'welcia-yakkyoku-recruit.net' },
        ]
    }
]

// リクオプの地域コードマッピング
export const RECOP_REGION_MAP: Record<string, string> = {
    '01': 'Hokkaido',
    '02': 'Tohoku',
    '03': 'Tohoku',
    '04': 'Tohoku',
    '05': 'Tohoku',
    '06': 'Tohoku',
    '07': 'Tohoku',
    '08': 'Kanto',
    '09': 'Kanto',
    '10': 'Kanto',
    '11': 'Kanto',
    '12': 'Kanto',
    '13': 'Kanto',
    '14': 'Kanto',
    '15': 'Chubu',
    '16': 'Chubu',
    '17': 'Chubu',
    '18': 'Chubu',
    '19': 'Chubu',
    '20': 'Chubu',
    '21': 'Chubu',
    '22': 'Chubu',
    '23': 'Chubu',
    '24': 'Kinki',
    '25': 'Kinki',
    '26': 'Kinki',
    '27': 'Kinki',
    '28': 'Kinki',
    '29': 'Kinki',
    '30': 'Kinki',
    '31': 'Chugoku',
    '32': 'Chugoku',
    '33': 'Chugoku',
    '34': 'Chugoku',
    '35': 'Chugoku',
    '36': 'Shikoku',
    '37': 'Shikoku',
    '38': 'Shikoku',
    '39': 'Shikoku',
    '40': 'Kyushu',
    '41': 'Kyushu',
    '42': 'Kyushu',
    '43': 'Kyushu',
    '44': 'Kyushu',
    '45': 'Kyushu',
    '46': 'Kyushu',
    '47': 'Okinawa'
}

// リクオプの都道府県名マッピング（英語表記）
export const RECOP_PREFECTURE_MAP: Record<string, string> = {
    '01': 'Hokkaido',
    '02': 'Aomori',
    '03': 'Iwate',
    '04': 'Miyagi',
    '05': 'Akita',
    '06': 'Yamagata',
    '07': 'Fukushima',
    '08': 'Ibaraki',
    '09': 'Tochigi',
    '10': 'Gunma',
    '11': 'Saitama',
    '12': 'Chiba',
    '13': 'Tokyo',
    '14': 'Kanagawa',
    '15': 'Niigata',
    '16': 'Toyama',
    '17': 'Ishikawa',
    '18': 'Fukui',
    '19': 'Yamanashi',
    '20': 'Nagano',
    '21': 'Gifu',
    '22': 'Shizuoka',
    '23': 'Aichi',
    '24': 'Mie',
    '25': 'Shiga',
    '26': 'Kyoto',
    '27': 'Osaka',
    '28': 'Hyogo',
    '29': 'Nara',
    '30': 'Wakayama',
    '31': 'Tottori',
    '32': 'Shimane',
    '33': 'Okayama',
    '34': 'Hiroshima',
    '35': 'Yamaguchi',
    '36': 'Tokushima',
    '37': 'Kagawa',
    '38': 'Ehime',
    '39': 'Kochi',
    '40': 'Fukuoka',
    '41': 'Saga',
    '42': 'Nagasaki',
    '43': 'Kumamoto',
    '44': 'Oita',
    '45': 'Miyazaki',
    '46': 'Kagoshima',
    '47': 'Okinawa'
}
