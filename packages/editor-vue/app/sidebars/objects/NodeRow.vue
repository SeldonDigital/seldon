<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue"
import { storeToRefs } from "pinia"
import {
  Instance,
  MAX_REPEAT_COUNT,
  Properties,
  Variant,
  VariantId,
  resolveNodeRepeat,
} from "@seldon/core"
import type { EntryNode, EntryNodeId } from "@seldon/core/workspace/types"
import type { Workspace } from "@seldon/core/workspace/types"
import { rules } from "@seldon/core/rules/config/rules.config"
import { isDuplicateVariantLabel } from "@seldon/core/workspace/helpers/components/duplicate-variant-labels"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { typeCheckingService } from "@seldon/core/workspace/services"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import { hasNode } from "@seldon/editor/lib/workspace/workspace-accessors"
import { isValidDropTarget } from "@seldon/editor/lib/workspace/drop-validity"
import type { Placement } from "@seldon/editor/lib/types"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import Frame from "@seldon/components/frames/Frame.vue"
import MenuController from "@app/menus/MenuController.vue"
import ComboboxListbox from "@app/menus/ComboboxListbox.vue"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useDebugStore } from "@app/editor/debug-store"
import { useEditorConfigStore } from "@app/editor/editor-config-store"
import { useDragStore } from "@app/canvas/drag-store"
import { useObjectHoverStore } from "@app/workspace/object-hover-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useMoveObjects } from "@app/workspace/use-move-objects"
import { useToastStore } from "@app/toaster/toast-store"
import {
  buildDisabledRefProps,
  buildFieldStateProps,
  buildInvalidRefProps,
  buildRepeatFieldStyleProps,
  mergeStateProps,
} from "@app/sidebars/state-props"
import { useRenameInput } from "@app/sidebars/use-rename-input"
import { useObjectsExpansionStore } from "./objects-expansion-store"
import { useEditState } from "./hooks/use-edit-state"
import { useRowNodeActions } from "./hooks/use-row-node-actions"
import { useRowNodeDisplay } from "./hooks/use-row-node-display"
import { useRowActionsMenu } from "@app/menus/use-row-actions-menu"
import {
  getComponentTypeIcon,
  getNodeLabel,
  getNodeTypeColor,
} from "./hooks/row-node-label"

/** Most echo rows to list before collapsing the remainder into a summary row. */
const ECHO_ROW_LIMIT = 6

const props = withDefaults(
  defineProps<{
    workspace: Workspace
    nodeId: EntryNodeId
    rootId: string
    depth: number
    show?: boolean
    parentIsSelected?: boolean
    disableReordering?: boolean
    /** Render as a stripped repeat echo: leaf, no chevron/display/actions. */
    isEcho?: boolean
  }>(),
  {
    show: true,
    parentIsSelected: false,
    disableReordering: false,
    isEcho: false,
  },
)

const selection = useSelectionStore()
const debug = useDebugStore()
const config = useEditorConfigStore()
const drag = useDragStore()
const hover = useObjectHoverStore()
const dispatch = useDispatch()
const toast = useToastStore()
const expansion = useObjectsExpansionStore()
const {
  moveNodeNextTo,
  moveNodeInside,
  duplicateNodeInto,
  duplicateNodeNextTo,
} = useMoveObjects()

const { selectedNodeId, selectedNodeRootId } = storeToRefs(selection)
const { showNodeIds, showNodeTypes } = storeToRefs(debug)
const { showCodeNames } = storeToRefs(config)

const node = computed<EntryNode | undefined>(
  () => props.workspace.nodes[props.nodeId] as EntryNode | undefined,
)

const nodeExists = computed(() => hasNode(props.workspace, props.nodeId))
const properties = computed<Properties>(() =>
  nodeExists.value ? getNodeProperties(node.value as EntryNode, props.workspace) : {},
)

const isSelected = computed(
  () =>
    selectedNodeId.value === props.nodeId &&
    (selectedNodeRootId.value == null ||
      selectedNodeRootId.value === props.rootId),
)

const isExpanded = computed(() => expansion.isExpanded(props.nodeId))

const childIds = computed<EntryNodeId[]>(() =>
  !props.isEcho && nodeExists.value
    ? (getNodeChildIds(node.value as EntryNode, props.workspace) as EntryNodeId[])
    : [],
)
const hasChildren = computed(() => childIds.value.length > 0)

