declare module '*.json?raw' {
    const content: string
    export default content
}

export interface SearchResult {
    siteName: string
    url: string
    html?: string
}

export interface RecopSearchResult {
    category: string
    results: SearchResult[]
}
