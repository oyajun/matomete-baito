import { useCallback, useEffect, useState } from 'react'
import './App.css'
import { PROJECT_NAME_JA } from './constants'
import type { EmploymentTypeId } from './constants'
import { SearchForm } from './components/SearchForm'
import { SearchResults } from './components/SearchResults'
import { townworkSearchUrl, baitoruSearchUrl, shigotoinSearchUrl } from './urlGenerators'

interface SearchResult {
  siteName: string
  url: string
  html?: string
}

interface SearchCriteria {
  keyword: string
  cityCodes: string[]
  employmentTypes: EmploymentTypeId[]
}

function App() {
  const [criteria, setCriteria] = useState<SearchCriteria>({ keyword: '', cityCodes: [], employmentTypes: [] })
  const [results, setResults] = useState<SearchResult[]>([])
  const [helperMessage, setHelperMessage] = useState('市区町村を選択してください')

  const handleCriteriaChange = useCallback((keyword: string, cityCodes: string[], employmentTypes: EmploymentTypeId[]) => {
    setCriteria({ keyword, cityCodes, employmentTypes })
  }, [])

  useEffect(() => {
    if (criteria.cityCodes.length === 0) {
      setResults([])
      setHelperMessage('市区町村を選択してください')
      return
    }

    try {
      const townworkUrl = townworkSearchUrl(criteria.keyword, criteria.cityCodes, criteria.employmentTypes)
      const searchResults: SearchResult[] = [
        {
          siteName: 'タウンワーク',
          url: townworkUrl,
        },
        {
          siteName: 'バイトル',
          url: baitoruSearchUrl(criteria.keyword, criteria.cityCodes, criteria.employmentTypes),
        },
        {
          siteName: 'シゴトin',
          url: shigotoinSearchUrl(criteria.keyword, criteria.cityCodes, criteria.employmentTypes),
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
        <p>広告</p>
        <div className="affiliate-banner">
          <a href="https://px.a8.net/svt/ejp?a8mat=45KMSF+604DDE+5U6E+5Z6WX" rel="nofollow" aria-label="アルバイト求人情報サイトへのリンク">
            <img width="120" height="60" alt="アルバイト求人バナー" src="https://www24.a8.net/svt/bgt?aid=251225439363&wid=001&eno=01&mid=s00000027239001004000&mc=1" />
          </a>
          <img width="1" height="1" src="https://www12.a8.net/0.gif?a8mat=45KMSF+604DDE+5U6E+5Z6WX" alt="" />
        </div>
        <div className="affiliate-banner">
          <a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892412443" rel="nofollow" aria-label="求人情報サイトへのリンク">
            <img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&pid=892412443" width="300" height="250" alt="求人情報バナー" />
          </a>
        </div>
        <div className="affiliate-banner">  
          <a href="//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892412430" rel="nofollow" aria-label="転職・求人情報サイトへのリンク">
            <img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&pid=892412430" width="468" height="60" alt="転職・求人情報バナー"/>
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
