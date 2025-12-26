import { useState, useEffect } from 'react'

interface City {
  code: string
  name: string
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
    const newSelected = new Set(tempSelectedCities)
    if (newSelected.has(cityCode)) {
      newSelected.delete(cityCode)
    } else {
      newSelected.add(cityCode)
    }
    setTempSelectedCities(newSelected)
  }



  const handleConfirm = () => {
    onConfirm(tempSelectedCities)
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
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
              <label key={city.code} className="city-checkbox-item">
                <input
                  type="checkbox"
                  checked={tempSelectedCities.has(city.code)}
                  onChange={() => handleCityToggle(city.code)}
                />
                <span>{city.name}</span>
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
