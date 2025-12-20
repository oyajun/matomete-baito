import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface CsvRow {
    code: string
    prefectureName: string
    cityName: string
    prefectureNameKana: string
    cityNameKana: string
}

interface City {
    code: string
    name: string
}

interface Prefecture {
    code: string
    name: string
    cities: City[]
}

// CSVファイルを読み込む（通常の市区町村）
const csvPath = path.join(__dirname, '../../baito-util/000925835.csv')
const csvContent = fs.readFileSync(csvPath, 'utf-8')

// 政令市のCSVファイルを読み込む（政令市と区のデータ）
const designatedCitiesCsvPath = path.join(__dirname, '../../baito-util/000925835a.csv')
const designatedCitiesCsvContent = fs.readFileSync(designatedCitiesCsvPath, 'utf-8')

// 両方のCSVを結合
const allCsvContent = csvContent + '\n' + designatedCitiesCsvContent

// CSVをパース
const lines = allCsvContent.trim().split('\n').slice(1) // ヘッダーをスキップ
const rows: CsvRow[] = lines.map(line => {
    const match = line.match(/^(\d+),([^,]+),([^,]+),([^,]+),(.+)$/)
    if (!match) {
        console.error('Failed to parse line:', line)
        return null
    }
    return {
        code: match[1],
        prefectureName: match[2],
        cityName: match[3],
        prefectureNameKana: match[4],
        cityNameKana: match[5],
    }
}).filter((row): row is CsvRow => row !== null)

// 政令市のリストを作成（市名だけで、区を含むものを検索）
const designatedCities = new Set<string>()
rows.forEach(row => {
    // 「○○市△△区」のパターンをチェック
    const wardMatch = row.cityName.match(/^(.+市)(.+区)$/)
    if (wardMatch) {
        designatedCities.add(wardMatch[1]) // 「札幌市」などを追加
    }
})

console.log('Designated cities:', Array.from(designatedCities))

// 都道府県コードと市区町村コードに分割
// 団体コードの最初の2桁が都道府県コード
const prefectureMap = new Map<string, Prefecture>()

rows.forEach(row => {
    const prefCode = row.code.substring(0, 2)

    if (!prefectureMap.has(prefCode)) {
        prefectureMap.set(prefCode, {
            code: prefCode,
            name: row.prefectureName,
            cities: [],
        })
    }

    const prefecture = prefectureMap.get(prefCode)!

    // 政令市全体のエントリ（「札幌市」「静岡市」など）を除外
    // designatedCitiesに含まれる市名と完全一致するものは除外
    if (designatedCities.has(row.cityName)) {
        return // 政令市全体なので除外
    }

    // 東京都の特別区の場合は「東京都」を省略して「渋谷区」のみにする
    // それ以外（政令市の区）は「静岡市清水区」のように市名を含める
    const displayName = prefCode === '13' && row.cityName.endsWith('区') && !row.cityName.includes('市')
        ? row.cityName
        : row.cityName

    prefecture.cities.push({
        code: row.code,
        name: displayName,
    })
})

// Mapを配列に変換してソート
const prefectures: Prefecture[] = Array.from(prefectureMap.values()).sort((a, b) =>
    a.code.localeCompare(b.code)
)

// JSONファイルとして出力
const outputPath = path.join(__dirname, '../src/data/prefectures.json')
const outputDir = path.dirname(outputPath)

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
}

fs.writeFileSync(outputPath, JSON.stringify(prefectures, null, 2), 'utf-8')

console.log(`Generated ${outputPath}`)
console.log(`Total prefectures: ${prefectures.length}`)
console.log(`Total cities: ${prefectures.reduce((sum, p) => sum + p.cities.length, 0)}`)
