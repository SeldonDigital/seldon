<script setup lang="ts">
import { Workspace } from "@lib/core"
import { useAddRemoveCommands } from "@lib/commands/use-add-remove-commands"
import { usePanelStore } from "@lib/stores/panel-store"
import { useSelectionStore } from "@lib/stores/selection-store"
import { getNodeChildIds } from "@seldon/editor/lib/workspace/node-tree"
import { getBoardVariantRootIds } from "@seldon/editor/lib/workspace/workspace-accessors"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import NodeRow from "./NodeRow.vue"

const props = defineProps<{ workspace: Workspace }>()

const selection = useSelectionStore()
const panel = usePanelStore()
const { selectedBoardId, selectedNodeId } = storeToRefs(selection)

const { addVariant, duplicateSelection, deleteSelection } =
  useAddRemoveCommands()

const hasSelection = computed(
  () => Boolean(selectedNodeId.value) || Boolean(selectedBoardId.value),
)

function insertIntoSelection(): void {
  const nodeId = selectedNodeId.value
  if (!nodeId) return
  const node = props.workspace.nodes[nodeId]
  const childCount = node ? getNodeChildIds(node, props.workspace).length : 0
  panel.openPanel("component", { nodeId, index: childCount })
}

type BoardEntry = {
  key: string
  name: string
  rootIds: string[]
}

const boards = computed<BoardEntry[]>(() =>
  Object.entries(props.workspace.boards)
    .filter(
      ([, board]) =>
        (board as { type?: string }).type === "component" ||
        (board as { type?: string }).type === "playground",
    )
    .map(([key, board]) => ({
      key,
      name: (board as { name?: string }).name ?? key,
      rootIds: getBoardVariantRootIds(board),
    })),
)

type ResourceKind = "theme" | "fontCollection" | "iconSet"

type ResourceEntryRow = { id: string; name: string }

type ResourceGroup = {
  key: string
  name: string
  kind: ResourceKind
  entries: ResourceEntryRow[]
}

const RESOURCE_KIND_BY_BOARD_TYPE: Record<string, ResourceKind> = {
  theme: "theme",
  "font-collection": "fontCollection",
  "icon-set": "iconSet",
}

const resourceGroups = computed<ResourceGroup[]>(() =>
  Object.entries(props.workspace.boards)
    .map(([key, board]) => {
      const type = (board as { type?: string }).type ?? ""
      const kind = RESOURCE_KIND_BY_BOARD_TYPE[type]
      if (!kind) return null
      const variants =
        (board as { variants?: Array<{ id: string }> }).variants ?? []
      return {
        key,
        name: (board as { name?: string }).name ?? key,
        kind,
        entries: variants.map((variant) => ({
          id: variant.id,
          name: entryName(kind, variant.id) ?? variant.id,
        })),
      }
    })
    .filter((group): group is ResourceGroup => group !== null),
)

function entryName(kind: ResourceKind, id: string): string | undefined {
  if (kind === "theme") {
    return (props.workspace.themes[id] as { name?: string } | undefined)?.name
  }
  const map =
    kind === "fontCollection"
      ? props.workspace["font-collections"]
      : props.workspace["icon-sets"]
  return (map?.[id] as { name?: string } | undefined)?.name
}

function isResourceSelected(id: string): boolean {
  return selection.selectedResourceEntry?.id === id
}
</script>

<template>
  <aside class="objects-sidebar">
    <header class="objects-sidebar__title">
      <span>Objects</span>
      <div class="objects-sidebar__actions">
        <button
          type="button"
          title="Add component"
          @click="panel.openPanel('add-board')"
        >
          +
        </button>
        <button
          type="button"
          title="Insert into selection"
          :disabled="!selectedNodeId"
          @click="insertIntoSelection()"
        >
          +C
        </button>
        <button
          type="button"
          title="Add variant"
          :disabled="!hasSelection"
          @click="addVariant()"
        >
          +V
        </button>
        <button
          type="button"
          title="Duplicate ( Cmd/Ctrl + D )"
          :disabled="!hasSelection"
          @click="duplicateSelection()"
        >
          ⧉
        </button>
        <button
          type="button"
          title="Delete ( Backspace )"
          :disabled="!hasSelection"
          @click="deleteSelection()"
        >
          🗑
        </button>
      </div>
    </header>
    <div class="objects-sidebar__scroll">
      <section v-for="board in boards" :key="board.key" class="objects-board">
        <button
          class="objects-board__header"
          :class="{
            'objects-board__header--selected': selectedBoardId === board.key,
          }"
          @click="selection.selectBoard(board.key)"
        >
          {{ board.name }}
        </button>
        <NodeRow
          v-for="rootId in board.rootIds"
          :key="rootId"
          :workspace="workspace"
          :node-id="rootId"
          :root-id="rootId"
          :depth="1"
        />
      </section>

      <template v-if="resourceGroups.length > 0">
        <div class="objects-sidebar__group-title">Resources</div>
        <section
          v-for="group in resourceGroups"
          :key="group.key"
          class="objects-board"
        >
          <div class="objects-board__header objects-board__header--static">
            {{ group.name }}
          </div>
          <button
            v-for="entry in group.entries"
            :key="entry.id"
            class="objects-resource-row"
            :class="{
              'objects-resource-row--selected': isResourceSelected(entry.id),
            }"
            @click="selection.selectResourceEntry(group.kind, entry.id)"
          >
            {{ entry.name }}
          </button>
        </section>
      </template>
    </div>
  </aside>
</template>

<style scoped>
.objects-sidebar {
  width: 260px;
  height: 100%;
  background: #18181b;
  border-right: 1px solid #27272a;
  display: flex;
  flex-direction: column;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.objects-sidebar__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #71717a;
  border-bottom: 1px solid #27272a;
}
.objects-sidebar__actions {
  display: flex;
  gap: 4px;
}
.objects-sidebar__actions button {
  border: 1px solid #3f3f46;
  background: #27272a;
  color: #d4d4d8;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.75rem;
  line-height: 1;
  cursor: pointer;
}
.objects-sidebar__actions button:hover:not(:disabled) {
  background: #3f3f46;
}
.objects-sidebar__actions button:disabled {
  opacity: 0.4;
  cursor: default;
}
.objects-sidebar__scroll {
  flex: 1;
  overflow: auto;
  padding: 0.5rem 0;
}
.objects-board__header {
  width: 100%;
  border: none;
  background: transparent;
  padding: 6px 8px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fafafa;
  text-align: left;
}
.objects-board__header:hover {
  background: #27272a;
}
.objects-board__header--selected {
  background: #3730a3;
  color: #fff;
}
.objects-board__header--static {
  cursor: default;
  color: #a1a1aa;
}
.objects-board__header--static:hover {
  background: transparent;
}
.objects-sidebar__group-title {
  padding: 0.75rem 0.75rem 0.25rem;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #52525b;
}
.objects-resource-row {
  display: block;
  width: 100%;
  border: none;
  background: transparent;
  padding: 5px 8px 5px 20px;
  cursor: pointer;
  font-size: 0.78rem;
  color: #d4d4d8;
  text-align: left;
}
.objects-resource-row:hover {
  background: #27272a;
}
.objects-resource-row--selected {
  background: #3730a3;
  color: #fff;
}
</style>
