import { useState, useEffect } from 'react'

interface City {
  c: string  // code
  n: string  // name
}

interface CitySelectionModalProps {
  cities: City[]
  selectedCities: Set<string>
  onClose: () => void
  onConfirm: (selectedCities: Set<string>) => void
  prefectureName: string
}

export function CitySelectionModal({
  cities,
  selectedCities,
  onClose,
  onConfirm,
  prefectureName,
}: CitySelectionModalProps) {
  const [tempSelectedCities, setTempSelectedCities] = useState<Set<string>>(
    new Set(selectedCities)
  )

  useEffect(() => {
    // モーダルが開いたときに選択済みの状態を反映
    setTempSelectedCities(new Set(selectedCities))
  }, [selectedCities])

  const handleCityToggle = (cityCode: string) => {
    setTempSelectedCities(prev => {
      const newSelected = new Set(prev)
      if (newSelected.has(cityCode)) {
        newSelected.delete(cityCode)
      } else {
        newSelected.add(cityCode)
      }
      return newSelected
    })
  }



  const handleConfirm = () => {
    onConfirm(tempSelectedCities)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2>{prefectureName}の市区町村を選択</h2>
            <p className="modal-notice">シゴトinでは最初に選択した1つの市区町村のみ検索できます。</p>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="cities-grid">
            {cities.map((city) => (
              <label key={city.c} className="city-checkbox-item">
                <input
                  type="checkbox"
                  checked={tempSelectedCities.has(city.c)}
                  onChange={() => handleCityToggle(city.c)}
                />
                <span>{city.n}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose} className="cancel-button">
            キャンセル
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="confirm-button"
            disabled={tempSelectedCities.size === 0}
          >
            決定 ({tempSelectedCities.size}件)
          </button>
        </div>
      </div>
    </div>
  )
}
