"use client"

import { useQueryClient } from "@tanstack/react-query"

/**
 * This component is used to set the initial data for any query.
 * Its used to easily set client cache data from data fetched on the server with RSC.
 * @param queryKey - The query key to set the data for.
 * @param initialData - The initial data to set.
 */
export const SetQueryData = ({
  queryKey,
  initialData,
}: {
  queryKey: Parameters<ReturnType<typeof useQueryClient>["setQueryData"]>[0]
  initialData: unknown
}) => {
  const queryClient = useQueryClient()

  queryClient.setQueryData(queryKey, initialData)

  return null
}
