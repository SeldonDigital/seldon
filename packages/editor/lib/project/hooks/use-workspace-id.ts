"use client"

import { useParams } from "react-router"

export function useWorkspaceId(): string | null {
  const { id } = useParams()
  return id ?? null
}
