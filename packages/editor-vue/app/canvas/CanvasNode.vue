<script setup lang="ts">
import Icon from "@seldon/components/primitives/Icon.vue"
import {
  ComponentId,
  Display,
  MAX_REPEAT_COUNT,
  Workspace,
  EntryNodeId,
  buildContext,
  getCssFromProperties,
  getNodeProperties,
  resolveNodeRepeat,
} from "@lib/core"
import {
  NORMAL_STATE,
  type NodeState,
} from "@seldon/core/workspace/model/node-state"
import { getPropertyHtmlAttributes } from "@lib/canvas/property-html-attributes"
import { resolveCanvasTag } from "@lib/canvas/resolve-canvas-tag"
import { useSelectionStore } from "@lib/stores/selection-store"
import { storeToRefs } from "pinia"
import { collectDescendantNodeIds } from "@seldon/editor/lib/workspace/component-tree"
import {
  findComponentForNode,
  getNodeCatalogComponentId,
  getNodeChildIds,
} from "@seldon/editor/lib/workspace/node-tree"
import { buildRenderParentIndex } from "@seldon/editor/lib/workspace/render-parent-index"
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    workspace: Workspace
    nodeId: EntryNodeId
    rootPath?: string
    initialThemeId?: string
    activeState?: NodeState
    repeatOverrides?: Record<string, string>
    isRepeatCopy?: boolean
  }>(),
  { activeState: () => NORMAL_STATE },
)

/** Per-echo override values for a repeated child's text/icon descendants. */
function buildEchoOverrides(
  data: Record<string, string[]> | undefined,
  echoIndex: number,
): Record<string, string> {
  const result: Record<string, string> = {}
  if (!data) return result
  for (const [descendantId, values] of Object.entries(data)) {
    const value = values[echoIndex - 1]
    if (value != null && value !== "") result[descendantId] = value
  }
  return result
}

type ChildRender = {
  key: string
  nodeId: string
  rootPath: string
  repeatOverrides?: Record<string, string>
  isRepeatCopy: boolean
}

const selection = useSelectionStore()
const { selectedNodeId } = storeToRefs(selection)

const isSelectedNode = computed(() => selectedNodeId.value === props.nodeId)

const node = computed(() => props.workspace.nodes[props.nodeId])

const repeatValue = computed(() => props.repeatOverrides?.[props.nodeId])

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
  return buildContext(
    node.value,
    props.workspace,
    parentIndex,
    props.activeState,
  )
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

const isIcon = computed(() => catalogComponentId.value === ComponentId.ICON)

const content = computed(() => {
  if (repeatValue.value != null && !isIcon.value) {
    return repeatValue.value.replace(/\r?\n/g, " ")
  }
  const raw = context.value?.properties.content?.value
  return typeof raw === "string" ? raw.replace(/\r?\n/g, " ") : null
})

const iconSymbol = computed(() => {
  if (repeatValue.value != null && isIcon.value) return repeatValue.value
  const raw = context.value?.properties.symbol?.value
  return typeof raw === "string" ? raw : undefined
})

// Children with repeat echoes expanded: a repeated child renders `count` times,
// echoes (index > 0) carry per-index text/icon overrides and a dashed outline.
const childRenders = computed<ChildRender[]>(() => {
  if (!node.value) return []
  const result: ChildRender[] = []
  for (const childId of getNodeChildIds(node.value, props.workspace)) {
    const childNode = props.workspace.nodes[childId]
    const childRepeat = childNode
      ? resolveNodeRepeat(childId, props.workspace)
      : undefined
    const childRootPath = `${selfPath.value}/${childId}`

    if (!childRepeat || childRepeat.count <= 1) {
      result.push({
        key: childId,
        nodeId: childId,
        rootPath: childRootPath,
        repeatOverrides: props.repeatOverrides,
        isRepeatCopy: false,
      })
      continue
    }

    const total = Math.min(childRepeat.count, MAX_REPEAT_COUNT)
    for (let echoIndex = 0; echoIndex < total; echoIndex++) {
      const isEcho = echoIndex > 0
      result.push({
        key: isEcho ? `${childId}#echo${echoIndex}` : childId,
        nodeId: childId,
        rootPath: childRootPath,
        repeatOverrides: isEcho
          ? { ...props.repeatOverrides, ...buildEchoOverrides(childRepeat.data, echoIndex) }
          : props.repeatOverrides,
        isRepeatCopy: isEcho,
      })
    }
  }
  return result
})

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

// Dashed outline marking repeat echo copies, shown only while the repeated
// child (index 0) is selected. Editor preview only. Mirrors React Node.tsx.
const styleOverrides = computed<Record<string, string> | undefined>(() => {
  if (props.isRepeatCopy && isSelectedNode.value) {
    return {
      outline: "1px dashed var(--sdn-swatch-primary)",
      outlineOffset: "1px",
    }
  }
  return undefined
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
      :style="styleOverrides"
      v-bind="htmlAttributes"
    />

    <component
      v-else-if="tag && tag.void"
      :is="tag.tag"
      :class="className"
      :style="styleOverrides"
      v-bind="htmlAttributes"
    />

    <component
      v-else-if="tag"
      :is="tag.tag"
      :class="className"
      :style="styleOverrides"
      v-bind="htmlAttributes"
    >
      <template v-if="content">{{ content }}</template>
      <template v-else>
        <CanvasNode
          v-for="child in childRenders"
          :key="child.key"
          :workspace="workspace"
          :node-id="child.nodeId"
          :root-path="child.rootPath"
          :initial-theme-id="themeId"
          :active-state="activeState"
          :repeat-overrides="child.repeatOverrides"
          :is-repeat-copy="child.isRepeatCopy"
        />
      </template>
    </component>
  </template>
</template>
