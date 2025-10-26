import { useParams } from "wouter"

export function useProjectId() {
  const params = useParams()

  if (params.projectId === undefined) {
    throw new Error("You can only use `useProjectId` inside a project route")
  }

  if (import.meta.env.MODE === "test") {
    return { projectId: "test" }
  }

  return { projectId: params.projectId as string }
}
