// JSONのキーを省略形に変換するスクリプト
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// prefectures.json を変換
function minifyPrefectures() {
  const filePath = path.join(__dirname, '../src/data/prefectures.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  
  const minified = data.map((pref: any) => ({
    c: pref.code,
    n: pref.name,
    t: pref.cities.map((city: any) => ({
      c: city.code,
      n: city.name
    }))
  }))
  
  fs.writeFileSync(filePath, JSON.stringify(minified, null, 2))
  console.log('✓ prefectures.json を変換しました')
}

// citycode_townwork.json を変換
function minifyCitycodeTownwork() {
  const filePath = path.join(__dirname, '../src/data/citycode_townwork.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  
  const minified = data.map((item: any) => ({
    c: item.citycode,
    t: item.townwork_code
  }))
  
  fs.writeFileSync(filePath, JSON.stringify(minified, null, 2))
  console.log('✓ citycode_townwork.json を変換しました')
}

minifyPrefectures()
minifyCitycodeTownwork()
