import { useEffect, useState } from 'react'
import { PREFECTURES, EMPLOYMENT_TYPES } from '../constants'
import type { EmploymentTypeId } from '../constants'
import { CitySelectionModal } from './CitySelectionModal'

interface SearchFormProps {
  onCriteriaChange: (keyword: string, cityCodes: string[], employmentTypes: EmploymentTypeId[]) => void
}

export function SearchForm({ onCriteriaChange }: SearchFormProps) {
  const [keyword, setKeyword] = useState('')
  const [selectedPrefecture, setSelectedPrefecture] = useState('13')
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set())
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<Set<EmploymentTypeId>>(new Set())
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
    setSelectedCities(new Set(cities))
  }

  const handleEmploymentTypeChange = (id: EmploymentTypeId) => {
    const newSet = new Set(selectedEmploymentTypes)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedEmploymentTypes(newSet)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    onCriteriaChange(keyword, Array.from(selectedCities), Array.from(selectedEmploymentTypes))
  }, [keyword, selectedCities, selectedEmploymentTypes, onCriteriaChange])

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
          <label htmlFor="prefecture">都道府県</label>
          <select
            id="prefecture"
            value={selectedPrefecture}
            onChange={handlePrefectureChange}
            required
          >
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
            {selectedCityNames.length > 0 && (
              <div className="selected-cities-preview">
                {selectedCityNames.join('、')}
              </div>
            )}
            <button
              type="button"
              onClick={handleOpenModal}
              className="select-cities-button"
              style={{ marginTop: '10px' }}
            >
              {selectedCities.size === 0
                ? '市区町村を選択'
                : `市区町村を選択し直す`}
            </button>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="keyword">キーワード（任意）</label>
          <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例: カフェ、コンビニ"
          />
        </div>

        <div className="form-group">
          <label>雇用形態（未選択で全て）</label>
          <div className="checkbox-group">
            {EMPLOYMENT_TYPES.map((type) => (
              <label key={type.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedEmploymentTypes.has(type.id)}
                  onChange={() => handleEmploymentTypeChange(type.id)}
                />
                {type.label}
              </label>
            ))}
          </div>
        </div>
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
