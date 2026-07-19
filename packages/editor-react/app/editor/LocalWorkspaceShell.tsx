"use client"

import type { StoredWorkspace } from "@lib/storage/workspace-store"
import { useWorkspaceAutosave } from "@app/persistence/hooks/use-workspace-autosave"
import { useWorkspaceSyncStatus } from "@app/project/hooks/use-workspace-sync-status"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { Layout as LayoutComponent } from "@app/Layout"

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

  return <LayoutComponent testId="canvas">{children}</LayoutComponent>
}
