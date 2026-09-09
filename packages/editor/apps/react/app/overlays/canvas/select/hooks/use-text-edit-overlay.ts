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
  overlayHtmlElement,
  paintTextEditRuns,
  planFlushCurrentRun,
  planOverlayInput,
  planOverlayKeydown,
  readSessionRuns,
  readTextEditFieldStyle,
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

    return planFlushCurrentRun(workspace, session.nodeId, runs, field)
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

      const plan = planOverlayInput(workspace, session.nodeId, runs, event.currentTarget)

      if (plan) commitAndKeepFocus(plan)
    },
    [commitAndKeepFocus, runs, session, workspace],
  )

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      if (!session) return

      const result = planOverlayKeydown(workspace, session.nodeId, runs, event.currentTarget, {
        key: event.key,
        metaKey: event.metaKey,
        ctrlKey: event.ctrlKey,
        altKey: event.altKey,
        shiftKey: event.shiftKey,
      })

      if (result.kind === "none") return

      event.preventDefault()

      if (result.kind === "close") {
        closeSession()

        return
      }

      commitAndKeepFocus(result.plan)
    },
    [closeSession, commitAndKeepFocus, runs, session, workspace],
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
    nodeId,
    overlayStyle,
    overlayTag,
    showOverlay,
    onInput,
    onKeyDown,
    onBlur,
  }
}
