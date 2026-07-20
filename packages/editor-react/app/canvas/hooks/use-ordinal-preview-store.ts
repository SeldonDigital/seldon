import {
  ORDINAL_SCALES,
  type OrdinalScale,
} from "@seldon/editor/lib/themes/ordinal-preview"
import { create } from "zustand"

/**
 * Per-preview ordinal step selections for theme boards. The specimen legend
 * menus write it and the theme preview reads it to render the chosen step on the
 * button and drive the chip row values. Keyed by `${variantEntryId}:${scale}`.
 * A missing entry means the scale's default step. Session only, not persisted.
 */
interface OrdinalPreviewStore {
  selections: Record<string, string>
  setSelection: (
    variantEntryId: string,
    scale: OrdinalScale,
    step: string,
  ) => void
}

export function ordinalSelectionKey(
  variantEntryId: string,
  scale: OrdinalScale,
): string {
  return `${variantEntryId}:${scale}`
}

export const useOrdinalPreviewStore = create<OrdinalPreviewStore>((set) => ({
  selections: {},
  setSelection: (variantEntryId, scale, step) =>
    set((current) => ({
      selections: {
        ...current.selections,
        [ordinalSelectionKey(variantEntryId, scale)]: step,
      },
    })),
}))

/** Reactive read of one preview scale's step, defaulting to the scale default. */
export function useOrdinalSelection(
  variantEntryId: string,
  scale: OrdinalScale,
): string {
  return useOrdinalPreviewStore(
    (store) =>
      store.selections[ordinalSelectionKey(variantEntryId, scale)] ??
      ORDINAL_SCALES[scale].defaultStep,
  )
}
