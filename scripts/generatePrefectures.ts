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

// CSVファイルを読み込む
const csvPath = path.join(__dirname, '../../baito-util/000925835.csv')
const csvContent = fs.readFileSync(csvPath, 'utf-8')

// CSVをパース
const lines = csvContent.trim().split('\n').slice(1) // ヘッダーをスキップ
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
  
  // 市全体のコード（例: 141003）は除外し、区のみを追加
  // 政令市の場合、市全体のコードは末尾が000-009の範囲になることが多い
  // 区のコードはそれ以外
  const lastThreeDigits = row.code.substring(2)
  const isWardOrCity = parseInt(lastThreeDigits) >= 10
  
  if (isWardOrCity) {
    prefecture.cities.push({
      code: row.code,
      name: row.cityName,
    })
  }
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
