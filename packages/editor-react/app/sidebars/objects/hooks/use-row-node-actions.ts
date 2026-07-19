import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@seldon/editor/lib/copy-schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@seldon/editor/lib/copy-schema/serialize-schema-ts"
import { MenuEntry } from "@app/menus"
import { buildResetMenuEntry } from "@app/menus/build-reset-menu-entry"
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
import type { EntryNode } from "@seldon/core/workspace/types"
import { usePropertiesClipboard } from "@app/workspace/hooks/use-properties-clipboard"
import { useSelectionActions } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { getNodeCatalogComponentId } from "@seldon/editor/lib/workspace/node-tree"
import { hasNode } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"

type Workspace = ReturnType<typeof useWorkspace>["workspace"]
type Dispatch = ReturnType<typeof useWorkspace>["dispatch"]

interface RowNodeActionsInput {
  node: EntryNode
  workspace: Workspace
  dispatch: Dispatch
  isSelected: boolean
  isEcho: boolean
}

/**
 * Builds the objects-sidebar row actions menu for a node. The menu adapts to the
 * node's entity type and only fills out for the selected row; unselected rows and
 * echo rows return an empty menu. Reset entries depend on how the node resolves
 * through its template chain, so the enabled targets are computed here too.
 */
export function useRowNodeActions({
  node,
  workspace,
  dispatch,
  isSelected,
  isEcho,
}: RowNodeActionsInput): MenuEntry[] {
  const addToast = useAddToast()
  const { selectNode } = useSelectionActions()
  const hasClipboardProperties = usePropertiesClipboard(
    (state) => state.properties !== null,
  )

  const nodeExistsInWorkspace = hasNode(workspace, node.id)
  const catalogComponentId = nodeExistsInWorkspace
    ? getNodeCatalogComponentId(node, workspace)
    : null

  // A schema-backed user variant has a catalog template in the component schema:
  // its root id matches a schema variant id. Only those reset to catalog. A user
  // variant a person built from scratch has no catalog variant to reset to.
  const isSchemaBackedVariant =
    typeCheckingService.isUserVariant(node) &&
    !!catalogComponentId &&
    isComponentId(catalogComponentId) &&
    (getComponentSchema(catalogComponentId).variants ?? []).some(
      (variant) =>
        componentBoardSchemaVariantNodeId(catalogComponentId, variant.id) ===
        node.id,
    )

  // Instance resets walk the template chain. Source is the node one hop up;
  // Original is the chain terminal. Disable a target that does not resolve to a
  // different node, and drop Original when it matches Source.
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

  // A user variant can reset its instances when at least one instance links
  // straight to it as its source. Enables the "Reset Instances" action.
  const canResetVariantInstances =
    nodeExistsInWorkspace &&
    typeCheckingService.isUserVariant(node) &&
    Object.values(workspace.nodes).some(
      (candidate) =>
        typeCheckingService.isInstance(candidate) &&
        resolveSourceNodeId(workspace, candidate.id) === node.id,
    )

  function handleResetDefaultVariantToCatalog() {
    dispatch({
      type: "reset_default_variant_to_catalog",
      payload: { defaultVariantRootId: node.id as VariantId },
    })
  }

  function handleResetVariantToCatalog() {
    dispatch({
      type: "reset_variant_to_catalog",
      payload: { variantRootId: node.id as VariantId },
    })
  }

  function handleResetVariantInstances() {
    dispatch({
      type: "reset_variant_instances",
      payload: { variantRootId: node.id as VariantId },
    })
  }

  function handleResetInstanceToSource() {
    dispatch({
      type: "reset_instance_to_source",
      payload: { instanceId: node.id as InstanceId },
    })
  }

  function handleResetInstanceToOriginal() {
    dispatch({
      type: "reset_instance_to_original",
      payload: { instanceId: node.id as InstanceId },
    })
  }

  // The default variant always resets to its catalog schema. A custom variant
  // resets to its schema variant, disabled when it has no catalog template.
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

  function handleDuplicate() {
    dispatch({
      type: "duplicate_node",
      payload: { nodeId: node.id as VariantId },
    })
  }

  async function handleCopyJson() {
    if (typeCheckingService.isInstance(node)) {
      addToast("Nested children cannot be copied as schema JSON")
      return
    }
    const snippet = typeCheckingService.isDefaultVariant(node)
      ? buildDefaultSnippet(node, workspace)
      : buildVariantSnippet(node, workspace)
    if (!snippet) {
      addToast("Could not resolve a catalog component for the selection")
      return
    }
    await navigator.clipboard.writeText(serializeSchemaSnippet(snippet))
    addToast("Schema JSON copied to clipboard")
  }

  function handleCopyProperties() {
    usePropertiesClipboard
      .getState()
      .setProperties(structuredClone(node.overrides))
    addToast("Properties copied")
  }

  function handlePasteProperties() {
    const clipboard = usePropertiesClipboard.getState().properties
    if (!clipboard) {
      addToast("No properties to paste")
      return
    }
    dispatch({
      type: "set_node_properties",
      payload: {
        nodeId: node.id as VariantId,
        properties: clipboard,
        options: { mergeSubProperties: true },
      },
    })
  }

  function handleDelete() {
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

  function buildNodeActions(): MenuEntry[] {
    const isDefault = typeCheckingService.isDefaultVariant(node)
    const isUser = typeCheckingService.isUserVariant(node)
    const isInstance = typeCheckingService.isInstance(node)
    const isAuthored = typeCheckingService.isAuthored(node)

    // Sandbox roots have no catalog default and are not exported, so they skip
    // Copy JSON and Reset. Their child instances keep the standard menus below.
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

    // Selected instance (child) rows get the variant menu minus "Copy JSON",
    // which only applies to default and user variant rows.
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

    // Only the selected default, user, or authored variant row gets the full
    // action menu. Unselected rows keep the reset-only menu below.
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
      }

      if (isUser) {
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

      // Authored roots are schema-free, so reset-to-catalog does not apply.
      if (!isAuthored) {
        entries.push(buildVariantResetAction())
      }
      return entries
    }

    return []
  }

  return isEcho ? [] : buildNodeActions()
}