const entityType = computed(() =>
  typeCheckingService.getEntityType(node.value as EntryNode),
)
const isInstance = computed(() =>
  node.value ? typeCheckingService.isInstance(node.value) : false,
)

const labelText = computed(() =>
  getNodeLabel(node.value as EntryNode, props.workspace, {
    showNodeIds: showNodeIds.value,
    showCodeNames: showCodeNames.value,
    nodeExistsInWorkspace: nodeExists.value,
    properties: properties.value,
  }),
)
const typeIcon = computed(() => getComponentTypeIcon(node.value as EntryNode))
const nodeTypeColor = computed(() =>
  getNodeTypeColor(node.value as EntryNode, showNodeTypes.value),
)
const isDuplicateLabel = computed(
  () => nodeExists.value && isDuplicateVariantLabel(props.workspace, props.nodeId),
)

// Display model: option groups, glyph, dim/italic decoration, and selection.
const {
  displayOptionGroups,
  displayValue,
  selectDisplay,
  resolveDisplayOptionIcon,
  displayIcon,
  isDimmed,
  dimStyle,
  labelDecorationStyle,
} = useRowNodeDisplay({
  node: () => node.value as EntryNode,
  workspace: () => props.workspace,
  properties: () => properties.value,
  nodeExistsInWorkspace: () => nodeExists.value,
  isEcho: props.isEcho,
})

// Actions menu.
const actions = useRowNodeActions({
  node: () => node.value as EntryNode,
  workspace: () => props.workspace,
  isSelected: () => isSelected.value,
  isEcho: props.isEcho,
})
const {
  open: actionsOpen,
  anchor: actionsAnchor,
  close: closeActions,
  buttonIconic: actionsButton,
  icon: actionsIcon,
  menuItems: actionsItems,
  hasActions,
} = useRowActionsMenu(actions)

// Inline rename.
const { isEditingName, setEditingName } = useEditState(isSelected)

function setNodeLabel(newLabel: string): void {
  dispatch({
    type: "set_node_label",
    payload: { nodeId: props.nodeId as VariantId, label: newLabel.trim() },
  })
  setEditingName(false)
}

const { inputProps } = useRenameInput({
  label: () => labelText.value,
  editLabel: () => node.value?.label ?? "",
  isEditing: isEditingName,
  setEditing: setEditingName,
  onSubmit: setNodeLabel,
})

const itemRef = ref<{ $el?: HTMLElement } | null>(null)

watch(isEditingName, async (editing) => {
  if (!editing) return
  await nextTick()
  const input = itemRef.value?.$el?.querySelector<HTMLInputElement>(
    "input.sdn-input",
  )
  if (input) {
    input.focus()
    input.select()
  }
})

function handleDoubleClick(): void {
  if (props.isEcho) return
  if (rules.mutations.rename[entityType.value].allowed) {
    setEditingName(true)
  } else if (typeCheckingService.isInstance(node.value as EntryNode)) {
    toast.addToast("This name can only be changed at its source")
  }
}

function select(): void {
  selection.selectNode(props.nodeId as never, props.rootId)
}

function onToggle(event: MouseEvent): void {
  event.stopPropagation()
  if (!hasChildren.value) return
  if (event.altKey) {
    const ids = [props.nodeId, ...expansion.getAllDescendantNodeIds(props.nodeId)]
    if (isExpanded.value) expansion.collapseObjects(ids)
    else expansion.expandObjects(ids)
  } else {
    expansion.toggle(props.nodeId)
  }
}

function onEnter(): void {
  hover.setHoveredId(props.nodeId, "node", props.rootId)
}
function onLeave(): void {
  hover.setHoveredId(null)
}

// Display picker.
const displayOpen = ref(false)
const displayAnchor = ref<HTMLElement | null>(null)
function onDisplayClick(event: MouseEvent): void {
  event.stopPropagation()
  displayAnchor.value = event.currentTarget as HTMLElement
  displayOpen.value = !displayOpen.value
}
function onSelectDisplay(value: string): void {
  selectDisplay(value)
  displayOpen.value = false
}

// Drag-and-drop (native, functional): validity via lib, before/after/inside
// bands, and Alt to duplicate instead of move.
const dropZone = ref<Placement | null>(null)
const dropValid = ref(false)
const draggable = computed(
  () => props.show && !props.isEcho && !isEditingName.value && !props.disableReordering,
)

