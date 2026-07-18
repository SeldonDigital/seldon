<script setup lang="ts">
import { Workspace, EntryNodeId, getComponentSchema } from "@lib/core"
import { useDragStore } from "@lib/stores/drag-store"
import { useObjectHoverStore } from "@lib/stores/object-hover-store"
import { useSelectionStore } from "@lib/stores/selection-store"
import { useMoveObjects } from "@lib/workspace/use-move-objects"
import { typeCheckingService } from "@seldon/core/workspace/services"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@seldon/editor/lib/workspace/node-tree"
import type { Placement } from "@seldon/editor/lib/types"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

const props = defineProps<{
  workspace: Workspace
  nodeId: EntryNodeId
  rootId: string
  depth: number
}>()

const selection = useSelectionStore()
const hover = useObjectHoverStore()
const drag = useDragStore()
const { moveNodeNextTo, moveNodeInside } = useMoveObjects()
const { selectedNodeId } = storeToRefs(selection)
const { hoveredId } = storeToRefs(hover)

const dropZone = ref<Placement | null>(null)

const isInstance = computed(() =>
  node.value ? typeCheckingService.isInstance(node.value) : false,
)

function onDragStart(event: DragEvent): void {
  if (!isInstance.value) {
    event.preventDefault()
    return
  }
  drag.startDrag(props.nodeId)
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move"
    event.dataTransfer.setData("text/plain", props.nodeId)
  }
}

function onDragEnd(): void {
  drag.endDrag()
  dropZone.value = null
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
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move"
  dropZone.value = placementFromEvent(event)
}

function onDragLeave(): void {
  dropZone.value = null
}

function onDrop(event: DragEvent): void {
  const subjectId = drag.draggingNodeId
  const placement = dropZone.value
  dropZone.value = null
  if (!subjectId || subjectId === props.nodeId || !placement) return
  event.preventDefault()
  if (placement === "inside") {
    moveNodeInside(props.nodeId, subjectId)
  } else {
    moveNodeNextTo(props.nodeId, subjectId, placement)
  }
  drag.endDrag()
}

const isHovered = computed(() => hoveredId.value === props.nodeId)

function onEnter(): void {
  hover.setHoveredId(props.nodeId, "node", props.rootId)
}

function onLeave(): void {
  hover.setHoveredId(null)
}

const expanded = ref(true)

const node = computed(() => props.workspace.nodes[props.nodeId])

const catalogComponentId = computed(() =>
  node.value ? getNodeCatalogComponentId(node.value, props.workspace) : null,
)

const label = computed(() => {
  const nodeName = (node.value as { name?: string } | undefined)?.name
  if (nodeName) return nodeName
  if (!catalogComponentId.value) return props.nodeId
  try {
    return getComponentSchema(catalogComponentId.value).name
  } catch {
    return props.nodeId
  }
})

const childIds = computed(() =>
  node.value ? getNodeChildIds(node.value, props.workspace) : [],
)

const hasChildren = computed(() => childIds.value.length > 0)

const isSelected = computed(() => selectedNodeId.value === props.nodeId)

function select(): void {
  selection.selectNode(
    props.nodeId as never,
    props.nodeId === props.rootId ? null : props.rootId,
  )
}

function toggle(event: MouseEvent): void {
  event.stopPropagation()
  expanded.value = !expanded.value
}
</script>

<template>
  <div v-if="node" class="node-row-group">
    <button
      class="node-row"
      :class="{
        'node-row--selected': isSelected,
        'node-row--hovered': isHovered && !isSelected,
        'node-row--drop-before': dropZone === 'before',
        'node-row--drop-after': dropZone === 'after',
        'node-row--drop-inside': dropZone === 'inside',
      }"
      :style="{ paddingLeft: `${depth * 14 + 8}px` }"
      :data-selection-id="nodeId"
      data-selection-kind="node"
      :data-selection-root-id="rootId"
      :draggable="isInstance"
      @click="select"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <span
        v-if="hasChildren"
        class="node-row__caret"
        :class="{ 'node-row__caret--open': expanded }"
        @click="toggle"
        >▸</span
      >
      <span v-else class="node-row__caret node-row__caret--empty" />
      <span class="node-row__label">{{ label }}</span>
    </button>

    <template v-if="expanded && hasChildren">
      <NodeRow
        v-for="childId in childIds"
        :key="childId"
        :workspace="workspace"
        :node-id="childId"
        :root-id="rootId"
        :depth="depth + 1"
      />
    </template>
  </div>
</template>

<style scoped>
.node-row {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  border: none;
  background: transparent;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  color: #d4d4d8;
  text-align: left;
}
.node-row:hover {
  background: #27272a;
}
.node-row--selected {
  background: #3730a3;
  color: #fff;
}
.node-row--hovered {
  background: #27272a;
}
.node-row--drop-inside {
  outline: 1px solid #6366f1;
  outline-offset: -1px;
  background: #312e81;
}
.node-row--drop-before {
  box-shadow: inset 0 2px 0 #6366f1;
}
.node-row--drop-after {
  box-shadow: inset 0 -2px 0 #6366f1;
}
.node-row__caret {
  width: 12px;
  display: inline-block;
  transition: transform 0.1s ease;
  color: #71717a;
  font-size: 0.7rem;
}
.node-row__caret--open {
  transform: rotate(90deg);
}
.node-row__caret--empty {
  visibility: hidden;
}
.node-row__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
