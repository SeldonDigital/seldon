import { useTextEditSession } from "@app/canvas/hooks/use-text-edit-session"
import { useNodeRect } from "@app/overlays/hooks/use-node-rects"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  attachTextEditCanvasNode,
  buildTextEditOverlayStyle,
  clearTextEditFieldStyleCache,
  getCachedTextEditFieldStyle,
  getTextEditCanvasElement,
  hideCanvasNodeForTextEdit,
  matchListPrefix,
  overlayHtmlElement,
  paintTextEditRuns,
  planApplyMark,
  planConvertToList,
  planEnterSplit,
  planTypeInput,
  planTypeRun,
  readSessionRuns,
  readTextEditCaret,
  readTextEditFieldLines,
  readTextEditFieldStyle,
  readTextEditRange,
  resolveTextEditArrow,
  setTextEditCaret,
  textEditPaintKey,
} from "@seldon/editor/lib/canvas/text-edit"
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"

import type { TextEditPlan } from "@seldon/editor/lib/canvas/text-edit"
import type { CSSProperties, FormEvent, KeyboardEvent } from "react"

export function useTextEditOverlay() {
  const { session, commitPlan, end } = useTextEditSession()
  const { workspace } = useWorkspace()
  const nodeId = session?.nodeId ?? ""
  const measuredRect = useNodeRect(nodeId)
  const lastRectRef = useRef<{ nodeId: string; rect: typeof measuredRect }>({
    nodeId,
    rect: measuredRect,
  })
  const ignoreBlurRef = useRef(false)
  const closingRef = useRef(false)
  const fieldRef = useRef<HTMLElement>(null)
  const [styleVersion, setStyleVersion] = useState(0)

  if (lastRectRef.current.nodeId !== nodeId) {
    lastRectRef.current = { nodeId, rect: measuredRect }
  } else if (measuredRect) {
    lastRectRef.current.rect = measuredRect
  }

  const rect = measuredRect ?? lastRectRef.current.rect
  const caretOffset = session?.caretOffset
  const paintKey = nodeId ? textEditPaintKey(workspace, nodeId) : ""
  const runs = nodeId ? readSessionRuns(workspace, nodeId) : []

  const fieldStyle = useMemo(() => {
    if (!session) return undefined

    const cacheKey = `${session.nodeId}:${session.rootId ?? ""}:${paintKey}`
    const element = getTextEditCanvasElement(session.nodeId, session.rootId)

    if (!element) return getCachedTextEditFieldStyle(cacheKey)

    return readTextEditFieldStyle(element, cacheKey)
  }, [paintKey, rect, session, styleVersion])

  const overlayStyle = useMemo((): CSSProperties | undefined => {
    if (!rect || !fieldStyle) return undefined

    return buildTextEditOverlayStyle(rect, fieldStyle) as CSSProperties
  }, [fieldStyle, rect])

  const overlayTag = nodeId ? overlayHtmlElement(workspace, nodeId) : "div"
  const showOverlay = Boolean(session && rect && overlayStyle)

  useEffect(() => {
    if (!session) {
      clearTextEditFieldStyleCache()

      return
    }

    return attachTextEditCanvasNode(session.nodeId, session.rootId, (element) => {
      readTextEditFieldStyle(element, `${session.nodeId}:${session.rootId ?? ""}:${paintKey}`)
      setStyleVersion((version) => version + 1)

      return hideCanvasNodeForTextEdit(element)
    })
  }, [paintKey, session?.nodeId, session?.rootId])

  const commitAndKeepFocus = useCallback(
    (plan: TextEditPlan) => {
      ignoreBlurRef.current = true
      clearTextEditFieldStyleCache()
      commitPlan(plan)
      requestAnimationFrame(() => {
        setStyleVersion((version) => version + 1)
        ignoreBlurRef.current = false
        fieldRef.current?.focus({ preventScroll: true })
      })
    },
    [commitPlan],
  )

  const flushCurrentRun = useCallback((): TextEditPlan | null => {
    if (!session) return null

    const field = fieldRef.current

    if (!field) return null

    const caret = readTextEditCaret(field)
    const run = caret.runId ? runs.find((item) => item.id === caret.runId) : runs[0]

    if (!run || !caret.runId) {
      const first = runs[0]

      if (!first) return null

      const text = field.textContent ?? ""

      if (text === first.content && runs.length === 1) return null

      return planTypeInput(workspace, session.nodeId, text)
    }

    const element = field.querySelector(`[data-seldon-text-run="${caret.runId}"]`)
    const text = element?.textContent ?? ""

    if (text === run.content) return null

    return planTypeRun(workspace, session.nodeId, caret.runId, text, caret.blockOffset)
  }, [runs, session, workspace])

  const closeSession = useCallback(() => {
    closingRef.current = true
    const typed = flushCurrentRun()

    if (typed) commitPlan(typed)

    end()
  }, [commitPlan, end, flushCurrentRun])

  useEffect(() => {
    if (!session) {
      closingRef.current = false

      return
    }

    const onPointerDown = (event: PointerEvent) => {
      const field = fieldRef.current
      const eventTarget = event.target

      if (field && eventTarget instanceof Node && field.contains(eventTarget)) return

      closeSession()
    }

    document.addEventListener("pointerdown", onPointerDown, true)

    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  }, [closeSession, session])

  useLayoutEffect(() => {
    const field = fieldRef.current

    if (!field || !showOverlay) return

    paintTextEditRuns(field, runs)
    setTextEditCaret(field, runs, caretOffset ?? field.textContent?.length ?? 0)
  }, [caretOffset, paintKey, runs, showOverlay])

  const onInput = useCallback(
    (event: FormEvent<HTMLElement>) => {
      if (!session) return

      const field = event.currentTarget
      const caret = readTextEditCaret(field)
      const runId = caret.runId ?? runs[0]?.id

      if (!runId) return

      const element = field.querySelector(`[data-seldon-text-run="${runId}"]`)
      const text = element?.textContent ?? field.textContent ?? ""
      const list = matchListPrefix(text)
      const previous = runs.find((run) => run.id === runId)?.content ?? ""
      const wasList = matchListPrefix(previous)

      if (list && !wasList) {
        const flatten = planTypeInput(workspace, session.nodeId, list.rest)
        const converted = planConvertToList(workspace, session.nodeId, list.ordered)

        commitAndKeepFocus({
          actions: [...flatten.actions, ...converted.actions],
          nextNodeId: converted.nextNodeId,
          nextOffset: converted.nextOffset,
        })

        return
      }

      commitAndKeepFocus(planTypeRun(workspace, session.nodeId, runId, text, caret.blockOffset))
    },
    [commitAndKeepFocus, runs, session, workspace],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!session) return

      const field = event.currentTarget
      const range = readTextEditRange(field)
      const value = field.textContent ?? ""

      if (event.key === "Escape") {
        event.preventDefault()
        closeSession()

        return
      }

      if (
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        (event.key === "ArrowLeft" ||
          event.key === "ArrowRight" ||
          event.key === "ArrowUp" ||
          event.key === "ArrowDown")
      ) {
        const target = resolveTextEditArrow(
          workspace,
          session.nodeId,
          event.key,
          { start: range.start, end: range.end, value },
          readTextEditFieldLines(field),
        )

        if (target) {
          event.preventDefault()
          const typed = flushCurrentRun()

          commitAndKeepFocus({
            actions: typed?.actions ?? [],
            nextNodeId: target.nodeId,
            nextOffset: target.offset,
          })
        }

        return
      }

      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        closeSession()

        return
      }

      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault()
        const typed = flushCurrentRun()
        const split = planEnterSplit(workspace, session.nodeId, range.start)

        commitAndKeepFocus({
          ...split,
          actions: [...(typed?.actions ?? []), ...split.actions],
        })

        return
      }

      const useMeta = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()

      if (useMeta && (key === "b" || key === "i")) {
        event.preventDefault()
        const typed = flushCurrentRun()
        const marked = planApplyMark(
          workspace,
          session.nodeId,
          range,
          key === "b" ? "bold" : "italic",
        )

        commitAndKeepFocus({
          ...marked,
          actions: [...(typed?.actions ?? []), ...marked.actions],
        })
      }
    },
    [closeSession, commitAndKeepFocus, flushCurrentRun, session, workspace],
  )

  const onBlur = useCallback(() => {
    if (ignoreBlurRef.current || closingRef.current) return

    queueMicrotask(() => {
      if (closingRef.current) return

      fieldRef.current?.focus({ preventScroll: true })
    })
  }, [])

  return {
    fieldRef,
    overlayStyle,
    overlayTag,
    showOverlay,
    onInput,
    onKeyDown,
    onBlur,
  }
}
