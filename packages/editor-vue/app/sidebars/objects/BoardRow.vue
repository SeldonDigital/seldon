<script setup lang="ts">
import { computed, ref } from "vue"
import { storeToRefs } from "pinia"
import type { Board as BoardType } from "@seldon/core"
import { getNodeKindIcon } from "@seldon/core/icon-registry"
import {
  isAuthoredBoard,
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import type { BoardKey, Workspace } from "@seldon/core/workspace/types"
import { getVariantRootIds } from "@seldon/editor/lib/workspace/component-tree"
import { findComponentForNode } from "@seldon/editor/lib/workspace/node-tree"
import {
  getComponentKey,
  getNode,
} from "@seldon/editor/lib/workspace/workspace-accessors"
import { buildResetMenuEntry } from "@seldon/editor/lib/menus/reset-menu"
import ItemNode from "@seldon/components/elements/ItemNode.vue"
import MenuController from "@app/menus/MenuController.vue"
import type { MenuEntry } from "@app/menus/types"
import { useSelectionStore } from "@app/workspace/selection-store"
import { useObjectHoverStore } from "@app/workspace/object-hover-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { useAutoSelectNode } from "@app/workspace/use-auto-select-node"
import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useToolStore } from "@app/editor/tool-store"
import { useToastStore } from "@app/toaster/toast-store"
import {
  buildActivatedRefProps,
  buildFieldStateProps,
  mergeStateProps,
} from "@app/sidebars/state-props"
import { useRenameInput } from "@app/sidebars/use-rename-input"
import FramerExpandable from "@app/sidebars/FramerExpandable.vue"
import { useObjectsExpansionStore } from "./objects-expansion-store"
import { useRowActionsMenu } from "@app/menus/use-row-actions-menu"
import { getBoardResourceRowConfig } from "./helpers/resource-row-config"
import NodeRow from "./NodeRow.vue"
import ResourceEntry from "./ResourceEntry.vue"

const RENAME_BOARD_BLOCKED_MESSAGE =
  "Component board names come from the catalog and can't be renamed"

const props = withDefaults(
  defineProps<{ workspace: Workspace; board: BoardType; show?: boolean }>(),
  { show: true },
)

const selection = useSelectionStore()
const hover = useObjectHoverStore()
const dispatch = useDispatch()
const { dispatchWithAutoSelect } = useAutoSelectNode()
const { removeBoard, duplicatePlayground } = useAddRemoveCommands()
const tool = useToolStore()
const toast = useToastStore()
const expansion = useObjectsExpansionStore()

const {
  selectedBoardId,
  selectedNodeId,
  selectedResourceEntry,
} = storeToRefs(selection)

const boardKey = computed(() => getComponentKey(props.board))
const variantRootIds = computed(() => getVariantRootIds(props.board))
const hasVariantChildren = computed(() => variantRootIds.value.length > 0)

const isPlayground = computed(() => isPlaygroundBoard(props.board))
const resourceRowConfig = computed(() => getBoardResourceRowConfig(props.board))

const isBoardSelected = computed(
  () =>
    selectedBoardId.value === boardKey.value &&
    selectedNodeId.value === null &&
    selectedResourceEntry.value === null,
)

const boardContainsSelectedResourceEntry = computed(
  () =>
    selectedResourceEntry.value !== null &&
    variantRootIds.value.includes(selectedResourceEntry.value.id),
)

const boardContainsSelectedNode = computed(() => {
  if (!selectedNodeId.value) return false
  const selectedNode = getNode(props.workspace, selectedNodeId.value)
  if (!selectedNode) return false
  const board = findComponentForNode(selectedNode, props.workspace)
  return board ? getComponentKey(board) === boardKey.value : false
})

const boardIsActive = computed(
  () =>
    isBoardSelected.value ||
    boardContainsSelectedNode.value ||
    boardContainsSelectedResourceEntry.value,
)
const isActivated = computed(() => boardIsActive.value && !isBoardSelected.value)

const isExpanded = computed(() => expansion.isExpanded(boardKey.value))

function onToggle(event: MouseEvent): void {
  event.stopPropagation()
  if (!hasVariantChildren.value) return
  if (event.altKey) {
    const ids = [boardKey.value]
    variantRootIds.value.forEach((variantId) => {
      ids.push(variantId)
      ids.push(...expansion.getAllDescendantNodeIds(variantId))
    })
    if (isExpanded.value) expansion.collapseObjects(ids)
    else expansion.expandObjects(ids)
  } else {
    expansion.toggle(boardKey.value)
  }
}

function select(): void {
  selection.selectBoard(boardKey.value)
}

