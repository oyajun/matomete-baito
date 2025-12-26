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

  const generateAffiliateLink = (result: SearchResult): string => {
    if (result.siteName === 'シゴトin') {
      const encodedUrl = encodeURIComponent(result.url)
      const affiliateUrl = `//ck.jp.ap.valuecommerce.com/servlet/referral?sid=3760146&pid=892416098&vc_url=${encodedUrl}`
      return `<a href="${affiliateUrl}" rel="nofollow" target="_blank"><img src="//ad.jp.ap.valuecommerce.com/servlet/gifbanner?sid=3760146&pid=892416098" height="1" width="0" border="0">シゴトin</a>`
    }
    return ''
  }

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
          {results.map((result, index) => {
            const affiliateHtml = generateAffiliateLink(result)
            return (
              <li key={index} className="result-item">
                {affiliateHtml ? (
                  <div>
                    <div dangerouslySetInnerHTML={{ __html: affiliateHtml }} />
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
      ) : (
        <p className="results-placeholder">{placeholder}</p>
      )}
    </div>
  )
}
