import { BrowserRouter } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./contexts/AuthContext"
import { Router } from "./router"
import { Toaster } from "react-hot-toast"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Router />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