function onDragStart(event: DragEvent): void {
  drag.startDrag(props.nodeId)
  expansion.toggle(props.nodeId, false)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "copyMove"
    event.dataTransfer.setData("text/plain", props.nodeId)
  }
}

function onDragEnd(): void {
  drag.endDrag()
  dropZone.value = null
  dropValid.value = false
}

function placementFromEvent(event: DragEvent): Placement {
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const offset = event.clientY - rect.top
  if (offset < rect.height * 0.3) return "before"
  if (offset > rect.height * 0.7) return "after"
  return "inside"
}

function onDragOver(event: DragEvent): void {
  const subjectId = drag.draggingNodeId
  if (!subjectId || subjectId === props.nodeId) return
  const subject = props.workspace.nodes[subjectId] as EntryNode | undefined
  const target = node.value
  if (!subject || !target) return

  const placement = placementFromEvent(event)
  const valid = isValidDropTarget(target, subject, placement, props.workspace)

  dropZone.value = placement
  dropValid.value = valid
  if (!valid) return

  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = event.altKey ? "copy" : "move"
  }
}

function onDragLeave(): void {
  dropZone.value = null
  dropValid.value = false
}

function onDrop(event: DragEvent): void {
  const subjectId = drag.draggingNodeId
  const placement = dropZone.value
  const valid = dropValid.value
  dropZone.value = null
  dropValid.value = false
  if (!subjectId || subjectId === props.nodeId || !placement || !valid) return
  event.preventDefault()

  const duplicate = event.altKey
  if (placement === "inside") {
    if (duplicate) {
      const subject = props.workspace.nodes[subjectId] as Instance | Variant
      const index = getNodeChildIds(node.value as EntryNode, props.workspace).length
      duplicateNodeInto(subject, props.nodeId as never, index)
    } else {
      moveNodeInside(props.nodeId, subjectId)
    }
  } else if (duplicate) {
    duplicateNodeNextTo(props.nodeId, subjectId, placement)
  } else {
    moveNodeNextTo(props.nodeId, subjectId, placement)
  }
  drag.endDrag()
}

// Slot props for the generated ItemNode.
const disabledRef = computed(() => buildDisabledRefProps(isDimmed.value))
const dimRef = computed(() =>
  dimStyle.value ? { style: dimStyle.value } : undefined,
)
const invalidRef = computed(() => buildInvalidRefProps(isDuplicateLabel.value))
const nodeTypeStyle = computed(() =>
  nodeTypeColor.value ? { style: { color: nodeTypeColor.value } } : undefined,
)

const toggleButtonSlot = computed(() => ({
  onClick: onToggle,
  "aria-expanded": isExpanded.value,
  "aria-label": isExpanded.value ? "Collapse" : "Expand",
}))
const toggleIconSlot = computed(() =>
  mergeStateProps(
    {
      icon: "material-chevronRight",
      style: {
        transition: "transform 0.2s ease",
        ...(hasChildren.value
          ? isExpanded.value
            ? { transform: "rotate(90deg)" }
            : {}
          : { opacity: 0 }),
      },
    },
    disabledRef.value,
  ),
)
const fieldSlot = computed(() =>
  mergeStateProps(
    buildFieldStateProps({ selected: isSelected.value }),
    buildRepeatFieldStyleProps(props.isEcho),
  ),
)
const nodeIconSlot = computed(() =>
  mergeStateProps(
    { icon: typeIcon.value },
    disabledRef.value,
    dimRef.value,
    nodeTypeStyle.value,
    invalidRef.value,
  ),
)
const labelSlot = computed(() =>
  mergeStateProps(
    inputProps.value,
    labelDecorationStyle.value ? { style: labelDecorationStyle.value } : undefined,
    disabledRef.value,
    dimRef.value,
    nodeTypeStyle.value,
    invalidRef.value,
  ),
)
const displayIconSlot = computed(() => ({ icon: displayIcon.value }))
const displayButtonSlot = computed(() =>
  props.isEcho
    ? null
    : {
        type: "button",
        "aria-haspopup": "listbox",
        "aria-expanded": displayOpen.value,
        onClick: onDisplayClick,
        style: { position: "relative", zIndex: 10 },
      },
)

