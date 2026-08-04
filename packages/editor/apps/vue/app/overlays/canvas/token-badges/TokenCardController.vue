<script setup lang="ts">
// Binds one property to the card half of `PanelToken`.
//
// It floats on `WindowSurface`, the same shell the dialogs and palettes use, and fills
// the card frame with the live property control from the sidebar, so editing a token on
// the canvas is the same control as editing it in the inspector. The height follows the
// control: the authored `fit-content` frame drives it, so the card opens hugging the
// control and grows as a compound's disclosure opens. The width opens at a set size and
// is resizable, since a compound's child rows truncate at a narrow width. Vue port of the
// React `TokenCardController`.
import Property from "@app/sidebars/properties/Property.vue"
import { providePropertyCardScope } from "@app/sidebars/properties/hooks/use-property-card-scope"
import { providePropertyEditNavigation } from "@app/sidebars/properties/use-property-edit-navigation"
import WindowSurface from "@app/windows/WindowSurface.vue"
import { MIN_WINDOW_SIZE, useDraggableWindow } from "@app/windows/use-draggable-window"
import PanelToken from "@seldon/components/modules/PanelToken.vue"
import { clampCardWidth } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import { getCanvasElement } from "@seldon/editor/lib/canvas/dom/canvas-elements"
import { computed, ref, watch } from "vue"

import { getTokenCardWidth, setTokenCardWidth } from "./hooks/use-token-card"
import { buildTokenRowProps, useTokenProperties } from "./hooks/use-token-property-row"

import type { Rect, ResizeSide } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties } from "vue"

/** The width a token card opens at, and the narrowest a drag may take it to. */
const TOKEN_CARD_WIDTH = 250

/** The widest a drag may take a token card, so a compound's values read without sprawling. */
const TOKEN_CARD_MAX_WIDTH = TOKEN_CARD_WIDTH * 2.5

const props = defineProps<{
  propertyKey: string
  position: RefCardPosition
  onClose: () => void
  setCardEl: (el: HTMLElement | null) => void
}>()

// The card and its child facets keep their disclosure and edit-navigation state local to
// the card, so opening a compound here never touches the sidebar.
providePropertyCardScope()
providePropertyEditNavigation()

const tokenProperties = useTokenProperties()

// The width the reader last dragged to, so a widened card stays wide across the selection,
// seeded to the card's set width the first time.
const cardWidth = ref<number>(getTokenCardWidth() ?? TOKEN_CARD_WIDTH)

// The card renders in the canvas layer so the sidebar clips it like the badges, rather
// than floating over the chrome. Its position already arrives in that layer's space.
const canvas = getCanvasElement()

const { x, y, width, moveControls, dragConstraints, onResizeStart, onResize, getRect } =
  useDraggableWindow({
    initialPosition: { x: props.position.x, y: props.position.y },
    initialSize: { width: cardWidth.value, height: props.position.height },
    handleClose: props.onClose,
    minWidth: TOKEN_CARD_WIDTH,
    minHeight: MIN_WINDOW_SIZE.height,
  })

// The badge moves as the canvas scrolls, and the card travels with it.
watch(
  () => [props.position.x, props.position.y],
  ([nextX, nextY]) => {
    x.set(nextX)
    y.set(nextY)
  },
)

// Drive the width motion value from the chosen width, so a resize drag reads the true
// starting width from `getRect`.
watch(cardWidth, (value) => width.set(value), { immediate: true })

// A drag on the width edge sets the card's width and remembers it for the next card.
function handleResize(rect: Rect): void {
  const capped = clampCardWidth(rect, props.position.grows, TOKEN_CARD_MAX_WIDTH)

  onResize(capped)
  cardWidth.value = capped.width
  setTokenCardWidth(capped.width)
}

// Only the edge away from the badge is offered, so a drag cannot pull the card over the
// badge that opened it. The height is not resizable, since it follows the control.
const resizeSides = computed<ResizeSide[]>(() =>
  props.position.grows === "left" ? ["left"] : ["right"],
)

const rowProps = computed(() => buildTokenRowProps(props.propertyKey, tokenProperties))

// No height here: the authored `fit-content` frame drives the card's height, and the
// window hugs it. The width is driven by the window, so the panel and frame fill it and
// the control reflows to the chosen width.
const styles: Record<string, CSSProperties> = {
  panel: { width: "100%", padding: 0, cursor: "default" },
  card: { width: "100%" },
}

const cardRefs = computed(() => ({ tokenCard: { style: styles.card } }))
</script>

<template>
  <WindowSurface
    :on-close="onClose"
    :surface-ref="setCardEl"
    :x="x"
    :y="y"
    :width="width"
    :move-controls="moveControls"
    :drag-constraints="dragConstraints"
    :on-resize-start="onResizeStart"
    :on-resize="handleResize"
    :get-rect="getRect"
    :resize-sides="resizeSides"
    :min-width="TOKEN_CARD_WIDTH"
    :min-height="MIN_WINDOW_SIZE.height"
    :portal-target="canvas"
    :anchored="canvas !== null"
  >
    <PanelToken role="presentation" :style="styles.panel" :seldon-refs="cardRefs" :chip-assist="null">
      <template #tokenCard>
        <Property v-if="rowProps" v-bind="rowProps" presentation="token" />
      </template>
    </PanelToken>
  </WindowSurface>
</template>
