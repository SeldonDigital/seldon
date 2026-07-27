"use client"

import { Layout as LayoutComponent } from "@app/Layout"
import { useWorkspaceAutosave } from "@app/persistence/hooks/use-workspace-autosave"
import { useWorkspaceSyncStatus } from "@app/project/hooks/use-workspace-sync-status"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import type { StoredWorkspace } from "@seldon/editor/lib/storage/workspace-store"

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
