import { useMemo } from "react"
import type { CSSProperties } from "react"
import { create } from "zustand"
import { useTool } from "@app/editor/hooks/use-tool"
import type { SelectionKind } from "@app/workspace/selection-target"

/**
 * The single hovered object across the editor. Both the Objects sidebar and the
 * canvas write this id on pointer move and read it to highlight, so hovering one
 * surface lights up the matching row or canvas object on the other.
 *
 * For node hovers the canvas also records the kind and the variant-root id of
 * the hovered column, so a child id shared across variant columns outlines only
 * the hovered copy instead of the union of every copy.
 *
 * Kept separate from the component insertion hover (`use-canvas-hover-state`)
 * so select-mode highlighting and insertion tracking stay decoupled.
 */
interface ObjectHoverState {
  hoveredId: string | null
  hoveredKind: SelectionKind | null
  hoveredRootId: string | null
  setHoveredId: (
    id: string | null,
    kind?: SelectionKind | null,
    rootId?: string | null,
  ) => void
}

const useStore = create<ObjectHoverState>((set) => ({
  hoveredId: null,
  hoveredKind: null,
  hoveredRootId: null,
  setHoveredId: (hoveredId, kind = null, rootId = null) =>
    set((state) =>
      state.hoveredId === hoveredId &&
      state.hoveredKind === kind &&
      state.hoveredRootId === rootId
        ? state
        : {
            hoveredId,
            hoveredKind: hoveredId ? kind : null,
            hoveredRootId: hoveredId ? rootId : null,
          },
    ),
}))

/** The hovered id setter. Stable, so subscribers never re-render on hover. */
export const useSetHoveredId = (): ObjectHoverState["setHoveredId"] =>
  useStore((state) => state.setHoveredId)

/** The currently hovered object id. */
export const useHoveredId = (): string | null =>
  useStore((state) => state.hoveredId)

/** The kind of the currently hovered object, when known. */
export const useHoveredKind = (): SelectionKind | null =>
  useStore((state) => state.hoveredKind)

/** The variant-root column of the hovered node, when known. */
export const useHoveredRootId = (): string | null =>
  useStore((state) => state.hoveredRootId)

/**
 * Whether the given copy is the hovered one. A child id is shared across
 * variant columns, so the optional `rootId` path identifies the copy. Hovers
 * recorded without a path (boards, resources) match by id alone. Only matching
 * rows re-render.
 */
export const useIsHovered = (id: string, rootId?: string): boolean =>
  useStore(
    (state) =>
      state.hoveredId === id &&
      (state.hoveredRootId == null || state.hoveredRootId === rootId),
  )

/**
 * Shared row highlight style: selected border or hover background. Replaces the
 * per-row `useRowHover` so every row type highlights identically. Pass the
 * copy's `rootId` path so a child id shared across columns highlights only the
 * hovered copy.
 */
export function useRowHighlightStyle(
  id: string,
  isSelected: boolean,
  rootId?: string,
): CSSProperties {
  const isHovered = useIsHovered(id, rootId)
  const { activeTool } = useTool()
  return useMemo(
    () => ({
      ...(isSelected ? { borderColor: "var(--sdn-swatch-primary)" } : {}),
      // Suppress the default hover in insert component mode so only the
      // insertion tracking (accent fill and the line with dot) reads. The hover
      // tint tracks the chrome theme's active swatch instead of a fixed white,
      // so it stays visible on both light and dark themes.
      ...(isHovered && !isSelected && activeTool !== "component"
        ? {
            backgroundColor:
              "color-mix(in srgb, var(--sdn-swatch-active) 10%, transparent)",
          }
        : {}),
    }),
    [isHovered, isSelected, activeTool],
  )
}
