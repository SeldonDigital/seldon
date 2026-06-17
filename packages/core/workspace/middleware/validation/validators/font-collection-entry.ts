import { isEntryFontCollectionVariant } from "../../../model/entry-font-collection"
import type { Workspace } from "../../../types"
import { check } from "../check"

export const fontCollectionEntryValidators = {
  exists: (workspace: Workspace, id: string | undefined) => {
    if (!id) return
    check(workspace["font-collections"][id], `Font collection ${id} not found`)
  },
  /** Asserts the entry exists and has `type: "variant"`. Default entries stay catalog-aligned. */
  isVariant: (workspace: Workspace, id: string) => {
    const entry = workspace["font-collections"][id]
    check(entry, `Font collection ${id} not found`)
    check(
      isEntryFontCollectionVariant(entry!),
      `Custom font families may only be added to variant font collection entries; ${id} is type "${entry!.type}"`,
    )
  },
  customFamilyExists: (workspace: Workspace, id: string, key: string) => {
    const entry = workspace["font-collections"][id]
    const bag = entry?.overrides?.families as
      | Record<string, unknown>
      | undefined
    check(bag?.[key], `Custom family ${key} not found in ${id}`)
  },
}
