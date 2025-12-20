interface SearchResult {
  siteName: string
  url: string
}

interface SearchResultsProps {
  results: SearchResult[]
}

export function SearchResults({ results }: SearchResultsProps) {
  const handleOpenAll = () => {
    results.forEach((result) => {
      window.open(result.url, '_blank', 'noopener,noreferrer')
    })
  }

  if (results.length === 0) {
    return null
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>検索結果</h2>
        <button onClick={handleOpenAll} className="open-all-button">
          すべて開く
        </button>
      </div>
      <ul className="results-list">
        {results.map((result, index) => (
          <li key={index} className="result-item">
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.siteName}で検索
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
