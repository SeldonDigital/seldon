import type { SelectionKind } from "@seldon/editor/lib/workspace/selection-kind"
import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * The single hovered object across the editor. Both the objects sidebar and the
 * canvas write this id on pointer move and read it to highlight, so hovering one
 * surface lights up the matching row or canvas object on the other. For node
 * hovers the canvas also records the kind and variant-root id of the hovered
 * column so a child id shared across columns outlines only the hovered copy.
 * Mirrors the React `use-object-hover` store.
 */
export const useObjectHoverStore = defineStore("object-hover", () => {
  const hoveredId = ref<string | null>(null)
  const hoveredKind = ref<SelectionKind | null>(null)
  const hoveredRootId = ref<string | null>(null)

  function setHoveredId(
    id: string | null,
    kind: SelectionKind | null = null,
    rootId: string | null = null,
  ): void {
    hoveredId.value = id
    hoveredKind.value = id ? kind : null
    hoveredRootId.value = id ? rootId : null
  }

  function isHovered(id: string, rootId?: string): boolean {
    return (
      hoveredId.value === id &&
      (hoveredRootId.value == null || hoveredRootId.value === rootId)
    )
  }

  return { hoveredId, hoveredKind, hoveredRootId, setHoveredId, isHovered }
})
