import React, { createContext, useContext, useRef, useState } from 'react'

const ScrollContext = createContext({ progress: 0 })

export function ScrollProgressProvider({ children }) {
  const progressRef = useRef(0)
  const [, forceUpdate] = useState(0)

  return (
    <ScrollContext.Provider value={progressRef}>
      {children}
    </ScrollContext.Provider>
  )
}

export function useScrollProgress() {
  return useContext(ScrollContext)
}
