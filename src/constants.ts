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
}

export const EMPLOYMENT_TYPES: EmploymentTypeDefinition[] = [
    { id: 'part_time', label: 'アルバイト・パート', townworkCode: '01', baitoruCodes: ['1'] },
    { id: 'full_time', label: '正社員', townworkCode: '02', baitoruCodes: ['3'] },
    { id: 'contract', label: '契約社員', townworkCode: '03', baitoruCodes: ['4'] },
    { id: 'dispatch', label: '派遣社員', townworkCode: '04', baitoruCodes: ['5', '8', '9'] },
    { id: 'outsourcing', label: '業務委託', townworkCode: '05', baitoruCodes: ['7'] },
]
