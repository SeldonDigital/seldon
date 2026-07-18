<script setup lang="ts">
import Icon from "@seldon/components/primitives/Icon.vue"
import {
  Display,
  Workspace,
  EntryNodeId,
  buildContext,
  getCssFromProperties,
  getNodeProperties,
} from "@lib/core"
import { resolveCanvasTag } from "@lib/canvas/resolve-canvas-tag"
import { useSelectionStore } from "@lib/stores/selection-store"
import {
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@lib/workspace/node-tree"
import { buildRenderParentIndex } from "@lib/workspace/render-parent-index"
import { computed } from "vue"

const props = defineProps<{
  workspace: Workspace
  nodeId: EntryNodeId
  rootPath?: string
  initialThemeId?: string
}>()

const selection = useSelectionStore()

function select(event: MouseEvent): void {
  event.stopPropagation()
  selection.selectNode(props.nodeId as never, props.rootPath ?? null)
}

const node = computed(() => props.workspace.nodes[props.nodeId])

const catalogComponentId = computed(() =>
  node.value ? getNodeCatalogComponentId(node.value, props.workspace) : null,
)

const nodeProperties = computed(() =>
  node.value ? getNodeProperties(node.value, props.workspace) : undefined,
)

const excluded = computed(
  () => nodeProperties.value?.display?.value === Display.EXCLUDE,
)

const selfPath = computed(() => props.rootPath ?? props.nodeId)

const styleScopeId = computed(() =>
  selfPath.value.replace(/[^a-zA-Z0-9_-]/g, "-"),
)

const className = computed(() => `node-${styleScopeId.value}`)

const context = computed(() => {
  if (!node.value) return null
  const parentIndex = buildRenderParentIndex(selfPath.value)
  return buildContext(node.value, props.workspace, parentIndex)
})

const css = computed(() => {
  if (!context.value) return ""
  try {
    return getCssFromProperties(
      context.value.properties,
      context.value,
      className.value,
    )
  } catch (error) {
    console.error("CSS generation error:", error)
    return ""
  }
})

const tag = computed(() =>
  catalogComponentId.value
    ? resolveCanvasTag(catalogComponentId.value, context.value!.properties)
    : null,
)

const content = computed(() => {
  const raw = context.value?.properties.content?.value
  return typeof raw === "string" ? raw.replace(/\r?\n/g, " ") : null
})

const iconSymbol = computed(() => {
  const raw = context.value?.properties.symbol?.value
  return typeof raw === "string" ? raw : undefined
})

const childIds = computed(() =>
  node.value ? getNodeChildIds(node.value, props.workspace) : [],
)

const themeId = computed(() => node.value?.theme || props.initialThemeId)

const visible = computed(
  () => node.value && catalogComponentId.value && !excluded.value,
)
</script>

<template>
  <template v-if="visible">
    <Teleport to="head">
      <component :is="'style'">{{ css }}</component>
    </Teleport>

    <Icon
      v-if="tag?.kind === 'icon'"
      :icon="iconSymbol"
      :className="className"
      :data-node-id="nodeId"
    />

    <component
      v-else-if="tag && tag.void"
      :is="tag.tag"
      :class="className"
      :data-node-id="nodeId"
      @click="select"
    />

    <component
      v-else-if="tag"
      :is="tag.tag"
      :class="className"
      :data-node-id="nodeId"
      @click="select"
    >
      <template v-if="content">{{ content }}</template>
      <template v-else>
        <CanvasNode
          v-for="childId in childIds"
          :key="childId"
          :workspace="workspace"
          :node-id="childId"
          :root-path="`${selfPath}/${childId}`"
          :initial-theme-id="themeId"
        />
      </template>
    </component>
  </template>
</template>
