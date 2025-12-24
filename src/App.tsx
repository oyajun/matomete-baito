import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { PROJECT_NAME_JA } from './constants'
import { SearchForm } from './components/SearchForm'
import { SearchResults } from './components/SearchResults'
import { townworkSearchUrl, baitoruSearchUrl } from './urlGenerators'

interface SearchResult {
  siteName: string
  url: string
}

interface SearchCriteria {
  keyword: string
  cityCodes: string[]
}

function App() {
  const [criteria, setCriteria] = useState<SearchCriteria>({ keyword: '', cityCodes: [] })
  const [results, setResults] = useState<SearchResult[]>([])
  const [helperMessage, setHelperMessage] = useState('市区町村を選択してください')

  const handleCriteriaChange = useCallback((keyword: string, cityCodes: string[]) => {
    setCriteria({ keyword, cityCodes })
  }, [])

  useEffect(() => {
    if (criteria.cityCodes.length === 0) {
      setResults([])
      setHelperMessage('市区町村を選択してください')
      return
    }

    try {
      const searchResults: SearchResult[] = [
        {
          siteName: 'タウンワーク',
          url: townworkSearchUrl(criteria.keyword, criteria.cityCodes),
        },
        {
          siteName: 'バイトル',
          url: baitoruSearchUrl(criteria.keyword, criteria.cityCodes),
        },
      ]
      setResults(searchResults)
      setHelperMessage('')
    } catch (error) {
      setResults([])
      setHelperMessage(
        error instanceof Error ? error.message : '検索URLの生成に失敗しました'
      )
    }
  }, [criteria])

  return (
    <div className="app">
      <header className="app-header">
        <h1>{PROJECT_NAME_JA}</h1>
        <p className="subtitle">複数のバイトサイトを一括検索</p>
      </header>
      <main className="app-main">
        <SearchForm onCriteriaChange={handleCriteriaChange} />
        <SearchResults results={results} helperMessage={helperMessage} />
        <a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892409137&vc_url=https%3A%2F%2Ftownwork.net%2Fprefectures%2Ftokyo%2Fjob_search%2F%3Fma%3D013006%26ma%3D013007%26kw%3Dcafe%26vos%3Ddtwmprsc0000060019" rel="nofollow"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&pid=892409137" height="1" width="0" />タウンワーク</a>
      </main>
    </div>
  )
}

export default App