function onEnter(): void {
  if (!boardIsActive.value) hover.setHoveredId(boardKey.value, "board")
}
function onLeave(): void {
  hover.setHoveredId(null)
}

// Inline rename (playground boards only).
const isEditingName = ref(false)
function setEditingName(value: boolean): void {
  isEditingName.value = value
}

function handleDoubleClick(): void {
  if (isPlayground.value) {
    setEditingName(true)
  } else if (isAuthoredBoard(props.board)) {
    return
  } else {
    toast.addToast(RENAME_BOARD_BLOCKED_MESSAGE)
  }
}

function setPlaygroundLabel(label: string): void {
  const trimmed = label.trim()
  setEditingName(false)
  if (!trimmed || trimmed === props.board.label) return
  dispatch({
    type: "set_playground_label",
    payload: { playgroundKey: boardKey.value, label: trimmed },
  })
}

const boardLabelText = computed(() => {
  const label = props.board.label
  return isAuthoredBoard(props.board) ? `${label} •` : label
})

const { inputProps } = useRenameInput({
  label: () => props.board.label,
  isEditing: isEditingName,
  setEditing: setEditingName,
  onSubmit: setPlaygroundLabel,
})

function onAddVariant(): void {
  if (isPlaygroundBoard(props.board)) {
    dispatchWithAutoSelect({
      type: "add_sandbox",
      payload: { playgroundKey: boardKey.value },
    })
    return
  }
  if (isThemeBoard(props.board)) {
    const defaultThemeId = props.board.variants[0]?.id
    if (!defaultThemeId) return
    dispatch({ type: "duplicate_theme", payload: { themeId: defaultThemeId } })
    tool.setActiveTool("select")
    return
  }
  if (isFontCollectionBoard(props.board)) {
    const defaultId = props.board.variants[0]?.id
    if (!defaultId) return
    dispatch({
      type: "duplicate_font_collection",
      payload: { fontCollectionId: defaultId },
    })
    tool.setActiveTool("select")
    return
  }
  if (isIconSetBoard(props.board)) {
    const defaultId = props.board.variants[0]?.id
    if (!defaultId) return
    dispatch({ type: "duplicate_icon_set", payload: { iconSetId: defaultId } })
    tool.setActiveTool("select")
    return
  }
  dispatchWithAutoSelect({
    type: "add_variant",
    payload: { boardKey: boardKey.value },
  })
}

function handleResetBoard(): void {
  if (isThemeBoard(props.board)) {
    const defaultThemeId = props.board.variants[0]?.id
    if (defaultThemeId) {
      dispatch({ type: "reset_theme_tokens", payload: { themeId: defaultThemeId } })
    }
    return
  }
  if (isFontCollectionBoard(props.board)) {
    const defaultId = props.board.variants[0]?.id
    if (defaultId) {
      dispatch({
        type: "reset_font_collection",
        payload: { fontCollectionId: defaultId },
      })
    }
    return
  }
  if (isIconSetBoard(props.board)) {
    const defaultId = props.board.variants[0]?.id
    if (defaultId) {
      dispatch({ type: "reset_icon_set", payload: { iconSetId: defaultId } })
    }
    return
  }
  const confirmed = window.confirm(
    `Reset ${props.board.label} to catalog? This restores the catalog default and variants and removes your custom variants and overrides.`,
  )
  if (!confirmed) return
  dispatch({
    type: "reset_component_to_catalog",
    payload: { boardKey: boardKey.value },
  })
}

function handleApplyToAllBoards(): void {
  const confirmed = window.confirm(
    `Apply ${props.board.label} board properties to all other component boards? This overwrites their board properties.`,
  )
  if (!confirmed) return
  dispatch({
    type: "apply_component_properties_to_all_boards",
    payload: { sourceBoardKey: boardKey.value },
  })
}

