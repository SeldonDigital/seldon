<script setup lang="ts">
import { Workspace, EntryNodeId, getComponentSchema } from "@lib/core"
import { useSelectionStore } from "@lib/stores/selection-store"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { storeToRefs } from "pinia"
import { computed, ref } from "vue"

const props = defineProps<{
  workspace: Workspace
  nodeId: EntryNodeId
  rootId: string
  depth: number
}>()

const selection = useSelectionStore()
const { selectedNodeId } = storeToRefs(selection)

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
      :class="{ 'node-row--selected': isSelected }"
      :style="{ paddingLeft: `${depth * 14 + 8}px` }"
      @click="select"
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
