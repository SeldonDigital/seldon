import Editor from "@app/editor/Editor"
import { LocalWorkspaceShell } from "@app/editor/LocalWorkspaceShell"
import { ProjectInitialize } from "@app/editor/ProjectInitialize"
import { useWorkspaceRecord } from "@app/persistence/hooks/use-workspace-record"
import { useWorkspaceId } from "@app/project/hooks/use-workspace-id"
import { Frame } from "@seldon/components/frames/Frame"
import type { CSSProperties } from "react"

const message: CSSProperties = {
  padding: "2rem",
  color: "var(--sdn-swatch-white)",
}

export default function EditorPage() {
  const workspaceId = useWorkspaceId()
  const { record, loading, error } = useWorkspaceRecord(workspaceId)

  if (!workspaceId) {
    return (
      <Frame wrapperElement="p" style={message}>
        Missing workspace id.
      </Frame>
    )
  }

  if (loading) {
    return (
      <Frame wrapperElement="p" style={message}>
        Loading workspace…
      </Frame>
    )
  }

  if (error || !record) {
    const errorMessage = error ?? "Workspace not found"
    return (
      <Frame wrapperElement="p" style={message}>
        {errorMessage}
      </Frame>
    )
  }

  return (
    <LocalWorkspaceShell record={record}>
      <ProjectInitialize workspace={record.workspace} />
      <Editor />
    </LocalWorkspaceShell>
  )
}
