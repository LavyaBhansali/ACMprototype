import { useRef, useEffect, useState } from 'react'

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    const handleActivity = () => {
      setVisible(false)
    }
    
    window.addEventListener('wheel', handleActivity, { passive: true })
    window.addEventListener('scroll', handleActivity, { passive: true })
    window.addEventListener('touchmove', handleActivity, { passive: true })
    
    return () => {
      window.removeEventListener('wheel', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('touchmove', handleActivity)
    }
  }, [])

  return (
    <div 
      className={`scroll-indicator ${!visible ? 'scroll-indicator--hidden' : ''}`}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <div className="scroll-indicator__text">SCROLL TO EXPLORE</div>
      <div className="scroll-indicator__arrow" />
    </div>
  )
}
