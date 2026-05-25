"use client"

import dynamic from "next/dynamic"
import { useWorkspaceId } from "@lib/project/hooks/use-workspace-id"
import { useWorkspaceRecord } from "@lib/local-workspace/use-workspace-record"
import { LocalWorkspaceShell } from "@components/LocalWorkspaceShell"
import { ProjectInitialize } from "@components/ProjectInitialize"

const Editor = dynamic(() => import("@components/Editor"), { ssr: false })

export default function EditorPage() {
  const workspaceId = useWorkspaceId()
  const { record, loading, error } = useWorkspaceRecord(workspaceId)

  if (!workspaceId) {
    return <p className="p-8 text-white">Missing workspace id.</p>
  }

  if (loading) {
    return <p className="p-8 text-white">Loading workspace…</p>
  }

  if (error || !record) {
    return <p className="p-8 text-white">{error ?? "Workspace not found"}</p>
  }

  return (
    <LocalWorkspaceShell record={record}>
      <ProjectInitialize workspace={record.workspace} />
      <Editor />
    </LocalWorkspaceShell>
  )
}
