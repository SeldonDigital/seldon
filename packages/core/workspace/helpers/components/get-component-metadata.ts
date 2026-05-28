import type { ComponentEntry } from "../../types"

/** ComponentEntry fields other than the variant tree, for checks that should ignore variants. */
export type ComponentMetadata = Omit<ComponentEntry, "variants">

/**
 * Builds a plain object with every board field except variants.
 * Use this snapshot when you compare or hash board data without the variant tree.
 *
 * @param board ComponentEntry to read.
 */
export function getComponentMetadata(board: ComponentEntry): ComponentMetadata {
  const { variants, ...metadata } = board
  void variants
  return metadata
}
