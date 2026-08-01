<script setup lang="ts">
import {
  ComponentId,
  Display,
  EntryNodeId,
  Workspace,
  buildContext,
  getCssFromProperties,
  getNodeProperties,
} from "@app/core"
import Icon from "@seldon/components/primitives/Icon.vue"
import { buildChildRenders } from "@seldon/editor/lib/canvas/node-render/build-child-renders"
import { resolveRenderAsDiv } from "@seldon/editor/lib/canvas/node-render/resolve-render-as-div"
import { buildCanvasSelectionAttributes } from "@seldon/editor/lib/canvas/node-render/selection-attributes"
import { getPropertyHtmlAttributes } from "@seldon/editor/lib/canvas/property-html-attributes"
import { resolveCanvasTag } from "@seldon/editor/lib/canvas/resolve-canvas-tag"
import { getNodeCatalogComponentId } from "@seldon/editor/lib/workspace/node-tree"
import { buildRenderParentIndex } from "@seldon/editor/lib/workspace/render-parent-index"
import { computed } from "vue"

import { NORMAL_STATE } from "@seldon/core/workspace/model/node-state"

import type { NodeState } from "@seldon/core/workspace/model/node-state"
import type { ChildRender } from "@seldon/editor/lib/canvas/node-render/build-child-renders"

const props = withDefaults(
  defineProps<{
    workspace: Workspace
    nodeId: EntryNodeId
    rootPath?: string
    initialThemeId?: string
    activeState?: NodeState
    repeatOverrides?: Record<string, string>
  }>(),
  { activeState: () => NORMAL_STATE },
)

const node = computed(() => props.workspace.nodes[props.nodeId])

const repeatValue = computed(() => props.repeatOverrides?.[props.nodeId])

const catalogComponentId = computed(() =>
  node.value ? getNodeCatalogComponentId(node.value, props.workspace) : null,
)

const nodeProperties = computed(() =>
  node.value ? getNodeProperties(node.value, props.workspace) : undefined,
)

const excluded = computed(() => nodeProperties.value?.display?.value === Display.EXCLUDE)

const selfPath = computed(() => props.rootPath ?? props.nodeId)

const styleScopeId = computed(() => selfPath.value.replace(/[^a-zA-Z0-9_-]/g, "-"))

const className = computed(() => `node-${styleScopeId.value}`)

const context = computed(() => {
  if (!node.value) return null
  const parentIndex = buildRenderParentIndex(selfPath.value)
  return buildContext(node.value, props.workspace, parentIndex, props.activeState)
})

const css = computed(() => {
  if (!context.value) return ""
  try {
    return getCssFromProperties(context.value.properties, context.value, className.value)
  } catch (error) {
    console.error("CSS generation error:", error)
    return ""
  }
})

const tag = computed(() =>
  catalogComponentId.value
    ? resolveCanvasTag(catalogComponentId.value, context.value!.properties, renderAsDiv.value)
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
const childRenders = computed<ChildRender[]>(() =>
  node.value
    ? buildChildRenders(node.value, props.workspace, selfPath.value, props.repeatOverrides)
    : [],
)

// A Button nested inside another Button renders as a div on the canvas to avoid
// invalid nested interactive markup.
const renderAsDiv = computed(() =>
  node.value
    ? resolveRenderAsDiv(node.value, props.workspace, props.nodeId, catalogComponentId.value)
    : false,
)

const htmlAttributes = computed(() => {
  const base: Record<string, string | number | boolean> = {
    ...buildCanvasSelectionAttributes({
      nodeId: props.nodeId,
      selfPath: selfPath.value,
      catalogComponentId: catalogComponentId.value,
    }),
  }
  if (context.value) {
    Object.assign(base, getPropertyHtmlAttributes(context.value.properties))
  }
  return base
})

const themeId = computed(() => node.value?.theme || props.initialThemeId)

const visible = computed(() => node.value && catalogComponentId.value && !excluded.value)
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
    />

    <component v-else-if="tag" :is="tag.tag" :class="className" v-bind="htmlAttributes">
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
        />
      </template>
    </component>
  </template>
</template>
