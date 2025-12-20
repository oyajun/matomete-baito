// プロジェクト名
export const PROJECT_NAME_JA = 'まとめてバイト'
export const PROJECT_NAME_EN = 'MatometeBaito'
export const PROJECT_URL = 'matomete-baito.com'

// 都道府県と市区町村のデータ
// サンプルデータ（実際のプロジェクトでは全国の市区町村データを追加する必要があります）
export interface City {
  code: string
  name: string
}

export interface Prefecture {
  code: string
  name: string
  cities: City[]
}

export const PREFECTURES: Prefecture[] = [
  {
    code: '13',
    name: '東京都',
    cities: [
      { code: '13101', name: '千代田区' },
      { code: '13102', name: '中央区' },
      { code: '13103', name: '港区' },
      { code: '13104', name: '新宿区' },
      { code: '13105', name: '文京区' },
      { code: '13106', name: '台東区' },
      { code: '13107', name: '墨田区' },
      { code: '13108', name: '江東区' },
      { code: '13109', name: '品川区' },
      { code: '13110', name: '目黒区' },
      { code: '13111', name: '大田区' },
      { code: '13112', name: '世田谷区' },
      { code: '13113', name: '渋谷区' },
      { code: '13114', name: '中野区' },
      { code: '13115', name: '杉並区' },
      { code: '13116', name: '豊島区' },
      { code: '13117', name: '北区' },
      { code: '13118', name: '荒川区' },
      { code: '13119', name: '板橋区' },
      { code: '13120', name: '練馬区' },
      { code: '13121', name: '足立区' },
      { code: '13122', name: '葛飾区' },
      { code: '13123', name: '江戸川区' },
    ],
  },
  {
    code: '14',
    name: '神奈川県',
    cities: [
      { code: '14101', name: '横浜市鶴見区' },
      { code: '14102', name: '横浜市神奈川区' },
      { code: '14103', name: '横浜市西区' },
      { code: '14104', name: '横浜市中区' },
      { code: '14105', name: '横浜市南区' },
      { code: '14106', name: '横浜市保土ケ谷区' },
      { code: '14107', name: '横浜市磯子区' },
      { code: '14108', name: '横浜市金沢区' },
      { code: '14109', name: '横浜市港北区' },
      { code: '14110', name: '横浜市戸塚区' },
      { code: '14111', name: '横浜市港南区' },
      { code: '14112', name: '横浜市旭区' },
      { code: '14113', name: '横浜市緑区' },
      { code: '14114', name: '横浜市瀬谷区' },
      { code: '14115', name: '横浜市栄区' },
      { code: '14116', name: '横浜市泉区' },
      { code: '14117', name: '横浜市青葉区' },
      { code: '14118', name: '横浜市都筑区' },
      { code: '14131', name: '川崎市川崎区' },
      { code: '14132', name: '川崎市幸区' },
      { code: '14133', name: '川崎市中原区' },
      { code: '14134', name: '川崎市高津区' },
      { code: '14135', name: '川崎市多摩区' },
      { code: '14136', name: '川崎市宮前区' },
      { code: '14137', name: '川崎市麻生区' },
    ],
  },
  {
    code: '27',
    name: '大阪府',
    cities: [
      { code: '27102', name: '大阪市都島区' },
      { code: '27103', name: '大阪市福島区' },
      { code: '27104', name: '大阪市此花区' },
      { code: '27106', name: '大阪市西区' },
      { code: '27107', name: '大阪市港区' },
      { code: '27108', name: '大阪市大正区' },
      { code: '27109', name: '大阪市天王寺区' },
      { code: '27111', name: '大阪市浪速区' },
      { code: '27113', name: '大阪市西淀川区' },
      { code: '27114', name: '大阪市東淀川区' },
      { code: '27115', name: '大阪市東成区' },
      { code: '27116', name: '大阪市生野区' },
      { code: '27117', name: '大阪市旭区' },
      { code: '27118', name: '大阪市城東区' },
      { code: '27119', name: '大阪市阿倍野区' },
      { code: '27120', name: '大阪市住吉区' },
      { code: '27121', name: '大阪市東住吉区' },
      { code: '27122', name: '大阪市西成区' },
      { code: '27123', name: '大阪市淀川区' },
      { code: '27124', name: '大阪市鶴見区' },
      { code: '27125', name: '大阪市住之江区' },
      { code: '27126', name: '大阪市平野区' },
      { code: '27127', name: '大阪市北区' },
      { code: '27128', name: '大阪市中央区' },
    ],
  },
]
