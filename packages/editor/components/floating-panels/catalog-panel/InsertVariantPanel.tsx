"use client"

import { Target } from "@lib/types"
import { useCallback } from "react"
import { invariant } from "@seldon/core"
import { validateComponentInsertionForUI } from "@seldon/core/workspace/reducers/core/helpers/validation"
import { InstanceId, VariantId } from "@seldon/core/workspace/types"
import { useDialog } from "@lib/hooks/use-dialog"
import { useTool } from "@lib/hooks/use-tool"
import { useAutoSelectNode } from "@lib/workspace/use-auto-select-node"
import { useWorkspace } from "@lib/workspace/use-workspace"
import {
  CatalogItem,
  CatalogPanel,
  FilterComponentPredicate,
} from "./CatalogPanel"

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

  const handlePick = async (item: CatalogItem) => {
    invariant(target, "No target selected")

    // If the variant doesn't exist yet, create it
    if (!item.variantId) {
      dispatchWithAutoSelect({
        type: "add_board_and_insert_default_variant",
        payload: {
          componentId: item.componentId,
          target: {
            parentId: target.nodeId as VariantId | InstanceId,
            index: target.index,
          },
        },
      })
    } else {
      dispatchWithAutoSelect({
        type: "insert_node",
        payload: {
          nodeId: item.variantId,
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

  return (
    <CatalogPanel
      onClose={onClose}
      onPick={handlePick}
      shouldShowComponent={shouldShowComponent}
      confirmButtonText="Insert component"
      title="Insert component"
      target={target}
      task="search_all"
    />
  )
}

const Controller = () => {
  const { activeDialog, target, closeDialog } = useDialog()

  if (activeDialog !== "component") return null

  return <InsertVariantPanel target={target ?? null} onClose={closeDialog} />
}

InsertVariantPanel.Controller = Controller
