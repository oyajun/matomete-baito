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

export const PREFECTURES: Prefecture[] = prefecturesData as Prefecture[]
