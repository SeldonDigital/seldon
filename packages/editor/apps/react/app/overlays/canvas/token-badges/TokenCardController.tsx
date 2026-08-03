import { Property } from "@app/sidebars/properties/Property"
import { PropertyCardScopeProvider } from "@app/sidebars/properties/hooks/use-property-card-scope"
import { PropertyEditNavigationProvider } from "@app/sidebars/properties/hooks/use-property-edit-navigation"
import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
import { MIN_WINDOW_SIZE, useDraggableWindow } from "@app/windows/hooks/use-draggable-window"
import { PanelToken } from "@seldon/components/modules/PanelToken"
import { useCallback, useEffect, useMemo, useState } from "react"

import { buildTokenRowProps, useTokenProperties } from "./hooks/use-token-property-row"
import { getTokenCardWidth, setTokenCardWidth } from "./hooks/use-token-card"

import type { Rect, ResizeSide } from "@seldon/components/utils/resize"
import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties, Ref } from "react"

/** The width a token card opens at, and the narrowest a drag may take it to. */
const TOKEN_CARD_WIDTH = 250

interface TokenCardControllerProps {
  propertyKey: string
  position: RefCardPosition
  onClose: () => void
  cardRef: Ref<HTMLDivElement>
}

/**
 * Binds one property to the card half of `PanelToken`.
 *
 * It floats on `WindowSurface`, the same shell the dialogs and palettes use, and fills
 * the card frame with the live property control from the sidebar, so editing a token on
 * the canvas is the same control as editing it in the inspector.
 *
 * The height always follows the control: the authored `fit-content` frame drives it, so
 * the card opens hugging the control and grows as a compound's disclosure opens, staying
 * pinned to its badge. The width opens at a set size and is resizable, since a compound's
 * child rows truncate their values at a narrow width; dragging the card wider fills it so
 * those values read in full, and that width carries to the next card.
 */
export function TokenCardController({
  propertyKey,
  position,
  onClose,
  cardRef,
}: TokenCardControllerProps) {
  const tokenProperties = useTokenProperties()

  // The width the reader last dragged to, so a widened card stays wide across the
  // selection, seeded to the card's set width the first time.
  const [cardWidth, setCardWidth] = useState<number>(() => getTokenCardWidth() ?? TOKEN_CARD_WIDTH)

  const { x, y, width, moveControls, dragConstraints, onResizeStart, onResize, getRect } =
    useDraggableWindow({
      initialPosition: { x: position.x, y: position.y },
      initialSize: { width: cardWidth, height: position.height },
      handleClose: onClose,
      minWidth: TOKEN_CARD_WIDTH,
      minHeight: MIN_WINDOW_SIZE.height,
    })

  // The badge moves as the canvas scrolls, and the card travels with it.
  useEffect(() => {
    x.set(position.x)
    y.set(position.y)
  }, [position.x, position.y, x, y])

  // Drive the width motion value from the chosen width, so a resize drag reads the true
  // starting width from `getRect`.
  useEffect(() => {
    width.set(cardWidth)
  }, [cardWidth, width])

  // A drag on the width edge sets the card's width and remembers it for the next card.
  const handleResize = useCallback(
    (rect: Rect) => {
      onResize(rect)
      setCardWidth(rect.width)
      setTokenCardWidth(rect.width)
    },
    [onResize],
  )

  // Only the edge away from the badge is offered, so a drag cannot pull the card over the
  // badge that opened it. The height is not resizable, since it follows the control.
  const resizeSides = useMemo<ResizeSide[]>(
    () => (position.grows === "left" ? ["left"] : ["right"]),
    [position.grows],
  )

  const rowProps = useMemo(
    () => buildTokenRowProps(propertyKey, tokenProperties),
    [propertyKey, tokenProperties],
  )

  const control = rowProps ? (
    <PropertyCardScopeProvider>
      <PropertyEditNavigationProvider>
        <Property {...rowProps} presentation="token" />
      </PropertyEditNavigationProvider>
    </PropertyCardScopeProvider>
  ) : null

  const cardRefs = {
    tokenCard: { children: control, style: styles.card },
  }

  return (
    <WindowSurface
      onClose={onClose}
      surfaceRef={cardRef}
      x={x}
      y={y}
      width={width}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
      onResizeStart={onResizeStart}
      onResize={handleResize}
      getRect={getRect}
      resizeSides={resizeSides}
      minWidth={TOKEN_CARD_WIDTH}
      minHeight={MIN_WINDOW_SIZE.height}
    >
      <PanelToken role="presentation" style={styles.panel} seldonRefs={cardRefs} chipAssist={null} />
    </WindowSurface>
  )
}

// No height here: the authored `fit-content` frame drives the card's height, and the
// window hugs it. The width is driven by the window, so the panel and frame fill it and
// the control reflows to the chosen width.
const styles: Record<string, CSSProperties> = {
  panel: {
    width: "100%",
    padding: 0,
    cursor: "default",
  },
  card: {
    width: "100%",
  },
}
