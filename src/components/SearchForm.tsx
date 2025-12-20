import { useState } from 'react'
import { PREFECTURES } from '../constants'
import { CitySelectionModal } from './CitySelectionModal'

interface SearchFormProps {
  onSearch: (keyword: string, cityCodes: string[]) => void
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const [keyword, setKeyword] = useState('')
  const [selectedPrefecture, setSelectedPrefecture] = useState('')
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPrefecture(e.target.value)
    setSelectedCities(new Set()) // 都道府県変更時に市区町村の選択をリセット
  }

  const handleOpenModal = () => {
    if (selectedPrefecture) {
      setIsModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleConfirmCities = (cities: Set<string>) => {
    setSelectedCities(cities)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim() && selectedCities.size > 0) {
      onSearch(keyword, Array.from(selectedCities))
    }
  }

  const currentPrefecture = PREFECTURES.find((p) => p.code === selectedPrefecture)

  // 選択された市区町村の名前を取得
  const getSelectedCityNames = () => {
    if (!currentPrefecture || selectedCities.size === 0) {
      return []
    }
    return currentPrefecture.cities
      .filter((city) => selectedCities.has(city.code))
      .map((city) => city.name)
  }

  const selectedCityNames = getSelectedCityNames()

  return (
    <>
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
            <button
              type="button"
              onClick={handleOpenModal}
              className="select-cities-button"
            >
              {selectedCities.size === 0
                ? '市区町村を選択'
                : `${selectedCities.size}件選択中`}
            </button>
            {selectedCityNames.length > 0 && (
              <div className="selected-cities-preview">
                {selectedCityNames.slice(0, 3).join('、')}
                {selectedCityNames.length > 3 && ` 他${selectedCityNames.length - 3}件`}
              </div>
            )}
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

      {isModalOpen && currentPrefecture && (
        <CitySelectionModal
          cities={currentPrefecture.cities}
          selectedCities={selectedCities}
          onClose={handleCloseModal}
          onConfirm={handleConfirmCities}
          prefectureName={currentPrefecture.name}
        />
      )}
    </>
  )
}
