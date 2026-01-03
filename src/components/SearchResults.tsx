import type { SearchResult, RecopSearchResult } from '../types.d'

interface SearchResultsProps {
  results: SearchResult[]
  recopResults?: RecopSearchResult[]
  helperMessage?: string
}

export function SearchResults({ results, recopResults, helperMessage }: SearchResultsProps) {
  const resultsAvailable = results.length > 0
  const recopResultsAvailable = (recopResults ?? []).some(cat => cat.results.length > 0)
  const handleOpenAll = () => {
    const allResults = [
      ...results,
      ...(recopResults ?? []).flatMap(cat => cat.results)
    ]
    
    allResults.forEach(result => {
      window.open(result.url, '_blank', 'noopener')
    })
  }
  const placeholder =
    helperMessage || '市区町村を選択するとリンクが表示されます'

  const generateAffiliateLink = (result: SearchResult) => {
    if (result.siteName === 'シゴトin') {
      const encodedUrl = encodeURIComponent(result.url)
      const affiliateUrl = `//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892416098&vc_url=${encodedUrl}`
      return (
        <a href={affiliateUrl} rel="nofollow noopener noreferrer" target="_blank">
          <img
            src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&pid=892416098"
            width={0}
            height={1}
            alt=""
            style={{ display: 'none', border: 0 }}
          />
          シゴトinで検索
        </a>
      )
    }
    return null
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h2 className="results-title">検索結果</h2>
        <button
          onClick={handleOpenAll}
          className="open-all-button"
          disabled={!resultsAvailable && !recopResultsAvailable}
        >
          すべて開く
        </button>
      </div>
      {resultsAvailable || recopResultsAvailable ? (
        <>
          <ul className="results-list">
            {results.map((result, index) => {
              const affiliateNode = generateAffiliateLink(result)
              return (
                <li key={index} className="result-item">
                  {affiliateNode ? (
                    <div>
                      {affiliateNode}
                      <p className="affiliate-note">シゴトinのリンクはアフィリエイトリンクです。</p>
                    </div>
                  ) : (
                    <a href={result.url} target="_blank" rel="noopener noreferrer">
                      {result.siteName}で検索
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
          {recopResults && recopResults.some(cat => cat.results.length > 0) && (
            <div className="recop-categories">
              {recopResults.map((category, catIndex) => (
                category.results.length > 0 && (
                  <div key={catIndex} className="recop-category">
                    <h4 className="recop-category-title">{category.category}</h4>
                    <ul className="results-list">
                      {category.results.map((result, index) => (
                        <li key={index} className="result-item">
                          <a href={result.url} target="_blank" rel="noopener noreferrer">
                            {result.siteName}で検索
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="results-placeholder">{placeholder}</p>
      )}
    </div>
  )
}