const rootStyle = computed(() => ({ paddingLeft: `${props.depth * 12}px` }))
const dataDisplay = computed(() =>
  properties.value && "display" in properties.value
    ? properties.value.display?.value
    : undefined,
)

// Recursive child rows: each child's index-0 row plus repeat echoes and a
// "+N more" summary row past the echo limit.
type ChildEntry =
  | { type: "node" | "echo"; key: string; childId: EntryNodeId }
  | { type: "summary"; key: string; count: number }

const childRenderList = computed<ChildEntry[]>(() => {
  const list: ChildEntry[] = []
  for (const childId of childIds.value) {
    list.push({ type: "node", key: childId, childId })
    const childNode = props.workspace.nodes[childId]
    const repeat = childNode
      ? resolveNodeRepeat(childId, props.workspace)
      : undefined
    if (!repeat || repeat.count <= 1) continue
    const total = Math.min(repeat.count, MAX_REPEAT_COUNT)
    const echoCount = total - 1
    const shown = Math.min(echoCount, ECHO_ROW_LIMIT)
    for (let i = 1; i <= shown; i++) {
      list.push({ type: "echo", key: `${childId}#echo${i}`, childId })
    }
    if (echoCount > shown) {
      list.push({ type: "summary", key: `${childId}#more`, count: echoCount - shown })
    }
  }
  return list
})

function childRootId(childId: EntryNodeId): string {
  return `${props.rootId}/${childId}`
}
</script>

<template>
  <template v-if="node && show">
    <ItemNode
      ref="itemRef"
      class="objects-node"
      :class="{
        'objects-node--drop-before': dropZone === 'before' && dropValid,
        'objects-node--drop-after': dropZone === 'after' && dropValid,
        'objects-node--drop-inside': dropZone === 'inside' && dropValid,
      }"
      :style="rootStyle"
      :aria-selected="isSelected || undefined"
      :aria-disabled="isDimmed || undefined"
      :aria-invalid="isDuplicateLabel || undefined"
      :data-testid="`object-panel-node-${nodeId}`"
      :data-nodeid="nodeId"
      :data-node-type="entityType"
      :data-display="dataDisplay"
      :data-dragging="drag.draggingNodeId === nodeId || undefined"
      :data-active="parentIsSelected || undefined"
      :draggable="draggable"
      :button-iconic="toggleButtonSlot"
      :icon="toggleIconSlot"
      :combobox-field="fieldSlot"
      :icon2="nodeIconSlot"
      :input="labelSlot"
      :button-iconic2="displayButtonSlot"
      :icon3="displayIconSlot"
      :button-iconic3="actionsButton"
      :icon4="actionsIcon"
      @click="select"
      @dblclick="handleDoubleClick"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    />

    <MenuController
      v-if="hasActions"
      :open="actionsOpen"
      :anchor="actionsAnchor"
      :items="actionsItems"
      align="end"
      @close="closeActions"
    />

    <ComboboxListbox
      v-if="!isEcho"
      :open="displayOpen"
      :anchor="displayAnchor"
      :option-groups="displayOptionGroups"
      :value="displayValue"
      :resolve-icon="resolveDisplayOptionIcon"
      @select="onSelectDisplay"
      @close="displayOpen = false"
    />

    <template v-if="isExpanded && hasChildren">
      <template v-for="entry in childRenderList" :key="entry.key">
        <NodeRow
          v-if="entry.type !== 'summary'"
          :workspace="workspace"
          :node-id="entry.childId"
          :root-id="childRootId(entry.childId)"
          :depth="depth + 1"
          :parent-is-selected="isSelected"
          :is-echo="entry.type === 'echo'"
        />
        <Frame v-else class="objects-node__summary" :style="rootStyle">
          +{{ entry.count }} more
        </Frame>
      </template>
    </template>
  </template>
</template>

<style scoped>
.objects-node--drop-inside {
  outline: 1px solid var(--sdn-swatch-active, #6366f1);
  outline-offset: -1px;
}
.objects-node--drop-before {
  box-shadow: inset 0 2px 0 var(--sdn-swatch-active, #6366f1);
}
.objects-node--drop-after {
  box-shadow: inset 0 -2px 0 var(--sdn-swatch-active, #6366f1);
}
.objects-node__summary {
  font-size: 11px;
  opacity: 0.6;
  padding: 2px 8px;
}
</style>
