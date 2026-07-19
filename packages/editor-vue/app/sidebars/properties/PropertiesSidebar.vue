<script setup lang="ts">
import { Workspace, getNodeProperties } from "@app/core"
import type { Value } from "@seldon/core"
import type { Variant, Instance } from "@seldon/core"
import { backgroundLayerForKind } from "@seldon/core/properties/values/appearance/background/background-seeds"
import { BackgroundKind } from "@seldon/core/properties/values/appearance/background/background-kind"
import { serializeValue } from "@seldon/editor/lib/properties/serialize-value"
import {
  useEditableProperties,
  type PropertyRow as NodeRow,
} from "@app/properties/use-editable-properties"
import { useThemeProperties } from "@app/properties/use-theme-properties"
import {
  useResourceProperties,
  type SelectedResource,
} from "@app/properties/use-resource-properties"
import type { EntryThemeId } from "@seldon/core/workspace/types"
import { useSelectionStore } from "@app/stores/selection-store"
import { useDispatch } from "@app/workspace/use-dispatch"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import SidebarProperties from "@seldon/components/modules/SidebarProperties.vue"
import Frame from "@seldon/components/frames/Frame.vue"
import ItemSection from "@seldon/components/elements/ItemSection.vue"
import PropertyRow from "./PropertyRow.vue"

const props = defineProps<{ workspace: Workspace }>()

const selection = useSelectionStore()
const { selectedNodeId, selectedResourceEntry } = storeToRefs(selection)
const dispatch = useDispatch()

const workspaceRef = computed(() => props.workspace)

type ControlKind = "text" | "option" | "readonly" | "link"
type RowOption = { label: string; value: string }

/** Normalizes a row control's kind onto the PropertyRow control kinds. */
function rowKind(kind: unknown): ControlKind {
  if (kind === "text") return "text"
  if (kind === "option") return "option"
  if (kind === "link") return "link"
  return "readonly"
}

/** Normalizes control options to the `{ label, value }` PropertyRow shape. */
function toOptions(options: unknown): RowOption[] {
  if (!Array.isArray(options)) return []
  return options.map((option) => {
    const record = option as { label?: string; name?: string; value: string }
    return {
      label: record.label ?? record.name ?? record.value,
      value: record.value,
    }
  })
}

// Row-control accessors. Kept in script so the template stays free of inline
// type casts, which the Vue template compiler cannot parse.
type RowControl = { kind?: unknown; value?: unknown; options?: unknown; href?: string }

function controlKind(control: RowControl): ControlKind {
  return rowKind(control.kind)
}
function controlValue(control: RowControl): string {
  return String(control.value ?? "")
}
function controlOptions(control: RowControl): RowOption[] {
  return toOptions(control.options)
}
function controlHref(control: RowControl): string | undefined {
  return control.href
}

// -- Theme editing --------------------------------------------------------

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

// -- Font/icon resource editing ------------------------------------------

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

// -- Node property editing ------------------------------------------------

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

const showEmpty = computed(
  () => !node.value && !isThemeEditing.value && !isResourceEditing.value,
)

// Commit a raw editor string through the shared `serializeValue`, coercing it
// into the correct typed value and dispatching a scoped or facet-merged update.
function commitRaw(key: string, raw: string): void {
  if (!selectedNodeId.value || !node.value) return
  const current = properties.value[key] as Value | undefined
  const value = serializeValue(
    raw,
    { currentValue: current, workspace: props.workspace },
    node.value as Variant | Instance,
    key,
  )
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
    payload: { nodeId: selectedNodeId.value, properties: { [key]: value } },
  } as never)
}

function resetProperty(row: NodeRow): void {
  if (!selectedNodeId.value) return
  dispatch({
    type: "reset_node_property",
    payload: { nodeId: selectedNodeId.value, propertyKey: row.key },
  } as never)
}

function addLayer(property: string): void {
  if (!selectedNodeId.value) return
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
</script>

<template>
  <SidebarProperties class="properties-sidebar">
    <Frame class="properties-sidebar__scroll">
      <p v-if="showEmpty" class="properties-sidebar__empty">
        Select a node or resource to edit its properties.
      </p>

      <template v-else-if="isResourceEditing">
        <template v-for="section in resourceSections" :key="section.section">
          <ItemSection
            class="properties-sidebar__section"
            :button-iconic="null"
            :form-control-combobox="{}"
            :text-label="{ children: section.label }"
            :button-iconic2="null"
            :button-iconic3="null"
          />
          <PropertyRow
            v-for="row in section.rows"
            :key="row.key"
            :label="row.label"
            :kind="controlKind(row.control)"
            :value="controlValue(row.control)"
            :options="controlOptions(row.control)"
            :href="controlHref(row.control)"
            :is-facet="row.isSubProperty"
            :dimmed="row.isDimmed"
            @commit="commitResource(row.key, $event)"
          />
        </template>
      </template>

      <template v-else-if="isThemeEditing">
        <template v-for="section in themeSections" :key="section.section">
          <ItemSection
            class="properties-sidebar__section"
            :button-iconic="null"
            :form-control-combobox="{}"
            :text-label="{ children: section.label }"
            :button-iconic2="null"
            :button-iconic3="null"
          />
          <PropertyRow
            v-for="row in section.rows"
            :key="row.key"
            :label="row.label"
            :kind="controlKind(row.control)"
            :value="controlValue(row.control)"
            :options="controlOptions(row.control)"
            :can-reset="row.isOverridden"
            :is-facet="row.isSubProperty"
            :dimmed="row.isDimmed"
            @commit="commitTheme(row.key, $event)"
            @reset="resetTheme(row.key)"
          />
        </template>
      </template>

      <template v-else>
        <template v-for="section in sections" :key="section.category">
          <ItemSection
            class="properties-sidebar__section"
            :button-iconic="null"
            :form-control-combobox="{}"
            :text-label="{ children: section.label }"
            :button-iconic2="null"
            :button-iconic3="null"
          />
          <template v-for="row in section.rows" :key="row.key">
            <PropertyRow
              v-if="!row.isHeader"
              :label="row.label"
              :kind="controlKind(row.control)"
              :value="controlValue(row.control)"
              :options="controlOptions(row.control)"
              :can-reset="row.canReset"
              :is-facet="row.isFacet"
              @commit="commitRaw(row.key, $event)"
              @reset="resetProperty(row)"
            />
            <div v-if="row.layerAdd || row.layerRemove" class="properties-sidebar__layer">
              <button
                v-if="row.layerAdd"
                type="button"
                @click="addLayer(row.layerAdd)"
              >
                + Add layer
              </button>
              <button
                v-if="row.layerRemove"
                type="button"
                @click="removeLayer(row.layerRemove.property, row.layerRemove.index)"
              >
                × Remove layer
              </button>
            </div>
          </template>
        </template>
      </template>
    </Frame>
  </SidebarProperties>
</template>

<style scoped>
.properties-sidebar {
  width: 300px;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.properties-sidebar__scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
}
.properties-sidebar__empty {
  padding: 1rem;
  font-size: 0.8rem;
  color: var(--sdn-swatch-gray, #71717a);
}
.properties-sidebar__layer {
  display: flex;
  gap: 6px;
  padding: 2px 8px 6px;
}
.properties-sidebar__layer button {
  background: transparent;
  border: 1px solid var(--sdn-swatch-gray, #3f3f46);
  color: var(--sdn-swatch-gray, #a1a1aa);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.72rem;
  cursor: pointer;
}
</style>
