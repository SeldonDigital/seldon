<script setup lang="ts">
import Icon from "@seldon/components/primitives/Icon.vue"
import {
  ComponentId,
  Display,
  Workspace,
  EntryNodeId,
  buildContext,
  getCssFromProperties,
  getNodeProperties,
} from "@lib/core"
import { getPropertyHtmlAttributes } from "@lib/canvas/property-html-attributes"
import { resolveCanvasTag } from "@lib/canvas/resolve-canvas-tag"
import { useSelectionStore } from "@lib/stores/selection-store"
import { collectDescendantNodeIds } from "@seldon/editor/lib/workspace/component-tree"
import {
  findComponentForNode,
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@seldon/editor/lib/workspace/node-tree"
import { buildRenderParentIndex } from "@seldon/editor/lib/workspace/render-parent-index"
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
    ? resolveCanvasTag(
        catalogComponentId.value,
        context.value!.properties,
        renderAsDiv.value,
      )
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

// A Button nested inside another Button renders as a div on the canvas to avoid
// invalid nested interactive markup. Mirrors React Node.tsx renderAsDiv.
const renderAsDiv = computed(() => {
  if (!node.value || catalogComponentId.value !== ComponentId.BUTTON) {
    return false
  }
  const board = findComponentForNode(node.value, props.workspace)
  if (!board) return false
  return collectDescendantNodeIds(board, props.nodeId).some((descendantId) => {
    const descendant = props.workspace.nodes[descendantId]
    if (!descendant) return false
    return (
      getNodeCatalogComponentId(descendant, props.workspace) ===
      ComponentId.BUTTON
    )
  })
})

const htmlAttributes = computed(() => {
  const base: Record<string, string | number | boolean> = {
    "data-canvas-node-id": props.nodeId,
    "data-selection-id": props.nodeId,
    "data-selection-kind": "node",
    "data-selection-root-id": selfPath.value,
    "data-component-id": catalogComponentId.value ?? "",
  }
  if (context.value) {
    Object.assign(base, getPropertyHtmlAttributes(context.value.properties))
  }
  return base
})

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
      v-bind="htmlAttributes"
    />

    <component
      v-else-if="tag && tag.void"
      :is="tag.tag"
      :class="className"
      v-bind="htmlAttributes"
      @click="select"
    />

    <component
      v-else-if="tag"
      :is="tag.tag"
      :class="className"
      v-bind="htmlAttributes"
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
