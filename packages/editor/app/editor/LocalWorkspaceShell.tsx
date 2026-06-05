"use client"

import { Layout as LayoutComponent } from "@components/Layout"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useWorkspaceAutosave } from "@lib/local-workspace/hooks/use-workspace-autosave"
import { useWorkspaceSyncStatus } from "@lib/project/hooks/use-workspace-sync-status"
import type { StoredWorkspace } from "@lib/storage/workspace-store"

export function LocalWorkspaceShell({
  record,
  children,
}: {
  record: StoredWorkspace
  children: React.ReactNode
}) {
  const { workspace } = useWorkspace()
  const isDirty = useWorkspaceSyncStatus(record.id)

  useWorkspaceAutosave(record, workspace, isDirty)

  return (
    <LayoutComponent testId="canvas">
      {children}
    </LayoutComponent>
  )
}
