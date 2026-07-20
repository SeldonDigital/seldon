"use client"

import { usePanel } from "@app/editor/hooks/use-panel"
import { useTool } from "@app/editor/hooks/use-tool"
import { useAutoSelectNode } from "@app/workspace/hooks/use-auto-select-node"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { confirmMissingSchemaVariants } from "@seldon/editor/lib/workspace/confirm-missing-schema-variants"
import { useCallback } from "react"

import { invariant } from "@seldon/core"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/helpers/validation"
import { InstanceId, VariantId } from "@seldon/core/workspace/types"

import { PanelDialogController } from "../PanelDialogController"
import {
  CatalogComponentItem,
  FilterComponentPredicate,
  useDialog,
} from "../hooks/use-dialog"

/**
 * Dialog for inserting an existing variant into the selected target node.
 */
export function ComponentsDialog() {
  const { activePanel, target, closePanel } = usePanel()
  const { setActiveTool } = useTool()
  const { dispatchWithAutoSelect } = useAutoSelectNode()
  const { workspace } = useWorkspace()

  const shouldShowComponent = useCallback<FilterComponentPredicate>(
    (schema) => {
      if (!target) return false

      // Use workspace validation system instead of custom logic
      const validation = validateComponentInsertionForUI(
        schema.id,
        target.nodeId as VariantId | InstanceId,
        workspace,
      )

      return validation.isValid
    },
    [target, workspace],
  )

  const { categories, query, setQuery } = useDialog({
    shouldShowComponent,
  })

  const handlePick = useCallback(
    async (item: CatalogComponentItem) => {
      invariant(target, "No target selected")

      // If the variant doesn't exist yet, create it
      if (!item.variantId) {
        const variantFallbacks = await confirmMissingSchemaVariants(
          item.componentId,
        )
        if (variantFallbacks === null) {
          return
        }

        dispatchWithAutoSelect({
          type: "add_component_and_insert_default_instance",
          payload: {
            boardKey: item.componentId,
            variantFallbacks: variantFallbacks.length
              ? variantFallbacks
              : undefined,
            target: {
              parentId: target.nodeId as VariantId | InstanceId,
              index: target.index,
            },
          },
        })
      } else {
        dispatchWithAutoSelect({
          type: "insert_variant_instance",
          payload: {
            variantId: item.variantId,
            target: {
              parentId: target.nodeId as VariantId | InstanceId,
              index: target.index,
            },
          },
        })
      }

      setActiveTool("select")
    },
    [target, dispatchWithAutoSelect, setActiveTool],
  )

  if (activePanel !== "component") return null

  return (
    <PanelDialogController
      title="Insert component"
      confirmButtonText="Insert component"
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onPick={handlePick}
      onClose={closePanel}
    />
  )
}
