import type { CSSProperties } from "react"
import { useWorkspaceRecord } from "@lib/persistence/hooks/use-workspace-record"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"
import Editor from "@app/editor/Editor"
import { LocalWorkspaceShell } from "@app/editor/LocalWorkspaceShell"
import { ProjectInitialize } from "@app/editor/ProjectInitialize"

const message: CSSProperties = {
  padding: "2rem",
  color: "var(--sdn-swatch-white)",
}

export default function EditorPage() {
  const workspaceId = useWorkspaceId()
  const { record, loading, error } = useWorkspaceRecord(workspaceId)

  if (!workspaceId) {
    return <p style={message}>Missing workspace id.</p>
  }

  if (loading) {
    return <p style={message}>Loading workspace…</p>
  }

  if (error || !record) {
    return <p style={message}>{error ?? "Workspace not found"}</p>
  }

  return (
    <LocalWorkspaceShell record={record}>
      <ProjectInitialize workspace={record.workspace} />
      <Editor />
    </LocalWorkspaceShell>
  )
}
