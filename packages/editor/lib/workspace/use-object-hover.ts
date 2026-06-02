import { useMemo } from "react"
import type { CSSProperties } from "react"
import { create } from "zustand"

/**
 * The single hovered object across the editor. Both the Objects sidebar and the
 * canvas write this id on pointer move and read it to highlight, so hovering one
 * surface lights up the matching row or canvas object on the other.
 *
 * Kept separate from the component/sketch insertion hover (`use-canvas-hover-state`)
 * so select-mode highlighting and insertion tracking stay decoupled.
 */
interface ObjectHoverState {
  hoveredId: string | null
  setHoveredId: (id: string | null) => void
}

const useStore = create<ObjectHoverState>((set) => ({
  hoveredId: null,
  setHoveredId: (hoveredId) =>
    set((state) => (state.hoveredId === hoveredId ? state : { hoveredId })),
}))

/** The hovered id setter. Stable, so subscribers never re-render on hover. */
export const useSetHoveredId = (): ObjectHoverState["setHoveredId"] =>
  useStore((state) => state.setHoveredId)

/** The currently hovered object id. */
export const useHoveredId = (): string | null =>
  useStore((state) => state.hoveredId)

/** Whether the given id is the hovered one. Only matching rows re-render. */
export const useIsHovered = (id: string): boolean =>
  useStore((state) => state.hoveredId === id)

/** Imperative read for handlers that should not subscribe. */
export const getHoveredId = (): string | null => useStore.getState().hoveredId

/**
 * Shared row highlight style: selected border or hover background. Replaces the
 * per-row `useRowHover` so every row type highlights identically.
 */
export function useRowHighlightStyle(
  id: string,
  isSelected: boolean,
): CSSProperties {
  const isHovered = useIsHovered(id)
  return useMemo(
    () => ({
      ...(isSelected
        ? { borderColor: "var(--sdn-seldon-swatch-primary)" }
        : {}),
      ...(isHovered && !isSelected
        ? { backgroundColor: "hsl(0 0% 100% / 0.1)" }
        : {}),
    }),
    [isHovered, isSelected],
  )
}
