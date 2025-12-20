import { useState } from 'react'
import { PREFECTURES } from '../constants'

interface SearchFormProps {
  onSearch: (keyword: string, cityCodes: string[]) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [keyword, setKeyword] = useState('')
  const [selectedPrefecture, setSelectedPrefecture] = useState('')
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set())

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrefecture(e.target.value)
    setSelectedCities(new Set()) // 都道府県変更時に市区町村の選択をリセット
  }

  const handleCityToggle = (cityCode: string) => {
    const newSelectedCities = new Set(selectedCities)
    if (newSelectedCities.has(cityCode)) {
      newSelectedCities.delete(cityCode)
    } else {
      newSelectedCities.add(cityCode)
    }
    setSelectedCities(newSelectedCities)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim() && selectedCities.size > 0) {
      onSearch(keyword, Array.from(selectedCities))
    }
  }

  const currentPrefecture = PREFECTURES.find((p) => p.code === selectedPrefecture)

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="form-group">
        <label htmlFor="keyword">キーワード</label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="例: カフェ、コンビニ"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="prefecture">都道府県</label>
        <select
          id="prefecture"
          value={selectedPrefecture}
          onChange={handlePrefectureChange}
          required
        >
          <option value="">選択してください</option>
          {PREFECTURES.map((pref) => (
            <option key={pref.code} value={pref.code}>
              {pref.name}
            </option>
          ))}
        </select>
      </div>

      {currentPrefecture && (
        <div className="form-group">
          <label>市区町村</label>
          <div className="cities-list">
            {currentPrefecture.cities.map((city) => (
              <label key={city.code} className="city-checkbox">
                <input
                  type="checkbox"
                  checked={selectedCities.has(city.code)}
                  onChange={() => handleCityToggle(city.code)}
                />
                {city.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        type="submit"
        className="search-button"
        disabled={!keyword.trim() || selectedCities.size === 0}
      >
        検索
      </button>
    </form>
  )
}
