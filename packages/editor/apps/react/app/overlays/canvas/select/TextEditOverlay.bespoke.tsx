"use client"

import { useTextEditSession } from "@app/canvas/hooks/use-text-edit-session"
import { useNodeRect } from "@app/overlays/hooks/use-node-rects"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  getNodeContent,
  matchListPrefix,
  planApplyMark,
  planConvertToList,
  planEnterSplit,
  planTypeInput,
} from "@seldon/editor/lib/canvas/text-edit"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"

import type { CSSProperties, ChangeEvent, KeyboardEvent } from "react"

const TEXT_EDIT_OVERLAY_Z = 4

export function TextEditOverlay() {
  const { session, commitPlan, end } = useTextEditSession()
  const { workspace } = useWorkspace()
  const nodeId = session?.nodeId ?? ""
  const rect = useNodeRect(nodeId)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const stored = nodeId ? getNodeContent(workspace, nodeId) : ""
  const [draft, setDraft] = useState(stored)

  useEffect(() => {
    setDraft(stored)
  }, [stored, nodeId])

  useEffect(() => {
    const field = textareaRef.current

    if (!field) return

    field.focus()
    field.selectionStart = draft.length
    field.selectionEnd = draft.length
  }, [nodeId, rect])

  const overlayStyle = useMemo((): CSSProperties | undefined => {
    if (!rect) return undefined

    return {
      position: "absolute",
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${Math.max(rect.height, 24)}px`,
      margin: 0,
      padding: 0,
      border: "none",
      resize: "none",
      outline: "none",
      background: "color-mix(in srgb, var(--sdn-swatch-white) 96%, transparent)",
      color: "var(--sdn-swatch-black)",
      font: "inherit",
      lineHeight: "inherit",
      zIndex: TEXT_EDIT_OVERLAY_Z,
    }
  }, [rect])

  const flushDraft = useCallback(
    (value: string) => {
      if (!session || value === stored) return

      commitPlan(planTypeInput(workspace, session.nodeId, value))
    },
    [commitPlan, session, stored, workspace],
  )

  const onChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (!session) return

      const next = event.currentTarget.value
      const previous = draft

      setDraft(next)

      const list = matchListPrefix(next)
      const wasList = matchListPrefix(previous)

      if (list && !wasList) {
        const flatten = planTypeInput(workspace, session.nodeId, list.rest)
        const converted = planConvertToList(workspace, session.nodeId, list.ordered)

        commitPlan({
          actions: [...flatten.actions, ...converted.actions],
          nextNodeId: converted.nextNodeId,
          nextOffset: converted.nextOffset,
        })
      }
    },
    [commitPlan, draft, session, workspace],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (!session) return

      const field = event.currentTarget
      const start = field.selectionStart
      const endIndex = field.selectionEnd

      if (event.key === "Escape") {
        event.preventDefault()
        end()

        return
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        const typed = draft === stored ? null : planTypeInput(workspace, session.nodeId, draft)
        let nextWorkspace = workspace

        if (typed) {
          try {
            nextWorkspace = applyActions(workspace, typed.actions)
          } catch {
            nextWorkspace = workspace
          }
        }

        const split = planEnterSplit(nextWorkspace, session.nodeId, start)

        commitPlan({
          actions: [...(typed?.actions ?? []), ...split.actions],
          nextNodeId: split.nextNodeId,
          nextOffset: split.nextOffset,
        })

        return
      }

      const useMeta = event.metaKey || event.ctrlKey

      if (useMeta && (event.key.toLowerCase() === "b" || event.key.toLowerCase() === "i")) {
        event.preventDefault()
        const mark = event.key.toLowerCase() === "b" ? "bold" : "italic"
        const typed = draft === stored ? null : planTypeInput(workspace, session.nodeId, draft)
        let nextWorkspace = workspace

        if (typed) {
          try {
            nextWorkspace = applyActions(workspace, typed.actions)
          } catch {
            nextWorkspace = workspace
          }
        }

        const marked = planApplyMark(nextWorkspace, session.nodeId, { start, end: endIndex }, mark)

        commitPlan({
          actions: [...(typed?.actions ?? []), ...marked.actions],
          nextNodeId: marked.nextNodeId,
          nextOffset: marked.nextOffset,
        })
      }
    },
    [commitPlan, draft, end, session, stored, workspace],
  )

  const onBlur = useCallback(() => {
    flushDraft(draft)
    end()
  }, [draft, end, flushDraft])

  if (!session || !rect || !overlayStyle) return null

  return (
    <textarea
      ref={textareaRef}
      value={draft}
      style={overlayStyle}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
    />
  )
}
