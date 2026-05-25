import { Loading as LoadingSpinner } from "@components/ui/Loading"

export const LoadingPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner />
    </div>
  )
}
