'use client'

import { useState } from 'react'
import StarterLoader from './StarterLoader'

export default function SplashWrapper({ children }) {
  const [showLoader, setShowLoader] = useState(true)

  return (
    <>
      {showLoader && <StarterLoader onFinish={() => setShowLoader(false)} />}
      {children}
    </>
  )
}
