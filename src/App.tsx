import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { PROJECT_NAME_JA } from './constants'
import { SearchForm } from './components/SearchForm'
import { SearchResults } from './components/SearchResults'
import { townworkSearchUrl, baitoruSearchUrl } from './urlGenerators'

interface SearchResult {
  siteName: string
  url: string
  html?: string
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
      const townworkUrl = townworkSearchUrl(criteria.keyword, criteria.cityCodes)
      const searchResults: SearchResult[] = [
        {
          siteName: 'タウンワーク',
          url: townworkUrl,
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
      </main>
      <footer className="affiliate-footer">
        <div className="affiliate-banner">
          <a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892412443" rel="nofollow">
            <img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&pid=892412443" />
          </a>
        </div>
        <div className="affiliate-banner">  
          <a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892412430" rel="nofollow">
            <img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&pid=892412430"/>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
