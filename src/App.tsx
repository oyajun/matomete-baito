import { useState } from 'react'
import './App.css'
import { PROJECT_NAME_JA } from './constants'
import { SearchForm } from './components/SearchForm'
import { SearchResults } from './components/SearchResults'
import { townworkSearchUrl, baitoruSearchUrl } from './urlGenerators'

interface SearchResult {
  siteName: string
  url: string
}

function App() {
  const [results, setResults] = useState<SearchResult[]>([])

  const handleSearch = (keyword: string, cityCodes: string[]) => {
    const searchResults: SearchResult[] = [
      {
        siteName: 'タウンワーク',
        url: townworkSearchUrl(keyword, cityCodes),
      },
      {
        siteName: 'バイトル',
        url: baitoruSearchUrl(keyword, cityCodes),
      },
    ]
    setResults(searchResults)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>{PROJECT_NAME_JA}</h1>
        <p className="subtitle">複数のバイトサイトを一括検索</p>
      </header>
      <main className="app-main">
        <SearchForm onSearch={handleSearch} />
        <SearchResults results={results} />
      </main>
    </div>
  )
}

export default App
