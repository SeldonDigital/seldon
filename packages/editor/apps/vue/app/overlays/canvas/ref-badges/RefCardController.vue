<script setup lang="ts">
import { useRefBindingsStatus } from "@app/refs/use-ref-bindings"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { MIN_WINDOW_SIZE, useDraggableWindow } from "@app/windows/use-draggable-window"
import MessageRefController from "@seldon/components/elements/MessageRefController.vue"
import PanelRefs from "@seldon/components/modules/PanelRefs.vue"
import { describeBinding } from "@seldon/editor/lib/refs/describe-binding"
import { computed, watch } from "vue"

import { setRefCardSize } from "./hooks/use-ref-card"

import type { Rect, ResizeSide } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { BindingViewDescription } from "@seldon/editor/lib/refs/describe-binding"
import type { RefBinding } from "@seldon/editor/lib/refs/join-refs-and-bindings"
import type { CSSProperties } from "vue"

/**
 * The edges a card offers to drag: the two it grew toward, and the corner between them.
 * Offering the anchored edges would let a drag pull the card over its badge.
 */
const RESIZE_SIDES: Record<
  RefCardPosition["grows"],
  Record<RefCardPosition["opens"], ResizeSide[]>
> = {
  left: {
    below: ["left", "bottom", "bottom-left"],
    above: ["left", "top", "top-left"],
  },
  right: {
    below: ["right", "bottom", "bottom-right"],
    above: ["right", "top", "top-right"],
  },
}

/**
 * Binds one ref binding to the card half of `PanelRefs`.
 *
 * It floats on `WindowSurface`, the same shell the dialogs and palettes use, which
 * teleports it clear of the canvas and its overflow, re-applies the editor theme outside
 * the chrome root, and draws the resize handles.
 *
 * Mirrors the React `RefCardController`.
 */
const props = defineProps<{
  binding: RefBinding
  position: RefCardPosition
  setCardEl: (el: HTMLElement | null) => void
  onClose: () => void
}>()

const status = useRefBindingsStatus()
const description = computed(() => describeBinding(props.binding, status.value))

const { x, y, width, height, onResizeStart, onResize, getRect, moveControls, dragConstraints } =
  useDraggableWindow({
    initialPosition: { x: props.position.x, y: props.position.y },
    initialSize: { width: props.position.width, height: props.position.height },
    handleClose: props.onClose,
    minWidth: MIN_WINDOW_SIZE.width,
    minHeight: MIN_WINDOW_SIZE.height,
  })

const resizeSides = computed(() => RESIZE_SIDES[props.position.grows][props.position.opens])

// The badge moves as the canvas scrolls, and the card travels with it. Only the corner
// moves, so the size the reader dragged this card to survives the trip.
watch(
  () => [props.position.x, props.position.y],
  ([nextX, nextY]) => {
    x.set(nextX)
    y.set(nextY)
  },
)

// The drag drives this card, and the size it lands on is what the next card opens at.
function handleResize(rect: Rect): void {
  onResize(rect)
  setRefCardSize({ width: rect.width, height: rect.height })
}

/**
 * `nodeLabel: { textLabel }`, the ref and the prop the view takes it as.
 *
 * Named by the ref rather than the file, so the line answers to the badge that opened
 * the card. The file it is exposed from is the line under it.
 */
function toViewLine(view: BindingViewDescription): string {
  return `${props.binding.ref}: { ${view.slot} }`
}

// The view section has one Text per field rather than one per component, so several
// components that expose the same ref stack as lines inside each Text and stay lined
// up across the three.
//
// With no views the first Text carries the note instead, and the other two stay off. A
// path and a condition have nothing to report about a view that is not there, and
// leaving all three off would collapse the section to a bare heading.
const views = computed(() => description.value.views)
const viewLines = computed(() =>
  views.value.length === 0 ? description.value.viewNote : views.value.map(toViewLine).join("\n"),
)
const pathLines = computed(() => views.value.map((view) => view.file).join("\n"))
const conditionLines = computed(() => views.value.map((view) => view.condition).join("\n"))
const viewSlot = computed(() => (viewLines.value === null ? null : {}))
const viewFieldSlot = computed(() => (views.value.length === 0 ? null : {}))

/**
 * A row per code snippet that drives the ref, under a note when there is one to make.
 *
 * The note leads rather than replaces, because a note and controllers can both apply.
 * Files that disagree on their target still report consumers, and the reader needs the
 * warning before reading the rows it casts doubt on.
 */
const rows = computed(() => {
  const { note, controllers } = description.value

  const controllerRows = controllers.map((controller, index) => ({
    key: `${controller.location}#${index}`,
    path: {},
    seldonRefs: {
      refCardControllerName: { children: controller.name },
      refCardControllerPath: {
        children: controller.conditional
          ? `${controller.location} (conditional)`
          : controller.location,
      },
      refCardControllerPass: { children: controller.pass },
      refCardControllerFrom: {
        children: controller.from.join("\n"),
        style: styles.multiline,
      },
    },
    pass: controller.pass === null ? null : {},
    from: controller.from.length === 0 ? null : {},
    separator: index === controllers.length - 1 ? null : {},
  }))

  if (note === null) return controllerRows

  const noteRow = {
    key: "note",
    seldonRefs: { refCardControllerName: { children: note } },
    path: null,
    pass: null,
    from: null,
    separator: controllers.length > 0 ? {} : null,
  }

  return [noteRow, ...controllerRows]
})

const cardRefs = computed(() => ({
  refCardView: { children: viewLines.value, style: styles.multiline },
  refCardPath: { children: pathLines.value, style: styles.multiline },
  refCardCondition: { children: conditionLines.value, style: styles.multiline },
}))
const showSlot = {}

const styles: Record<string, CSSProperties> = {
  // The surface owns the box the reader drags, so the board's own size and padding go
  // and the panel fills what it is given.
  panel: {
    width: "100%",
    height: "100%",
    padding: 0,
  },
  // Holds the line breaks in a slot that carries several lines in one Text.
  multiline: {
    whiteSpace: "pre-line",
  },
}
</script>

<template>
  <WindowSurface
    :on-close="onClose"
    :surface-ref="setCardEl"
    :x="x"
    :y="y"
    :width="width"
    :height="height"
    :move-controls="moveControls"
    :drag-constraints="dragConstraints"
    :on-resize-start="onResizeStart"
    :on-resize="handleResize"
    :get-rect="getRect"
    :resize-sides="resizeSides"
    :min-width="MIN_WINDOW_SIZE.width"
    :min-height="MIN_WINDOW_SIZE.height"
  >
    <PanelRefs
      role="presentation"
      :style="styles.panel"
      :seldon-refs="cardRefs"
      :text-label2="showSlot"
      :text="viewSlot"
      :text2="viewFieldSlot"
      :text3="viewFieldSlot"
      :text-label3="showSlot"
    >
      <template #refCardControllers>
        <MessageRefController
          v-for="row in rows"
          :key="row.key"
          :seldon-refs="row.seldonRefs"
          :text="showSlot"
          :text2="row.path"
          :text3="row.pass"
          :text4="row.from"
          :hr="row.separator"
        />
      </template>
    </PanelRefs>
  </WindowSurface>
</template>
