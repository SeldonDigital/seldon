<script setup lang="ts">
import { Workspace, EntryNodeId, getComponentSchema } from "@app/core"
import { useDragStore } from "@app/stores/drag-store"
import { useObjectHoverStore } from "@app/stores/object-hover-store"
import { useSelectionStore } from "@app/stores/selection-store"
import { useMoveObjects } from "@app/workspace/use-move-objects"
import { typeCheckingService } from "@seldon/core/workspace/services"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@seldon/editor/lib/workspace/node-tree"
import type { Placement } from "@seldon/editor/lib/types"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"
import ItemNode from "@seldon/components/elements/ItemNode.vue"

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
const expanded = ref(true)

const node = computed(() => props.workspace.nodes[props.nodeId])

const isInstance = computed(() =>
  node.value ? typeCheckingService.isInstance(node.value) : false,
)

const catalogComponentId = computed(() =>
  node.value ? getNodeCatalogComponentId(node.value, props.workspace) : null,
)

const schema = computed(() => {
  if (!catalogComponentId.value) return null
  try {
    return getComponentSchema(catalogComponentId.value)
  } catch {
    return null
  }
})

const label = computed(() => {
  const nodeName = (node.value as { name?: string } | undefined)?.name
  if (nodeName) return nodeName
  return schema.value?.name ?? props.nodeId
})

const iconId = computed(() => schema.value?.icon ?? "seldon-component")

const childIds = computed(() =>
  node.value ? getNodeChildIds(node.value, props.workspace) : [],
)
const hasChildren = computed(() => childIds.value.length > 0)
const isSelected = computed(() => selectedNodeId.value === props.nodeId)
const isHovered = computed(() => hoveredId.value === props.nodeId)

function select(): void {
  selection.selectNode(
    props.nodeId as never,
    props.nodeId === props.rootId ? null : props.rootId,
  )
}

function toggle(): void {
  expanded.value = !expanded.value
}

function onEnter(): void {
  hover.setHoveredId(props.nodeId, "node", props.rootId)
}

function onLeave(): void {
  hover.setHoveredId(null)
}

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

// Slot props for the generated ItemNode. The chevron button shows only when the
// row has children; the field carries selection state; the label input shows the
// resting name; display and actions slots stay off for now.
const toggleButton = computed(() =>
  hasChildren.value ? { onClick: withStop(toggle) } : null,
)
const toggleIcon = computed(() => ({
  style: {
    transition: "transform 0.2s ease",
    transform: expanded.value ? "rotate(90deg)" : "none",
    opacity: hasChildren.value ? 1 : 0,
  },
}))
const fieldProps = computed(() => ({
  "aria-selected": isSelected.value || undefined,
}))
const nodeIconProps = computed(() => ({ icon: iconId.value }))
const labelProps = computed(() => ({ value: label.value, readonly: true }))
const rootStyle = computed(() => ({ paddingLeft: `${props.depth * 12}px` }))

function withStop(fn: () => void) {
  return (event: Event) => {
    event.stopPropagation()
    fn()
  }
}
</script>

<template>
  <template v-if="node">
    <ItemNode
      class="objects-node"
      :class="{
        'objects-node--hovered': isHovered && !isSelected,
        'objects-node--drop-before': dropZone === 'before',
        'objects-node--drop-after': dropZone === 'after',
        'objects-node--drop-inside': dropZone === 'inside',
      }"
      :style="rootStyle"
      :aria-selected="isSelected || undefined"
      :data-selection-id="nodeId"
      data-selection-kind="node"
      :data-selection-root-id="rootId"
      :draggable="isInstance"
      :button-iconic="toggleButton"
      :icon="toggleIcon"
      :combobox-field="fieldProps"
      :icon2="nodeIconProps"
      :input="labelProps"
      :button-iconic2="null"
      :button-iconic3="null"
      @click="select"
      @mouseenter="onEnter"
      @mouseleave="onLeave"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    />
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
</style>
