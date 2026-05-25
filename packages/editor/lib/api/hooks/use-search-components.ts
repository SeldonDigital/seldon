import { useCallback, useState } from "react"
import type { ComponentId } from "@seldon/core/components/constants"
import type { VariantId } from "@seldon/core/index"

export type SearchComponentsResult = {
  component: ComponentId
  variant?: VariantId
}[]

type UseSearchComponentsArgs = {
  query: string
  task: "search_all" | "search_catalog"
  targetNode?: string
  targetIndex?: number
}

/**
 * Stub for the hosted editor AI catalog search. Local editor uses text filter only.
 */
export function useSearchComponents(_args: UseSearchComponentsArgs) {
  const [isFetching, setIsFetching] = useState(false)
  const [data, setData] = useState<SearchComponentsResult | undefined>(undefined)

  const refetch = useCallback(async () => {
    setIsFetching(true)
    try {
      setData([])
      return { data: [] as SearchComponentsResult }
    } finally {
      setIsFetching(false)
    }
  }, [])

  return {
    data,
    refetch,
    isFetching,
  }
}
