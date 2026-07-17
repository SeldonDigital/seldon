import {
  buildDefaultSnippet,
  buildVariantSnippet,
} from "@lib/copy-schema/build-schema-snippet"
import { serializeSchemaSnippet } from "@lib/copy-schema/serialize-schema-ts"
import { removeNewLines } from "@lib/helpers/new-lines"
import { ComboboxOptionItem, MenuEntry, OptionIconRender } from "@lib/menus"
import { buildResetMenuEntry } from "@lib/menus/build-reset-menu-entry"
import { getComponentName } from "@seldon/factory/export/react/discovery/get-component-name"
import { CSSProperties } from "react"
import {
  Display,
  InstanceId,
  Properties,
  Value,
  ValueType,
  VariantId,
} from "@seldon/core"
import {
  PROPERTY_ICONS,
  PROPERTY_OPTION_ICONS,
} from "@seldon/core/properties/schemas/data/property-icons"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId, isComponentId } from "@seldon/core/components/constants"
import { isEmptyValue } from "@seldon/core/helpers/type-guards/value/is-empty-value"
import { IconId, iconLabels } from "@seldon/core/icon-sets"
import { rules } from "@seldon/core/rules/config/rules.config"
import { isDuplicateVariantLabel } from "@seldon/core/workspace/helpers/components/duplicate-variant-labels"
import { componentBoardSchemaVariantNodeId } from "@seldon/core/workspace/helpers/components/entry-node-ids"
import { isVariantInUse } from "@seldon/core/workspace/helpers/general/is-variant-in-use"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { isSandboxNode } from "@seldon/core/workspace/helpers/nodes/sandbox"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  nodeTraversalService,
  resolveOriginalNodeId,
  resolveSourceNodeId,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"
import { usePropertiesClipboard } from "@lib/workspace/hooks/use-properties-clipboard"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useTool } from "@lib/hooks/use-tool"
import { useSharedNodeHighlight } from "../../../tracking/hooks/use-shared-node-highlight"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import {
  getSelectionTarget,
  selectFromTarget,
} from "@lib/workspace/selection-target"
import { hasNode } from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/primitives/Icon"
import { TextLabelProps } from "@seldon/components/primitives/TextLabel"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useDraggable } from "./use-draggable"
import { useEditState } from "./use-edit-state"
import { useExpansion, useIsExpanded } from "./use-expansion"
import { resolveRowDisplayDecoration } from "./row-display-style"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { useRowToggle } from "./use-row-toggle"
import {
  useIsAncestorOfSelection,
  useIsParentOfSelection,
} from "./use-selection-relations"

// Neutral Display glyph for the row picker trigger and the Default/Inherit
// options, matching the properties Display control's property icon.
const DISPLAY_NEUTRAL_ICON: string = PROPERTY_ICONS.display

/**
 * Hook that provides all state and handlers for rendering a node row in the objects sidebar.
 * Children come from the board variant tree via `getNodeChildIds` (1:1 with saved JSON).
 */
