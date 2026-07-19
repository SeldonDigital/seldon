import { computed, type ComputedRef } from "vue"
import { InstanceId, VariantId } from "@seldon/core"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import { componentBoardSchemaVariantNodeId } from "@seldon/core/workspace/helpers/components/entry-node-ids"
import { isVariantInUse } from "@seldon/core/workspace/helpers/general/is-variant-in-use"
import { isSandboxNode } from "@seldon/core/workspace/helpers/nodes/sandbox"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  resolveOriginalNodeId,
  resolveSourceNodeId,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { EntryNode, Workspace } from "@seldon/core/workspace/types"
import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@seldon/editor/lib/schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@seldon/editor/lib/schema/serialize-schema-ts"
import { buildResetMenuEntry } from "@seldon/editor/lib/menus/reset-menu"
import {
  getNodeCatalogComponentId,
} from "@seldon/editor/lib/workspace/node-tree"
import { hasNode } from "@seldon/editor/lib/workspace/workspace-accessors"
import type { MenuEntry } from "@app/menus/types"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useSelection } from "@app/workspace/use-selection"
import { usePropertiesClipboardStore } from "@app/workspace/properties-clipboard-store"
import { useToastStore } from "@app/toaster/toast-store"

interface RowNodeActionsInput {
  node: () => EntryNode
  workspace: () => Workspace
  isSelected: () => boolean
  isEcho: boolean
}

/**
 * Objects-sidebar row actions menu for a node. Adapts to the node's entity type
 * and only fills out for the selected non-echo row. Reset targets depend on how
 * the node resolves through its template chain. Mirrors the React
 * `useRowNodeActions`, dispatching the same core actions.
 */
