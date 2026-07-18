<script setup lang="ts">
import { Workspace, getNodeProperties } from "@lib/core"
import type { Value } from "@seldon/core"
import type { Variant, Instance } from "@seldon/core"
import { backgroundLayerForKind } from "@seldon/core/properties/values/appearance/background/background-seeds"
import { BackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"
import { serializeValue } from "@seldon/editor/lib/properties/serialize-value"
import {
  useEditableProperties,
  type PropertyRow,
} from "@lib/properties/use-editable-properties"
import { useThemeProperties } from "@lib/properties/use-theme-properties"
import {
  useResourceProperties,
  type SelectedResource,
} from "@lib/properties/use-resource-properties"
import type { ThemeTokenRow } from "@seldon/editor/lib/themes/build-theme-token-rows"
import type { ResourceRow } from "@seldon/editor/lib/resources/resource-rows"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { useSelectionStore } from "@lib/stores/selection-store"
import { useDispatch } from "@lib/workspace/use-dispatch"
import { storeToRefs } from "pinia"
import { computed } from "vue"

const props = defineProps<{ workspace: Workspace }>()

const selection = useSelectionStore()
const { selectedNodeId, selectedResourceEntry } = storeToRefs(selection)
const dispatch = useDispatch()

const workspaceRef = computed(() => props.workspace)

const themeEntryId = computed<EntryThemeId | null>(() => {
  const entry = selectedResourceEntry.value
  if (!entry || entry.kind !== "theme") return null
  const id = entry.id as EntryThemeId
  return props.workspace.themes[id] ? id : null
})

const isThemeEditing = computed(() => Boolean(themeEntryId.value))

const {
  sections: themeSections,
  commit: commitTheme,
  reset: resetTheme,
} = useThemeProperties(themeEntryId, workspaceRef)

function onThemeText(row: ThemeTokenRow, event: Event): void {
  commitTheme(row.key, (event.target as HTMLInputElement).value)
}

function onThemeOption(row: ThemeTokenRow, event: Event): void {
  if (row.control.kind !== "option") return
  const index = Number((event.target as HTMLSelectElement).value)
  const option = row.control.options[index]
  if (!option) return
  commitTheme(row.key, String(option.value))
}

function themeOptionIndex(row: ThemeTokenRow): number {
  if (row.control.kind !== "option") return -1
  return row.control.options.findIndex(
    (option) => String(option.value) === String(row.control.value),
  )
}

const selectedResource = computed<SelectedResource>(() => {
  const entry = selectedResourceEntry.value
  if (!entry) return null
  if (entry.kind === "fontCollection" || entry.kind === "iconSet") {
    return { kind: entry.kind, id: entry.id }
  }
  return null
})

const isResourceEditing = computed(() => selectedResource.value !== null)

const { sections: resourceSections, commit: commitResource } =
  useResourceProperties(selectedResource, workspaceRef)

function onResourceOption(row: ResourceRow, event: Event): void {
  if (row.control.kind !== "option") return
  const index = Number((event.target as HTMLSelectElement).value)
  const option = row.control.options[index]
  if (!option) return
  commitResource(row.key, option.value)
}

function resourceOptionIndex(row: ResourceRow): number {
  if (row.control.kind !== "option") return -1
  return row.control.options.findIndex(
    (option) => option.value === row.control.value,
  )
}

const node = computed(() =>
  selectedNodeId.value ? props.workspace.nodes[selectedNodeId.value] : undefined,
)

const properties = computed<Record<string, unknown>>(() =>
  node.value ? (getNodeProperties(node.value, props.workspace) ?? {}) : {},
)

const overrideKeys = computed<Set<string>>(() => {
  const overrides = (node.value as { overrides?: Record<string, unknown> })
    ?.overrides
  return new Set(overrides ? Object.keys(overrides) : [])
})

const sections = useEditableProperties(properties, workspaceRef, overrideKeys)

// Commit a raw editor string through the shared `serializeValue`, which coerces
// it into the correct typed value (unit dimensions, theme keys, colors, presets,
// booleans). An empty string serializes to EMPTY, clearing the override. A
// facet key (e.g. `margin.top`) writes a partial compound merged by facet.
function commitRaw(key: string, raw: string): void {
  if (!selectedNodeId.value || !node.value) return
  const current = properties.value[key] as Value | undefined
  const value = serializeValue(
    raw,
    { currentValue: current, workspace: props.workspace },
    node.value as Variant | Instance,
    key,
  )
  // Layered paint facet: `root.<index>.<facet>`. Pad lower slots with empty
  // bags so the slot-merge writes only this layer, matching React.
  const layered = key.match(/^([a-zA-Z]+)\.(\d+)\.([a-zA-Z]+)$/)
  if (layered) {
    const [, root, indexStr, facet] = layered
    const index = Number(indexStr)
    const layers = Array.from({ length: index + 1 }, (_, i) =>
      i === index ? { [facet]: value } : {},
    )
    dispatch({
      type: "set_node_properties",
      payload: {
        nodeId: selectedNodeId.value,
        properties: { [root]: layers },
        options: { mergeSubProperties: true },
      },
    } as never)
    return
  }

  const dotIndex = key.indexOf(".")
  if (dotIndex !== -1) {
    const root = key.slice(0, dotIndex)
    const facet = key.slice(dotIndex + 1)
    dispatch({
      type: "set_node_properties",
      payload: {
        nodeId: selectedNodeId.value,
        properties: { [root]: { [facet]: value } },
        options: { mergeSubProperties: true },
      },
    } as never)
    return
  }
  dispatch({
    type: "set_node_properties",
    payload: {
      nodeId: selectedNodeId.value,
      properties: { [key]: value },
    },
  } as never)
}

function resetProperty(row: PropertyRow): void {
  if (!selectedNodeId.value) return
  dispatch({
    type: "reset_node_property",
    payload: { nodeId: selectedNodeId.value, propertyKey: row.key },
  } as never)
}

function addLayer(property: string): void {
  if (!selectedNodeId.value) return
  // Background layers seed a color fill so they render and expose facets; other
  // stacks (shadow) start from the reducer's empty-bag default.
  const seed =
    property === "background"
      ? (backgroundLayerForKind(BackgroundKind.COLOR) ?? undefined)
      : undefined
  dispatch({
    type: "add_node_layer",
    payload: { nodeId: selectedNodeId.value, property, seed },
  } as never)
}

function removeLayer(property: string, index: number): void {
  if (!selectedNodeId.value) return
  dispatch({
    type: "remove_node_layer",
    payload: { nodeId: selectedNodeId.value, property, index },
  } as never)
}

function onText(row: PropertyRow, event: Event): void {
  commitRaw(row.key, (event.target as HTMLInputElement).value)
}

function onOption(row: PropertyRow, event: Event): void {
  if (row.control.kind !== "option") return
  const index = Number((event.target as HTMLSelectElement).value)
  const option = row.control.options[index]
  if (!option) return
  commitRaw(row.key, String(option.value))
}

function optionIndex(row: PropertyRow): number {
  if (row.control.kind !== "option") return -1
  return row.control.options.findIndex(
    (option) => option.value === row.control.value,
  )
}
</script>

<template>
  <aside class="properties-sidebar">
    <header class="properties-sidebar__title">Properties</header>

    <div
      v-if="!node && !isThemeEditing && !isResourceEditing"
      class="properties-sidebar__empty"
    >
      Select a node or resource to edit its properties.
    </div>

    <div v-else-if="isResourceEditing" class="properties-sidebar__scroll">
      <section
        v-for="section in resourceSections"
        :key="section.section"
        class="prop-section"
      >
        <h4 class="prop-section__title">{{ section.label }}</h4>
        <div
          v-for="row in section.rows"
          :key="row.key"
          class="prop-field"
          :class="{
            'prop-field--facet': row.isSubProperty,
            'prop-field--dimmed': row.isDimmed,
          }"
        >
          <div class="prop-field__labelrow">
            <label class="prop-field__label">{{ row.label }}</label>
          </div>

          <select
            v-if="row.control.kind === 'option'"
            class="prop-field__input"
            :value="resourceOptionIndex(row)"
            @change="onResourceOption(row, $event)"
          >
            <option value="-1" disabled>—</option>
            <option
              v-for="(option, index) in row.control.options"
              :key="index"
              :value="index"
            >
              {{ option.label }}
            </option>
          </select>

          <a
            v-else-if="row.control.kind === 'link'"
            class="prop-field__link"
            :href="row.control.href"
            target="_blank"
            rel="noreferrer"
            >{{ row.control.value }}</a
          >

          <span v-else class="prop-field__readonly">{{
            row.control.value
          }}</span>
        </div>
      </section>
    </div>

    <div v-else-if="isThemeEditing" class="properties-sidebar__scroll">
      <section
        v-for="section in themeSections"
        :key="section.section"
        class="prop-section"
      >
        <h4 class="prop-section__title">{{ section.label }}</h4>
        <div
          v-for="row in section.rows"
          :key="row.key"
          class="prop-field"
          :class="{
            'prop-field--facet': row.isSubProperty,
            'prop-field--dimmed': row.isDimmed,
          }"
        >
          <div class="prop-field__labelrow">
            <label class="prop-field__label">
              <span
                v-if="row.iconColorValue"
                class="prop-field__swatch"
                :style="{ background: row.iconColorValue }"
              />
              {{ row.label }}
            </label>
            <button
              v-if="row.isOverridden"
              type="button"
              class="prop-field__reset"
              title="Reset to default"
              @click="resetTheme(row.key)"
            >
              ↺
            </button>
          </div>

          <input
            v-if="row.control.kind === 'text'"
            class="prop-field__input"
            :value="row.control.value"
            @change="onThemeText(row, $event)"
          />

          <select
            v-else-if="row.control.kind === 'option'"
            class="prop-field__input"
            :value="themeOptionIndex(row)"
            @change="onThemeOption(row, $event)"
          >
            <option value="-1" disabled>—</option>
            <option
              v-for="(option, index) in row.control.options"
              :key="index"
              :value="index"
            >
              {{ option.label }}
            </option>
          </select>

          <span
            v-else-if="!row.isLookParent"
            class="prop-field__readonly"
            >{{ row.control.value }}</span
          >
        </div>
      </section>
    </div>

    <div v-else class="properties-sidebar__scroll">
      <section
        v-for="section in sections"
        :key="section.category"
        class="prop-section"
      >
        <h4 class="prop-section__title">{{ section.label }}</h4>
        <div
          v-for="row in section.rows"
          :key="row.key"
          class="prop-field"
          :class="{ 'prop-field--facet': row.isFacet }"
        >
          <div class="prop-field__labelrow">
            <label class="prop-field__label">{{ row.label }}</label>
            <button
              v-if="row.layerAdd"
              type="button"
              class="prop-field__reset"
              title="Add layer"
              @click="addLayer(row.layerAdd)"
            >
              +
            </button>
            <button
              v-if="row.layerRemove"
              type="button"
              class="prop-field__reset"
              title="Remove layer"
              @click="removeLayer(row.layerRemove.property, row.layerRemove.index)"
            >
              ×
            </button>
            <button
              v-if="row.canReset"
              type="button"
              class="prop-field__reset"
              title="Reset to default"
              @click="resetProperty(row)"
            >
              ↺
            </button>
          </div>

          <input
            v-if="row.control.kind === 'text'"
            class="prop-field__input"
            :value="row.control.value"
            @change="onText(row, $event)"
          />

          <select
            v-else-if="row.control.kind === 'option'"
            class="prop-field__input"
            :value="optionIndex(row)"
            @change="onOption(row, $event)"
          >
            <option value="-1" disabled>—</option>
            <option
              v-for="(option, index) in row.control.options"
              :key="index"
              :value="index"
            >
              {{ option.label }}
            </option>
          </select>

          <span
            v-else-if="!row.isHeader"
            class="prop-field__readonly"
            >{{ row.control.value }}</span
          >
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.properties-sidebar {
  width: 300px;
  height: 100%;
  background: #18181b;
  border-left: 1px solid #27272a;
  display: flex;
  flex-direction: column;
  color: #d4d4d8;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.properties-sidebar__title {
  padding: 0.75rem 1rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #71717a;
  border-bottom: 1px solid #27272a;
}
.properties-sidebar__empty {
  padding: 1rem;
  font-size: 0.8rem;
  color: #71717a;
}
.properties-sidebar__scroll {
  flex: 1;
  overflow: auto;
  padding: 0.5rem 0.75rem 1rem;
}
.prop-section {
  margin-top: 0.75rem;
}
.prop-section__title {
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #71717a;
}
.prop-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 0.6rem;
}
.prop-field--facet {
  padding-left: 0.75rem;
  margin-bottom: 0.4rem;
}
.prop-field__labelrow {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.prop-field__label {
  font-size: 0.7rem;
  color: #a1a1aa;
}
.prop-field__reset {
  border: none;
  background: transparent;
  color: #71717a;
  cursor: pointer;
  font-size: 0.8rem;
  line-height: 1;
  padding: 0 2px;
}
.prop-field__reset:hover {
  color: #e4e4e7;
}
.prop-field__input {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fafafa;
  font-size: 0.8rem;
}
.prop-field__input:focus {
  outline: none;
  border-color: #6366f1;
}
.prop-field__checkbox {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #e4e4e7;
}
.prop-field__readonly {
  font-size: 0.75rem;
  color: #71717a;
  word-break: break-word;
}
.prop-field--dimmed {
  opacity: 0.55;
}
.prop-field__swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-right: 4px;
  vertical-align: middle;
}
.prop-field__link {
  font-size: 0.75rem;
  color: #a5b4fc;
}
</style>