const boardActions = computed<MenuEntry[]>(() => {
  if (!boardIsActive.value) return []
  const key = boardKey.value
  const label = props.board.label

  if (isAuthoredBoard(props.board)) {
    return [
      {
        id: "add-variant",
        label: `Add ${label} Variant`,
        onSelect: () => onAddVariant(),
        testId: `objects-sidebar-board-${key}-add-variant`,
      },
      "separator",
      {
        id: "delete",
        label: `Delete ${label}`,
        onSelect: () => removeBoard(key as BoardKey),
        testId: `objects-sidebar-board-${key}-delete`,
      },
    ]
  }

  if (isPlaygroundBoard(props.board)) {
    return [
      {
        id: "duplicate",
        label: `Duplicate ${label}`,
        onSelect: () => duplicatePlayground(key as BoardKey),
        testId: `objects-sidebar-board-${key}-duplicate`,
      },
      {
        id: "add-sandbox",
        label: "Add Sandbox",
        onSelect: () => onAddVariant(),
        testId: `objects-sidebar-board-${key}-add-sandbox`,
      },
      "separator",
      {
        id: "delete",
        label: `Delete ${label}`,
        onSelect: () => removeBoard(key as BoardKey),
        testId: `objects-sidebar-board-${key}-delete`,
      },
    ]
  }

  const applyToAll: MenuEntry[] = isComponentBoard(props.board)
    ? [
        {
          id: "apply-to-all-boards",
          label: "Apply to All Boards",
          onSelect: () => handleApplyToAllBoards(),
          testId: `objects-sidebar-board-${key}-apply-to-all`,
        },
        "separator",
      ]
    : []

  return [
    ...applyToAll,
    {
      id: "add-variant",
      label: `Add ${label} Variant`,
      onSelect: () => onAddVariant(),
      testId: `objects-sidebar-board-${key}-add-variant`,
    },
    "separator",
    {
      id: "delete",
      label: `Delete ${label}`,
      onSelect: () => removeBoard(key as BoardKey),
      testId: `objects-sidebar-board-${key}-delete`,
    },
    buildResetMenuEntry({
      label: "Reset to Catalog",
      onSelect: handleResetBoard,
      testId: `objects-sidebar-board-${key}-reset`,
    }),
  ]
})

const {
  open: actionsOpen,
  anchor: actionsAnchor,
  close: closeActions,
  buttonIconic: actionsButton,
  icon: actionsIcon,
  menuItems: actionsItems,
  hasActions,
} = useRowActionsMenu(boardActions)

function boardIconId(): string {
  if (isIconSetBoard(props.board)) return getNodeKindIcon("iconSet")
  if (isThemeBoard(props.board)) return getNodeKindIcon("theme")
  if (isFontCollectionBoard(props.board)) return getNodeKindIcon("fontCollection")
  return getNodeKindIcon("component")
}

const activatedRef = computed(() => buildActivatedRefProps(isActivated.value))

const toggleButtonSlot = computed(() => ({
  onClick: onToggle,
  "aria-expanded": isExpanded.value,
  "aria-label": isExpanded.value ? "Collapse" : "Expand",
}))
const toggleIconSlot = computed(() => ({
  icon: "material-chevronRight",
  style: {
    transition: "transform 0.2s ease",
    ...(hasVariantChildren.value
      ? isExpanded.value
        ? { transform: "rotate(90deg)" }
        : {}
      : { opacity: 0 }),
  },
}))
const fieldSlot = computed(() =>
  buildFieldStateProps({ selected: isBoardSelected.value }),
)
const boardIconSlot = computed(() =>
  mergeStateProps({ icon: boardIconId() }, activatedRef.value),
)
const labelSlot = computed(() => {
  void boardLabelText.value
  return mergeStateProps(inputProps.value, activatedRef.value)
})
</script>

<template>
  <template v-if="show">
    <ItemNode
      class="objects-board-row"
      :aria-selected="isBoardSelected || undefined"
      :data-activated="isActivated || undefined"
      data-testid="objects-sidebar-board"
      :data-componentid="boardKey"
      :data-active="boardIsActive || undefined"
      :data-selection-id="boardKey"
      data-selection-kind="board"
      :button-iconic="toggleButtonSlot"
      :icon="toggleIconSlot"
      :combobox-field="fieldSlot"
      :icon2="boardIconSlot"
      :input="labelSlot"
      :button-iconic2="null"
      :button-iconic3="actionsButton"
      :icon4="actionsIcon"
      @click="select"
      @dblclick="handleDoubleClick"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
    />

    <MenuController
      v-if="hasActions"
      :open="actionsOpen"
      :anchor="actionsAnchor"
      :items="actionsItems"
      align="end"
      @close="closeActions"
    />

    <FramerExpandable :is-expanded="isExpanded">
      <template v-if="resourceRowConfig">
        <ResourceEntry
          v-for="entryId in variantRootIds"
          :key="entryId"
          :workspace="workspace"
          :config="resourceRowConfig"
          :entry-id="entryId"
          :parent-is-selected="boardIsActive"
        />
      </template>
      <template v-else>
        <NodeRow
          v-for="(variantId, index) in variantRootIds"
          :key="variantId"
          :workspace="workspace"
          :node-id="variantId"
          :root-id="variantId"
          :depth="1"
          :parent-is-selected="boardIsActive"
          :disable-reordering="index === 0"
        />
      </template>
    </FramerExpandable>
  </template>
</template>
