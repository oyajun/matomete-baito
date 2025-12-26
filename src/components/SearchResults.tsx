interface SearchResult {
  siteName: string
  url: string
  html?: string
}

interface SearchResultsProps {
  results: SearchResult[]
  helperMessage?: string
}

export function SearchResults({ results, helperMessage }: SearchResultsProps) {
  const resultsAvailable = results.length > 0
  const handleOpenAll = () => {
    if (!resultsAvailable) {
      return
    }
    results.forEach((result) => {
      window.open(result.url, '_blank', 'noopener')
    })
  }
  const placeholder =
    helperMessage || '市区町村を選択するとリンクが表示されます'

  return (
    <div className="search-results">
      <div className="results-header">
        <h2 className="results-title">検索結果</h2>
        <button
          onClick={handleOpenAll}
          className="open-all-button"
          disabled={!resultsAvailable}
        >
          すべて開く
        </button>
      </div>
      {resultsAvailable ? (
        <ul className="results-list">
          {results.map((result, index) => (
            <li key={index} className="result-item">
              {result.html ? (
                <div dangerouslySetInnerHTML={{ __html: result.html }} />
              ) : (
                <>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    {result.siteName}で検索
                  </a>
                  {result.siteName === 'シゴトin' && (
                    <p className="affiliate-notice">シゴトinのリンクはアフィリエイトリンクです。</p>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="results-placeholder">{placeholder}</p>
      )}
    </div>
  )
}
