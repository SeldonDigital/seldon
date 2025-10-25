import { useParams } from "wouter"

export function useProjectId() {
  const params = useParams()

  if (import.meta.env.MODE === "test") {
    return { projectId: "test" }
  }

  // Type guard
  if (Array.isArray(params.id)) {
    throw new Error("useProjectId expects a single id")
  }

  return { projectId: params.id as string }
}
