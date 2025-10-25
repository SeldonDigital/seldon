"use client"

import { useEffect } from "react"
import { useSaveCurrentProject } from "./use-save-current-project"
import { useWorkspaceSyncStatus } from "./use-workspace-sync-status"

/**
 * This hook makes sure that our project is saved after 3 seconds if it's not up to date.
 */
export function useSaveModifiedProject() {
  const { saveCurrentProject } = useSaveCurrentProject()
  const { isDirty } = useWorkspaceSyncStatus()

  // Save the project after 3 seconds if it's dirty
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        saveCurrentProject()
      }, 3000)

      return () => {
        clearTimeout(timer)
      }
    }
  }, [isDirty, saveCurrentProject])

  // Show a warning when the user tries to leave the page before syncing is done
  useEffect(() => {
    // If we're up to date, all good
    if (!isDirty) return

    async function handleChange(event: BeforeUnloadEvent) {
      event.preventDefault()
      await saveCurrentProject()
    }
    window.addEventListener("beforeunload", handleChange)
    return () => {
      window.removeEventListener("beforeunload", handleChange)
    }
  }, [isDirty, saveCurrentProject])
}
