"use client"

import { useParams } from "next/navigation"

export function useWorkspaceId(): string | null {
  const params = useParams()
  const id = params?.id
  if (typeof id === "string") return id
  if (Array.isArray(id) && id[0]) return id[0]
  return null
}
