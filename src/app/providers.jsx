'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "../contexts/AuthContext"
import { I18nProvider } from "../lib/i18n"
import { Toaster } from "react-hot-toast"
import { useEffect } from "react"
import { initializeDatabase } from "../lib/initDb"

const queryClient = new QueryClient()

export function Providers({ children }) {
  useEffect(() => {
    initializeDatabase()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <I18nProvider>
          {children}
          <Toaster position="top-right" />
        </I18nProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
