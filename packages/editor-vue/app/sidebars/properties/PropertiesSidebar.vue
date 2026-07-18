<script setup lang="ts">
import { Workspace, ValueType, getNodeProperties } from "@lib/core"
import { useSelectionStore } from "@lib/stores/selection-store"
import { useDispatch } from "@lib/workspace/use-dispatch"
import { storeToRefs } from "pinia"
import { computed } from "vue"

const props = defineProps<{ workspace: Workspace }>()

const selection = useSelectionStore()
const { selectedNodeId } = storeToRefs(selection)
const dispatch = useDispatch()

const node = computed(() =>
  selectedNodeId.value ? props.workspace.nodes[selectedNodeId.value] : undefined,
)

const properties = computed(() =>
  node.value ? (getNodeProperties(node.value, props.workspace) ?? {}) : {},
)

type Row = { key: string; value: string }

const rows = computed<Row[]>(() =>
  Object.entries(properties.value).map(([key, entry]) => ({
    key,
    value: formatValue(entry),
  })),
)

function formatValue(entry: unknown): string {
  const value = (entry as { value?: unknown })?.value
  if (value === null || value === undefined) return "—"
  if (typeof value === "object") return JSON.stringify(value)
  return String(value)
}

const contentValue = computed(() => {
  const raw = (properties.value as Record<string, { value?: unknown }>).content
    ?.value
  return typeof raw === "string" ? raw : ""
})

const hasContent = computed(() => "content" in properties.value)

function updateContent(event: Event): void {
  if (!selectedNodeId.value) return
  const value = (event.target as HTMLInputElement).value
  dispatch({
    type: "set_node_properties",
    payload: {
      nodeId: selectedNodeId.value,
      properties: { content: { type: ValueType.EXACT, value } },
    },
  } as never)
}
</script>

<template>
  <aside class="properties-sidebar">
    <header class="properties-sidebar__title">Properties</header>

    <div v-if="!node" class="properties-sidebar__empty">
      Select a node to edit its properties.
    </div>

    <div v-else class="properties-sidebar__scroll">
      <div v-if="hasContent" class="prop-field">
        <label class="prop-field__label">content</label>
        <input
          class="prop-field__input"
          :value="contentValue"
          @input="updateContent"
        />
      </div>

      <table class="prop-table">
        <tbody>
          <tr v-for="row in rows" :key="row.key">
            <td class="prop-table__key">{{ row.key }}</td>
            <td class="prop-table__value">{{ row.value }}</td>
          </tr>
        </tbody>
      </table>
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
  padding: 0.75rem;
}
.prop-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 1rem;
}
.prop-field__label {
  font-size: 0.7rem;
  color: #a1a1aa;
}
.prop-field__input {
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fafafa;
  font-size: 0.8rem;
}
.prop-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.75rem;
}
.prop-table__key {
  color: #a1a1aa;
  padding: 3px 6px 3px 0;
  vertical-align: top;
  white-space: nowrap;
}
.prop-table__value {
  color: #e4e4e7;
  padding: 3px 0;
  word-break: break-word;
}
</style>
