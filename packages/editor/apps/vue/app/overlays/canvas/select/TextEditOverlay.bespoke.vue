<script setup lang="ts">
import { useSharedStore } from "@app/canvas/use-shared-store"
import { useTextEditSession } from "@app/canvas/use-text-edit-session"
import { useWorkspace } from "@app/workspace/use-workspace"
import {
  getNodeContent,
  matchListPrefix,
  planApplyMark,
  planConvertToList,
  planEnterSplit,
  planTypeInput,
} from "@seldon/editor/lib/canvas/text-edit"
import { nodeRectsStore } from "@seldon/editor/lib/canvas/tracking/node-rects-store"
import { computed, nextTick, ref, watch } from "vue"

import { applyActions } from "@seldon/core/workspace/reducers/apply-actions"

import type { TextMark } from "@seldon/editor/lib/canvas/text-edit"
import type { CSSProperties } from "vue"

const TEXT_EDIT_OVERLAY_Z = 4

const { session, commitPlan, end } = useTextEditSession()
const { workspace } = useWorkspace()
const nodeId = computed(() => session.value?.nodeId ?? "")
const rectVersion = useSharedStore(nodeRectsStore, (state) => state.version)
const rect = computed(() => {
  const id = session.value?.nodeId

  if (!id) return null

  void rectVersion.value

  return nodeRectsStore.getState().rects.get(id) ?? null
})
const draft = ref("")
const fieldRef = ref<HTMLTextAreaElement | null>(null)

const stored = computed(() => (nodeId.value ? getNodeContent(workspace.value, nodeId.value) : ""))

const overlayStyle = computed((): CSSProperties | undefined => {
  const box = rect.value

  if (!box) return undefined

  return {
    position: "absolute",
    top: `${box.top}px`,
    left: `${box.left}px`,
    width: `${box.width}px`,
    height: `${Math.max(box.height, 24)}px`,
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
})

const showOverlay = computed(() => Boolean(session.value && rect.value && overlayStyle.value))

watch(
  [stored, nodeId],
  () => {
    draft.value = stored.value
  },
  { immediate: true },
)

watch(showOverlay, async (visible) => {
  if (!visible) return

  await nextTick()
  const field = fieldRef.value

  if (!field) return

  field.focus()
  field.selectionStart = draft.value.length
  field.selectionEnd = draft.value.length
})

function onInput(event: Event): void {
  const current = session.value

  if (!current) return

  const target = event.target as HTMLTextAreaElement
  const next = target.value
  const previous = draft.value
  draft.value = next

  const list = matchListPrefix(next)
  const wasList = matchListPrefix(previous)

  if (list && !wasList) {
    const flatten = planTypeInput(workspace.value, current.nodeId, list.rest)
    const converted = planConvertToList(workspace.value, current.nodeId, list.ordered)

    commitPlan({
      actions: [...flatten.actions, ...converted.actions],
      nextNodeId: converted.nextNodeId,
      nextOffset: converted.nextOffset,
    })
  }
}

function onKeydown(event: KeyboardEvent): void {
  const current = session.value

  if (!current) return

  const field = event.target as HTMLTextAreaElement
  const start = field.selectionStart
  const endIndex = field.selectionEnd

  if (event.key === "Escape") {
    event.preventDefault()
    end()

    return
  }

  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault()
    const typed =
      draft.value === stored.value
        ? null
        : planTypeInput(workspace.value, current.nodeId, draft.value)
    let nextWorkspace = workspace.value

    if (typed) {
      try {
        nextWorkspace = applyActions(workspace.value, typed.actions)
      } catch {
        nextWorkspace = workspace.value
      }
    }

    const split = planEnterSplit(nextWorkspace, current.nodeId, start)

    commitPlan({
      actions: [...(typed?.actions ?? []), ...split.actions],
      nextNodeId: split.nextNodeId,
      nextOffset: split.nextOffset,
    })

    return
  }

  const useMeta = event.metaKey || event.ctrlKey
  const key = event.key.toLowerCase()

  if (useMeta && (key === "b" || key === "i")) {
    event.preventDefault()
    const mark: TextMark = key === "b" ? "bold" : "italic"
    const typed =
      draft.value === stored.value
        ? null
        : planTypeInput(workspace.value, current.nodeId, draft.value)
    let nextWorkspace = workspace.value

    if (typed) {
      try {
        nextWorkspace = applyActions(workspace.value, typed.actions)
      } catch {
        nextWorkspace = workspace.value
      }
    }

    const marked = planApplyMark(nextWorkspace, current.nodeId, { start, end: endIndex }, mark)

    commitPlan({
      actions: [...(typed?.actions ?? []), ...marked.actions],
      nextNodeId: marked.nextNodeId,
      nextOffset: marked.nextOffset,
    })
  }
}

function onBlur(): void {
  const current = session.value

  if (current && draft.value !== stored.value) {
    commitPlan(planTypeInput(workspace.value, current.nodeId, draft.value))
  }

  end()
}
</script>

<template>
  <textarea
    v-if="showOverlay"
    ref="fieldRef"
    :value="draft"
    :style="overlayStyle"
    @input="onInput"
    @keydown="onKeydown"
    @blur="onBlur"
  />
</template>
