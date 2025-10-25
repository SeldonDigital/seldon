"use client"

import { useSaveModifiedProject } from "@lib/project/hooks/use-save-modified-project"

export function ProjectSync() {
  useSaveModifiedProject()
  return null
}
