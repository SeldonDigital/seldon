import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const { debugModeEnabled } = useDebugMode()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {debugModeEnabled && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
