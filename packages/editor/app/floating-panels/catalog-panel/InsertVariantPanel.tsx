"use client"

import { Target } from "@lib/types"
import { useCallback } from "react"
import { invariant } from "@seldon/core"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/helpers/validation"
import { confirmMissingSchemaVariants } from "@lib/workspace/confirm-missing-schema-variants"
import { InstanceId, VariantId } from "@seldon/core/workspace/types"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { useAutoSelectNode } from "@lib/workspace/use-auto-select-node"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { CatalogPanel } from "./CatalogPanel"
import {
  CatalogComponentItem,
  FilterComponentPredicate,
  useComponentCatalog,
} from "./use-component-catalog"

/**
 * This panel is used to insert an existing variant into another node
 */
export function InsertVariantPanel({
  target,
  onClose,
}: {
  target: Target | null
  onClose: () => void
}) {
  const { setActiveTool } = useTool()
  const { dispatchWithAutoSelect } = useAutoSelectNode()
  const { workspace } = useWorkspace()

  const handlePick = async (item: CatalogComponentItem) => {
    invariant(target, "No target selected")

    // If the variant doesn't exist yet, create it
    if (!item.variantId) {
      const variantFallbacks = await confirmMissingSchemaVariants(item.componentId)
      if (variantFallbacks === null) {
        return
      }

      dispatchWithAutoSelect({
        type: "add_component_and_insert_default_instance",
        payload: {
          componentId: item.componentId,
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
  }

  const shouldShowComponent: FilterComponentPredicate = useCallback(
    (schema) => {
      if (!target) return false

      // Use workspace validation system instead of custom logic
      const validation = validateComponentInsertionForUI(
        schema.id,
        target.nodeId as VariantId | InstanceId,
        workspace,
        {
          checkCircularDependencies: true,
          validateLevels: true,
        },
      )

      return validation.isValid
    },
    [target, workspace],
  )

  const { categories, query, setQuery, submit, isFetching } =
    useComponentCatalog({
      shouldShowComponent,
      task: "search_all",
      target,
    })

  return (
    <CatalogPanel
      onClose={onClose}
      onPick={handlePick}
      categories={categories}
      query={query}
      onQueryChange={setQuery}
      onSubmitSearch={submit}
      isSearching={isFetching}
      confirmButtonText="Insert component"
      title="Insert component"
    />
  )
}

const Controller = () => {
  const { activeDialog, target, closeDialog } = useDialog()

  if (activeDialog !== "component") return null

  return <InsertVariantPanel target={target ?? null} onClose={closeDialog} />
}

InsertVariantPanel.Controller = Controller
