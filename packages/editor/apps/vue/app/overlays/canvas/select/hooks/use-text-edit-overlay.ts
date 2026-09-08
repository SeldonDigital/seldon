import { useSharedStore } from "@app/canvas/use-shared-store"
import { useTextEditSession } from "@app/canvas/use-text-edit-session"
import { useWorkspace } from "@app/workspace/use-workspace"
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
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { computed, nextTick, onScopeDispose, ref, watch } from "vue"

import type { NodeRect } from "@seldon/editor/lib/canvas/overlay/geometry"
import type { TextEditPlan, TextMark } from "@seldon/editor/lib/canvas/text-edit"
import type { CSSProperties } from "vue"

export function useTextEditOverlay() {
  const { session, commitPlan, end } = useTextEditSession()
  const { workspace } = useWorkspace()
  const nodeId = computed(() => session.value?.nodeId ?? "")
  const rectVersion = useSharedStore(nodeRectsStore, (state) => state.version)
  const lastRect = ref<NodeRect | null>(null)
  const styleVersion = ref(0)
  const fieldRef = ref<HTMLElement | null>(null)
  const ignoreBlur = ref(false)
  const closing = ref(false)

  const measuredRect = computed(() => {
    const id = session.value?.nodeId

    if (!id) return null

    void rectVersion.value

    return nodeRectsStore.getState().rects.get(id) ?? null
  })
  const rect = computed(() => measuredRect.value ?? lastRect.value)
  const paintKey = computed(() =>
    nodeId.value ? textEditPaintKey(workspace.value, nodeId.value) : "",
  )
  const runs = computed(() => (nodeId.value ? readSessionRuns(workspace.value, nodeId.value) : []))

  const fieldStyle = computed(() => {
    const current = session.value

    if (!current) return undefined

    void rectVersion.value
    void styleVersion.value
    const cacheKey = `${current.nodeId}:${current.rootId ?? ""}:${paintKey.value}`
    const element = getTextEditCanvasElement(current.nodeId, current.rootId)

    if (!element) return getCachedTextEditFieldStyle(cacheKey)

    return readTextEditFieldStyle(element, cacheKey)
  })

  const overlayStyle = computed((): CSSProperties | undefined => {
    const box = rect.value
    const typeStyle = fieldStyle.value

    if (!box || !typeStyle) return undefined

    return buildTextEditOverlayStyle(box, typeStyle) as CSSProperties
  })

  const overlayTag = computed(() =>
    nodeId.value ? overlayHtmlElement(workspace.value, nodeId.value) : "div",
  )
  const showOverlay = computed(() => Boolean(session.value && rect.value && overlayStyle.value))

  watch(nodeId, () => {
    lastRect.value = null
  })

  watch(
    measuredRect,
    (box) => {
      if (box) lastRect.value = box
    },
    { immediate: true },
  )

  function commitAndKeepFocus(plan: TextEditPlan): void {
    ignoreBlur.value = true
    clearTextEditFieldStyleCache()
    commitPlan(plan)
    requestAnimationFrame(() => {
      styleVersion.value += 1
      ignoreBlur.value = false
      fieldRef.value?.focus({ preventScroll: true })
    })
  }

  function flushCurrentRun(): TextEditPlan | null {
    const current = session.value
    const field = fieldRef.value

    if (!current || !field) return null

    const caret = readTextEditCaret(field)
    const currentRuns = runs.value
    const run = caret.runId ? currentRuns.find((item) => item.id === caret.runId) : currentRuns[0]

    if (!run || !caret.runId) {
      const first = currentRuns[0]

      if (!first) return null

      const text = field.textContent ?? ""

      if (text === first.content && currentRuns.length === 1) return null

      return planTypeInput(workspace.value, current.nodeId, text)
    }

    const element = field.querySelector(`[data-seldon-text-run="${caret.runId}"]`)
    const text = element?.textContent ?? ""

    if (text === run.content) return null

    return planTypeRun(workspace.value, current.nodeId, caret.runId, text, caret.blockOffset)
  }

  function closeSession(): void {
    closing.value = true
    const typed = flushCurrentRun()

    if (typed) commitPlan(typed)

    end()
  }

  function onDocumentPointerDown(event: PointerEvent): void {
    const field = fieldRef.value
    const eventTarget = event.target

    if (field && eventTarget instanceof Node && field.contains(eventTarget)) return

    closeSession()
  }

  watch(
    [session, paintKey],
    ([current], _previous, onCleanup) => {
      if (!current) {
        closing.value = false
        clearTextEditFieldStyleCache()

        return
      }

      const detach = attachTextEditCanvasNode(current.nodeId, current.rootId, (element) => {
        readTextEditFieldStyle(
          element,
          `${current.nodeId}:${current.rootId ?? ""}:${paintKey.value}`,
        )
        styleVersion.value += 1

        return hideCanvasNodeForTextEdit(element)
      })

      document.addEventListener("pointerdown", onDocumentPointerDown, true)
      onCleanup(() => {
        detach()
        document.removeEventListener("pointerdown", onDocumentPointerDown, true)
      })
    },
    { immediate: true },
  )

  watch([showOverlay, paintKey, runs, () => session.value?.caretOffset], async ([visible]) => {
    if (!visible) return

    await nextTick()
    const field = fieldRef.value

    if (!field) return

    paintTextEditRuns(field, runs.value)
    setTextEditCaret(
      field,
      runs.value,
      session.value?.caretOffset ?? field.textContent?.length ?? 0,
    )
  })

  onScopeDispose(() => {
    document.removeEventListener("pointerdown", onDocumentPointerDown, true)
  })

  function onInput(event: Event): void {
    const current = session.value

    if (!current) return

    const field = event.currentTarget as HTMLElement
    const caret = readTextEditCaret(field)
    const currentRuns = runs.value
    const known = caret.runId ? currentRuns.find((run) => run.id === caret.runId) : currentRuns[0]
    const runId = known?.id ?? currentRuns[0]?.id
    const element = runId ? field.querySelector(`[data-seldon-text-run="${runId}"]`) : null
    const text = element?.textContent ?? field.textContent ?? ""

    if (!known || !runId) {
      commitAndKeepFocus(planTypeInput(workspace.value, current.nodeId, text))

      return
    }

    const list = matchListPrefix(text)
    const previous = known.content
    const wasList = matchListPrefix(previous)

    if (list && !wasList) {
      const flatten = planTypeInput(workspace.value, current.nodeId, list.rest)
      const converted = planConvertToList(workspace.value, current.nodeId, list.ordered)

      commitAndKeepFocus({
        actions: [...flatten.actions, ...converted.actions],
        nextNodeId: converted.nextNodeId,
        nextOffset: converted.nextOffset,
      })

      return
    }

    commitAndKeepFocus(planTypeRun(workspace.value, current.nodeId, runId, text, caret.blockOffset))
  }

  function onKeydown(event: KeyboardEvent): void {
    const current = session.value

    if (!current) return

    const field = event.currentTarget as HTMLElement
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
        workspace.value,
        current.nodeId,
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
      const split = planEnterSplit(workspace.value, current.nodeId, range.start)

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
      const mark: TextMark = key === "b" ? "bold" : "italic"
      const typed = flushCurrentRun()
      const marked = planApplyMark(workspace.value, current.nodeId, range, mark)

      commitAndKeepFocus({
        ...marked,
        actions: [...(typed?.actions ?? []), ...marked.actions],
      })
    }
  }

  function onBlur(): void {
    if (ignoreBlur.value || closing.value) return

    queueMicrotask(() => {
      if (closing.value) return

      fieldRef.value?.focus({ preventScroll: true })
    })
  }

  return {
    fieldRef,
    nodeId,
    overlayStyle,
    overlayTag,
    showOverlay,
    onInput,
    onKeydown,
    onBlur,
  }
}
