'use client'

import { useState } from 'react'
import StarterLoader from './StarterLoader'

export default function SplashWrapper({ children }) {
  const [showLoader, setShowLoader] = useState(true)

  if (showLoader) return <StarterLoader onFinish={() => setShowLoader(false)} />

  return children
}
