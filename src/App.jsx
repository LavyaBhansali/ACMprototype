import React, { useState, useCallback } from 'react'
import Experience from './components/Experience'
import WebsitePage from './components/website/WebsitePage'
import ScrollIndicator from './components/overlays/ScrollIndicator'

export default function App() {
  const [activeBuilding, setActiveBuilding] = useState(null)

  const handleBuildingClick = useCallback((buildingId) => {
    setActiveBuilding(buildingId)
  }, [])

  const handleBack = useCallback(() => {
    setActiveBuilding(null)
  }, [])

  return (
    <>
      {/* 3D Experience — always mounted, hidden when 2D is active */}
      <div className="canvas-container" style={{ 
        visibility: activeBuilding ? 'hidden' : 'visible' 
      }}>
        <Experience onBuildingClick={handleBuildingClick} />
      </div>

      {/* Persistent UI overlays during 3D */}
      {!activeBuilding && (
        <>
          <div className="brand-mark">
            <div className="brand-mark__title">ACM</div>
            <div className="brand-mark__subtitle">DJ Sanghvi</div>
          </div>
          <ScrollIndicator />
        </>
      )}

      {/* 2D Website */}
      {activeBuilding && (
        <WebsitePage 
          buildingId={activeBuilding} 
          onBack={handleBack} 
        />
      )}
    </>
  )
}