export function useRowNodeActions(
  input: RowNodeActionsInput,
): ComputedRef<MenuEntry[]> {
  const dispatch = useDispatch()
  const { selectNode } = useSelection()
  const clipboard = usePropertiesClipboardStore()
  const toast = useToastStore()

  return computed<MenuEntry[]>(() => {
    if (input.isEcho) return []

    const node = input.node()
    const workspace = input.workspace()
    const isSelected = input.isSelected()

    const nodeExistsInWorkspace = hasNode(workspace, node.id)
    const catalogComponentId = nodeExistsInWorkspace
      ? getNodeCatalogComponentId(node, workspace)
      : null

    const hasClipboardProperties = clipboard.properties !== null

    // A schema-backed user variant has a catalog template: its root id matches a
    // schema variant id. Only those reset to catalog.
    const isSchemaBackedVariant =
      typeCheckingService.isUserVariant(node) &&
      !!catalogComponentId &&
      isComponentId(catalogComponentId) &&
      (getComponentSchema(catalogComponentId).variants ?? []).some(
        (variant) =>
          componentBoardSchemaVariantNodeId(catalogComponentId, variant.id) ===
          node.id,
      )

    const isInstanceNode =
      nodeExistsInWorkspace && typeCheckingService.isInstance(node)
    const instanceSourceId = isInstanceNode
      ? resolveSourceNodeId(workspace, node.id)
      : null
    const instanceOriginalId = isInstanceNode
      ? resolveOriginalNodeId(workspace, node.id)
      : null
    const canResetToSource = !!instanceSourceId && instanceSourceId !== node.id
    const canResetToOriginal =
      !!instanceOriginalId &&
      instanceOriginalId !== node.id &&
      instanceOriginalId !== instanceSourceId

    const canResetVariantInstances =
      nodeExistsInWorkspace &&
      typeCheckingService.isUserVariant(node) &&
      Object.values(workspace.nodes).some(
        (candidate) =>
          typeCheckingService.isInstance(candidate) &&
          resolveSourceNodeId(workspace, candidate.id) === node.id,
      )

    function handleResetDefaultVariantToCatalog(): void {
      dispatch({
        type: "reset_default_variant_to_catalog",
        payload: { defaultVariantRootId: node.id as VariantId },
      })
    }
    function handleResetVariantToCatalog(): void {
      dispatch({
        type: "reset_variant_to_catalog",
        payload: { variantRootId: node.id as VariantId },
      })
    }
    function handleResetVariantInstances(): void {
      dispatch({
        type: "reset_variant_instances",
        payload: { variantRootId: node.id as VariantId },
      })
    }
    function handleResetInstanceToSource(): void {
      dispatch({
        type: "reset_instance_to_source",
        payload: { instanceId: node.id as InstanceId },
      })
    }
    function handleResetInstanceToOriginal(): void {
      dispatch({
        type: "reset_instance_to_original",
        payload: { instanceId: node.id as InstanceId },
      })
    }

    function buildVariantResetAction(): MenuEntry {
      if (typeCheckingService.isDefaultVariant(node)) {
        return buildResetMenuEntry({
          id: "reset-to-catalog",
          label: "Reset to Catalog",
          onSelect: handleResetDefaultVariantToCatalog,
          testId: `object-panel-node-${node.id}-reset-to-catalog`,
        })
      }
      return buildResetMenuEntry({
        id: "reset-to-catalog",
        label: "Reset to Catalog",
        onSelect: handleResetVariantToCatalog,
        disabled: !isSchemaBackedVariant,
        testId: `object-panel-node-${node.id}-reset-to-catalog`,
      })
    }

    function buildInstanceResetActions(): MenuEntry[] {
      return [
        buildResetMenuEntry({
          id: "reset-to-source",
          label: "Reset to Source",
          onSelect: handleResetInstanceToSource,
          disabled: !canResetToSource,
          testId: `object-panel-node-${node.id}-reset-to-source`,
        }),
        buildResetMenuEntry({
          id: "reset-to-original",
          label: "Reset to Original",
          onSelect: handleResetInstanceToOriginal,
          disabled: !canResetToOriginal,
          testId: `object-panel-node-${node.id}-reset-to-original`,
        }),
      ]
    }

    function handleDuplicate(): void {
      dispatch({
        type: "duplicate_node",
        payload: { nodeId: node.id as VariantId },
      })
    }

    async function handleCopyJson(): Promise<void> {
      if (typeCheckingService.isInstance(node)) {
        toast.addToast("Nested children cannot be copied as schema JSON")
        return
      }
      const snippet = typeCheckingService.isDefaultVariant(node)
        ? buildDefaultSnippet(node, workspace)
        : buildVariantSnippet(node, workspace)
      if (!snippet) {
        toast.addToast("Could not resolve a catalog component for the selection")
        return
      }
      await navigator.clipboard.writeText(serializeSchemaSnippet(snippet))
      toast.addToast("Schema JSON copied to clipboard")
    }

    function handleCopyProperties(): void {
      clipboard.setProperties(structuredClone(node.overrides))
      toast.addToast("Properties copied")
    }

    function handlePasteProperties(): void {
      const properties = clipboard.properties
      if (!properties) {
        toast.addToast("No properties to paste")
        return
      }
      dispatch({
        type: "set_node_properties",
        payload: {
          nodeId: node.id as VariantId,
          properties,
          options: { mergeSubProperties: true },
        },
      })
    }

    function handleDelete(): void {
      const isVariant = typeCheckingService.isVariant(node)
      if (isVariant && isVariantInUse(node.id, workspace)) {
        const confirmed = window.confirm(
          "This variant is used in other components. Deleting it will also remove it from those components. Delete anyway?",
        )
        if (!confirmed) return
      }
      const subject = nodeRetrievalService.getNode(node.id, workspace)
      const adjacentId =
        nodeRelationshipService.findAdjacent(subject, "before", workspace)?.id ??
        nodeRelationshipService.findAdjacent(subject, "after", workspace)?.id ??
        null
      if (isVariant) {
        dispatch({
          type: "remove_variant",
          payload: { variantRootId: node.id as VariantId },
        })
      } else {
        dispatch({
          type: "remove_instance",
          payload: { instanceId: node.id as InstanceId },
        })
      }
      selectNode(adjacentId as VariantId | InstanceId | null)
    }

    const isDefault = typeCheckingService.isDefaultVariant(node)
    const isUser = typeCheckingService.isUserVariant(node)
    const isInstance = typeCheckingService.isInstance(node)
    const isAuthored = typeCheckingService.isAuthored(node)

    // Sandbox roots have no catalog default and are not exported, so they skip
    // Copy JSON and Reset. Child instances keep the standard menus below.
    if (isSelected && isSandboxNode(node)) {
      return [
        {
          id: "duplicate",
          label: `Duplicate ${node.label}`,
          onSelect: handleDuplicate,
          testId: `object-panel-node-${node.id}-duplicate`,
        },
        "separator",
        {
          id: "copy-properties",
          label: "Copy Properties",
          onSelect: handleCopyProperties,
          testId: `object-panel-node-${node.id}-copy-properties`,
        },
        {
          id: "paste-properties",
          label: "Paste Properties",
          onSelect: handlePasteProperties,
          disabled: !hasClipboardProperties,
          testId: `object-panel-node-${node.id}-paste-properties`,
        },
        "separator",
        {
          id: "delete",
          label: `Delete ${node.label}`,
          onSelect: handleDelete,
          testId: `object-panel-node-${node.id}-delete`,
        },
      ]
    }

    // Selected instance (child) rows get the variant menu minus Copy JSON.
    if (isSelected && isInstance) {
      return [
        {
          id: "duplicate",
          label: `Duplicate ${node.label}`,
          onSelect: handleDuplicate,
          testId: `object-panel-node-${node.id}-duplicate`,
        },
        "separator",
        {
          id: "copy-properties",
          label: "Copy Properties",
          onSelect: handleCopyProperties,
          testId: `object-panel-node-${node.id}-copy-properties`,
        },
        {
          id: "paste-properties",
          label: "Paste Properties",
          onSelect: handlePasteProperties,
          disabled: !hasClipboardProperties,
          testId: `object-panel-node-${node.id}-paste-properties`,
        },
        "separator",
        {
          id: "delete",
          label: `Delete ${node.label}`,
          onSelect: handleDelete,
          testId: `object-panel-node-${node.id}-delete`,
        },
        ...buildInstanceResetActions(),
      ]
    }

    // Only the selected default, user, or authored variant row gets the full menu.
    if (isSelected && (isDefault || isUser || isAuthored)) {
      const entries: MenuEntry[] = [
        {
          id: "duplicate",
          label: isDefault
            ? `Duplicate ${node.label} Default`
            : `Duplicate ${node.label}`,
          onSelect: handleDuplicate,
          testId: `object-panel-node-${node.id}-duplicate`,
        },
        "separator",
        {
          id: "copy-json",
          label: "Copy JSON",
          onSelect: handleCopyJson,
          testId: `object-panel-node-${node.id}-copy-json`,
        },
        "separator",
        {
          id: "copy-properties",
          label: "Copy Properties",
          onSelect: handleCopyProperties,
          testId: `object-panel-node-${node.id}-copy-properties`,
        },
        {
          id: "paste-properties",
          label: "Paste Properties",
          onSelect: handlePasteProperties,
          disabled: !hasClipboardProperties,
          testId: `object-panel-node-${node.id}-paste-properties`,
        },
        "separator",
      ]

      if (isUser) {
        entries.push({
          id: "delete",
          label: `Delete ${node.label}`,
          onSelect: handleDelete,
          testId: `object-panel-node-${node.id}-delete`,
        })
        entries.push(
          buildResetMenuEntry({
            id: "reset-variant-instances",
            label: "Reset Instances",
            onSelect: handleResetVariantInstances,
            disabled: !canResetVariantInstances,
            testId: `object-panel-node-${node.id}-reset-instances`,
          }),
        )
      }

      if (!isAuthored) {
        entries.push(buildVariantResetAction())
      }
      return entries
    }

    return []
  })
}
