import type { CSSProperties } from "react"
import Editor from "@components/editor/Editor"
import { LocalWorkspaceShell } from "@components/editor/LocalWorkspaceShell"
import { ProjectInitialize } from "@components/editor/ProjectInitialize"
import { useWorkspaceRecord } from "@lib/local-workspace/hooks/use-workspace-record"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"

const message: CSSProperties = { padding: "2rem", color: "#fff" }

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
