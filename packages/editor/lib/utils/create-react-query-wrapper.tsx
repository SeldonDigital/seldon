import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react"

export const createReactQueryWrapper = () => {
  const queryClient = new QueryClient()

  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }
}
