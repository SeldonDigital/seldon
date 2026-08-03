import { Property } from "@app/sidebars/properties/Property"
import { PropertyEditNavigationProvider } from "@app/sidebars/properties/hooks/use-property-edit-navigation"
import { WindowSurface } from "@app/windows/WindowSurface.bespoke"
import { MIN_WINDOW_SIZE, useDraggableWindow } from "@app/windows/hooks/use-draggable-window"
import { PanelToken } from "@seldon/components/modules/PanelToken"
import { useEffect, useMemo } from "react"

import { buildTokenRowProps, useTokenProperties } from "./hooks/use-token-property-row"

import type { RefCardPosition } from "@seldon/editor/lib/canvas/connectors/connector-layout"
import type { CSSProperties, Ref } from "react"

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
 * Like the ref card, it never styles the authored frame; the `fit-content` `PanelToken`
 * frame drives its own width, padding, and height, so the window hugs it and the control
 * renders at the sidebar's size. Its own disclosure grows the card for a compound like
 * background or border.
 */
export function TokenCardController({
  propertyKey,
  position,
  onClose,
  cardRef,
}: TokenCardControllerProps) {
  const tokenProperties = useTokenProperties()

  const { x, y, moveControls, dragConstraints } = useDraggableWindow({
    initialPosition: { x: position.x, y: position.y },
    initialSize: { width: position.width, height: position.height },
    handleClose: onClose,
    minWidth: MIN_WINDOW_SIZE.width,
    minHeight: MIN_WINDOW_SIZE.height,
  })

  // The badge moves as the canvas scrolls, and the card travels with it.
  useEffect(() => {
    x.set(position.x)
    y.set(position.y)
  }, [position.x, position.y, x, y])

  const rowProps = useMemo(
    () => buildTokenRowProps(propertyKey, tokenProperties),
    [propertyKey, tokenProperties],
  )

  const control = rowProps ? (
    <PropertyEditNavigationProvider>
      <Property {...rowProps} />
    </PropertyEditNavigationProvider>
  ) : null

  const cardRefs = {
    tokenCard: { children: control },
  }

  return (
    <WindowSurface
      onClose={onClose}
      surfaceRef={cardRef}
      x={x}
      y={y}
      moveControls={moveControls}
      dragConstraints={dragConstraints}
    >
      <PanelToken
        role="presentation"
        style={styles.panel}
        seldonRefs={cardRefs}
        chipAssist={null}
      />
    </WindowSurface>
  )
}

// No size here: the authored `fit-content` frame drives the card's width and height, and
// the window hugs it. Only the panel's own padding and pointer are cleared.
const styles: Record<string, CSSProperties> = {
  panel: {
    padding: 0,
    cursor: "default",
  },
}