export function useRowNode(
  node: EntryNode,
  options?: {
    rootId?: string
    show?: boolean
    parentIsSelected?: boolean
    disableReordering?: boolean
    /**
     * Render this row as a repeat echo: a stripped leaf (no chevron, no child
     * rows, no actions) with an italic label. Selection still routes to the
     * underlying node, which is index 0 of the repeat.
     */
    isEcho?: boolean
  },
) {
  const { workspace, dispatch } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { selectNode, selectBoard, selectResourceEntry, selectResourceItem } =
    useSelectionActions()
  const { showNodeIds, showNodeTypes } = useDebugMode()
  const { showCodeNames } = useEditorConfig()
  const addToast = useAddToast()
  const hasClipboardProperties = usePropertiesClipboard(
    (state) => state.properties !== null,
  )

  const { toggle, expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()

  const { isEditingName, setEditingName } = useEditState(node)

  const rootId = options?.rootId
  const selectionPath = rootId ?? node.id
  const show = options?.show ?? true
  const parentIsSelected = options?.parentIsSelected ?? false
  const disableReordering = options?.disableReordering ?? false
  const isEcho = options?.isEcho ?? false

  const nodeExistsInWorkspace = hasNode(workspace, node.id)
  const properties: Properties = nodeExistsInWorkspace
    ? getNodeProperties(node, workspace)
    : {}

  // A user variant that repeats a sibling's label reads as an error: it exports
  // under a colliding component name and blocks factory export.
  const isDuplicateLabel =
    nodeExistsInWorkspace && isDuplicateVariantLabel(workspace, node.id)
  const expandedId = node.id
  const isExpandedState = useIsExpanded(expandedId)

  // Echo rows are leaves: they never disclose children, which also renders an
  // inert, transparent chevron via useRowButton.
  const children =
    !isEcho && nodeExistsInWorkspace ? getNodeChildIds(node, workspace) : []
  const hasChildren = children.length > 0

  // A child id is shared across variant columns, so match the selected copy by
  // its path. Selections made without a path (e.g. a variant chosen
  // programmatically) fall back to id-only matching. `selectionPath` falls back
  // to the node id when the row path is not threaded into the hook.
  const isSelected = useSelectionStore(
    (state) =>
      state.selectedNodeId === node.id &&
      (state.selectedNodeRootId == null ||
        state.selectedNodeRootId === selectionPath),
  )
  const selectedNodeIsWithin = useIsAncestorOfSelection(node.id)
  const isParentOfSelectedNode = useIsParentOfSelection(node.id)
  const isNodeActive =
    parentIsSelected || isParentOfSelectedNode || selectedNodeIsWithin

  // Show Leaves / Branch / Tree lineage highlight from the View menu. Primary
  // rows change when the selection is edited; secondary rows are related
  // lineage that does not. The selected row keeps its own selection styling, so
  // it is excluded here. When the mode is "selection" the sets are empty and no
  // row lights up, which is the default.
  const sharedHighlight = useSharedNodeHighlight()
  const isPrimaryShared = !isSelected && sharedHighlight.primary.has(node.id)
  const isSecondaryShared =
    !isSelected && !isPrimaryShared && sharedHighlight.secondary.has(node.id)

  const { dragging, ref } = useDraggable({
    enable: show && !isEditingName && !disableReordering,
    target: node,
    onDragStart: () => toggle(expandedId, false),
  })

  const onToggle = useRowToggle({
    expandedId,
    isExpanded: isExpandedState,
    toggle,
    expandObjects,
    collapseObjects,
    getAllIdsForAltClick: () => {
      const descendantIds = getAllDescendantNodeIds(expandedId)
      return [expandedId, ...descendantIds]
    },
    hasChildren,
  })

  // Resolve and dispatch the selection through the same shared path the canvas
  // uses, so a sidebar click and a canvas click run identical logic.
  const onClick = useRowClick({
    activeTool,
    onSelect: (event) => {
      const target = getSelectionTarget(event.target as Element)
      if (target) {
        selectFromTarget(target, {
          selectNode,
          selectBoard,
          selectResourceEntry,
          selectResourceItem,
        })
      }
    },
  })

  const { createToggleButton, createToggleIcon } = useRowButton({
    isExpanded: isExpandedState,
    hasChildren,
    onToggle,
  })

  function handleDoubleClick() {
    if (isEcho) return
    const entityType = typeCheckingService.getEntityType(node)
    if (rules.mutations.rename[entityType].allowed) {
      setEditingName(true)
    } else if (typeCheckingService.isInstance(node)) {
      // An instance mirrors its source variant, so its name is read-only here.
      // Renaming happens at the source the user reaches through the row menu.
      addToast("This name can only be changed at its source")
    }
  }

  function getNodeLabel() {
    if (showNodeIds) {
      return `${node.id} | ${node.template}`
    }

    // Show Code Names swaps the friendly label for the export component name,
    // e.g. a "Simple" Button variant reads "ButtonSimple". Display only; the
    // node label and rename behavior are unchanged.
    if (showCodeNames && nodeExistsInWorkspace) {
      return getComponentName(node, workspace)
    }

    if (
      typeCheckingService.isInstance(node) &&
      properties?.content &&
      !isEmptyValue(properties.content)
    ) {
      return removeNewLines(properties.content.value)
    }

    if (
      typeCheckingService.isInstance(node) &&
      properties?.symbol &&
      !isEmptyValue(properties.symbol) &&
      iconLabels[properties.symbol.value as IconId]
    ) {
      return iconLabels[properties.symbol.value as IconId] + " icon"
    }

    return node.label
  }

  const icon = createToggleIcon()
  const buttonIconic = createToggleButton()

  const getComponentTypeIcon = (): IconProps["icon"] => {
    if (typeCheckingService.isVariant(node)) {
      if (typeCheckingService.isDefaultVariant(node)) {
        return "seldon-componentDefault"
      }
      if (typeCheckingService.isUserVariant(node)) {
        return "seldon-componentVariant"
      }
    }
    return "seldon-stub"
  }

  const icon2: IconProps = {
    icon: getComponentTypeIcon(),
  }

  // Show Node Types debug mode tints the row's icon and label by node type:
  // user variants use the Punch swatch and instances a lighter tint. Boards and
  // default variants keep the default color. NodeController applies this onto the icon
  // and label refs only, so borders, buttons, and the disclosure arrow are
  // unaffected.
  function getNodeTypeColor(): string | undefined {
    if (!showNodeTypes) return undefined
    if (typeCheckingService.isInstance(node)) {
      return "color-mix(in srgb, var(--sdn-swatch-punch) 80%, var(--sdn-swatch-white))"
    }
    if (typeCheckingService.isUserVariant(node)) {
      return "var(--sdn-swatch-punch)"
    }
    return undefined
  }
  const nodeTypeColor = getNodeTypeColor()

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

  const actions: MenuEntry[] = isEcho ? [] : buildNodeActions()

  const ownDisplayValue = properties?.display
  // `display` also stores an inherit value at runtime, which its narrow
  // `DisplayValue` type does not model, so read the tag as a plain string.
  const ownDisplayType: string | undefined = ownDisplayValue?.type
  const currentDisplayKey =
    !ownDisplayValue || ownDisplayType === ValueType.EMPTY
      ? "default"
      : ownDisplayType === ValueType.INHERIT
        ? "inherit"
        : String(ownDisplayValue.value)

  function setDisplay(value: Value) {
    dispatch({
      type: "set_node_properties",
      payload: {
        nodeId: node.id as VariantId,
        properties: { display: value } as Properties,
      },
    })
  }

  function resetDisplay() {
    dispatch({
      type: "reset_node_property",
      payload: { nodeId: node.id as VariantId, propertyKey: "display" },
    })
  }

  // Selecting a display value from the row's picker. "default" clears the
  // override, "inherit" stores an inherit value, and every other value stores
  // the matching option. Mirrors the Display control in the properties sidebar.
  function selectDisplay(value: string) {
    if (value === "default") {
      resetDisplay()
    } else if (value === "inherit") {
      setDisplay({ type: ValueType.INHERIT, value: null })
    } else {
      setDisplay({ type: ValueType.OPTION, value: value as Display })
    }
  }

  // The row Display picker reuses the same floating `ComboboxListbox` as the
  // properties Display control. Two sections: Default/Inherit, then the concrete
  // states. Option values match `currentDisplayKey`.
  const displayOptionGroups: ComboboxOptionItem[][] = isEcho
    ? []
    : [
        [
          { value: "default", name: "Default" },
          { value: "inherit", name: "Inherit" },
        ],
        [
          { value: Display.SHOW, name: "Show" },
          { value: Display.HIDE, name: "Hide" },
          { value: Display.STUB, name: "Stub" },
          { value: Display.MOCK, name: "Mock" },
          { value: Display.EXCLUDE, name: "Exclude" },
        ],
      ]

  // Trigger glyph and every option glyph resolve to a Material icon from the
  // shared property-icon catalog. Default and Inherit use the neutral display
  // icon, so the trigger never swaps icon families (and apparent size) between
  // states, matching the properties Display control.
  function resolveDisplayGlyph(key: string): string {
    if (key === "default" || key === "inherit") {
      return DISPLAY_NEUTRAL_ICON
    }
    return PROPERTY_OPTION_ICONS.display[key] ?? DISPLAY_NEUTRAL_ICON
  }

  function resolveDisplayOptionIcon(option?: {
    value: string
    name: string
  }): OptionIconRender {
    return {
      kind: "iconId",
      icon: resolveDisplayGlyph(option?.value ?? "default"),
    }
  }

  const displayIcon: IconProps = {
    icon: resolveDisplayGlyph(currentDisplayKey) as IconProps["icon"],
  }

  // Collects the node's own display plus every display inherited from its
  // instance-ancestor chain. The walk climbs while each parent is an instance
  // and includes the first non-instance parent, so a variant root's state still
  // reaches its instance children. Non-instance rows reflect only their own
  // display.
  function collectDisplayChainStates(): Display[] {
    if (!nodeExistsInWorkspace) {
      return []
    }

    const states: Display[] = []
    const ownDisplay = properties?.display?.value
    if (ownDisplay) states.push(ownDisplay)

    if (!typeCheckingService.isInstance(node)) {
      return states
    }

    let currentParent = nodeTraversalService.findParentNode(node.id, workspace)
    while (currentParent) {
      const parentDisplay = getNodeProperties(
        currentParent as EntryNode,
        workspace,
      )?.display?.value
      if (parentDisplay) states.push(parentDisplay)
      if (typeCheckingService.isInstance(currentParent)) {
        currentParent = nodeTraversalService.findParentNode(
          currentParent.id,
          workspace,
        )
      } else {
        break
      }
    }

    return states
  }

  // Row notation for the node's display, composed across its ancestor chain:
  // dimmed for hide/stub/mock/exclude, italic for stub/exclude. Dimmed rows read
  // as gray at 50% opacity. See `resolveRowDisplayDecoration`.
  const {
    isDimmed,
    dimStyle,
    labelStyle: labelDecorationStyle,
  } = resolveRowDisplayDecoration(collectDisplayChainStates())

  const labelStyle: CSSProperties | undefined = isEcho
    ? { ...labelDecorationStyle, fontStyle: "italic", opacity: 0.7 }
    : labelDecorationStyle

  const label = {
    children: getNodeLabel(),
    style: labelStyle,
  }

  function setNodeLabel(newLabel: string) {
    dispatch({
      type: "set_node_label",
      payload: {
        nodeId: node.id as VariantId,
        label: newLabel.trim(),
      },
    })
    setEditingName(false)
  }

  return {
    label: label as TextLabelProps,
    buttonIconic,
    icon,
    icon2,
    actions,
    displayOptionGroups,
    displayValue: currentDisplayKey,
    selectDisplay,
    resolveDisplayOptionIcon,
    displayIcon,
    onClick,
    onDoubleClick: handleDoubleClick,
    isExpanded: isExpandedState,
    isSelected,
    isNodeActive,
    isEditingName,
    setEditingName,
    setNodeLabel,
    hasChildren,
    children,
    dragging,
    ref,
    properties,
    isDimmed,
    dimStyle,
    labelDecorationStyle,
    isDuplicateLabel,
    nodeTypeColor,
    isPrimaryShared,
    isSecondaryShared,
    dataNodeType: typeCheckingService.getEntityType(node),
  }
}
