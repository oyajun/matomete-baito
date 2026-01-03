import fs from 'fs'
import path from 'path'

interface City {
    c: string  // code
    n: string  // name
}

interface Prefecture {
    c: string   // code
    n: string   // name
    t: City[]   // towns/cities
}

// 区が含まれているかチェック
function hasWard(cityName: string): boolean {
    return /市.+区$/.test(cityName)
}

// 都道府県データを読み込み
const filePath = path.join(process.cwd(), 'src/data/prefectures.json')
const data: Prefecture[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

// 各都道府県の市区町村を並び替え（区を最初に）
const sortedData = data.map(prefecture => ({
    ...prefecture,
    t: prefecture.t.sort((a, b) => {
        const aHasWard = hasWard(a.n)
        const bHasWard = hasWard(b.n)

        // 両方とも区の場合、または両方とも区でない場合は元の順序を維持
        if (aHasWard === bHasWard) {
            return 0
        }

        // 区がある方を先に
        return aHasWard ? -1 : 1
    })
}))

// ファイルに書き込み
fs.writeFileSync(filePath, JSON.stringify(sortedData, null, 2) + '\n', 'utf-8')

console.log('✅ 区を各都道府県の先頭に移動しました')
