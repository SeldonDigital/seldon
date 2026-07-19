import { computed, type ComputedRef } from "vue"
import type { Workspace } from "@seldon/core/workspace/types"
import {
  workspaceFontCollectionService,
  workspaceIconSetService,
} from "@seldon/core/workspace/services"
import {
  buildFontCollectionEditAction,
  buildIconSetEditAction,
} from "@seldon/editor/lib/resources/build-resource-edit-actions"
import {
  buildFontCollectionRows,
  buildIconSetRows,
  type ResourceRowSection,
} from "@seldon/editor/lib/resources/resource-rows"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { storeToRefs } from "pinia"

export type ResourceEditKind = "fontCollection" | "iconSet"

export type SelectedResource = { kind: ResourceEditKind; id: string } | null

/**
 * Font-collection and icon-set token editing for the properties sidebar. Given
 * the selected resource entry, resolves the computed resource, flattens it into
 * grouped rows, and commits edits through the shared action builders so the Vue
 * editor dispatches the same workspace actions as the React editor.
 */
export function useResourceProperties(
  resource: ComputedRef<SelectedResource>,
  workspace: ComputedRef<Workspace>,
) {
  const dispatch = useDispatch()
  const config = useEditorConfigStore()
  const { showUnusedFonts, showUnusedIcons } = storeToRefs(config)

  const sections = computed<ResourceRowSection[]>(() => {
    const current = resource.value
    if (!current) return []

    if (current.kind === "fontCollection") {
      const collection = workspaceFontCollectionService.getFontCollection(
        current.id,
        workspace.value,
      )
      if (!collection) return []
      const selection = workspaceFontCollectionService.getVariantSelection(
        current.id,
        workspace.value,
      )
      return buildFontCollectionRows(
        collection,
        selection,
        showUnusedFonts.value,
      )
    }

    const set = workspaceIconSetService.getIconSet(current.id, workspace.value)
    if (!set) return []
    const inclusion = workspaceIconSetService.getInclusion(
      current.id,
      workspace.value,
    )
    return buildIconSetRows(set, inclusion, showUnusedIcons.value)
  })

  function commit(key: string, raw: string): void {
    const current = resource.value
    if (!current) return
    const action =
      current.kind === "fontCollection"
        ? buildFontCollectionEditAction(current.id, key, raw)
        : buildIconSetEditAction(current.id, key, raw)
    if (action) dispatch(action as never)
  }

  return { sections, commit }
}
