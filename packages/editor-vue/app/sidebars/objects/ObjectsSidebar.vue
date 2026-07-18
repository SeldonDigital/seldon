<script setup lang="ts">
import { Workspace } from "@lib/core"
import { useSelectionStore } from "@lib/stores/selection-store"
import { getBoardVariantRootIds } from "@lib/workspace/workspace-accessors"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import NodeRow from "./NodeRow.vue"

const props = defineProps<{ workspace: Workspace }>()

const selection = useSelectionStore()
const { selectedBoardId } = storeToRefs(selection)

type BoardEntry = {
  key: string
  name: string
  rootIds: string[]
}

const boards = computed<BoardEntry[]>(() =>
  Object.entries(props.workspace.boards).map(([key, board]) => ({
    key,
    name: (board as { name?: string }).name ?? key,
    rootIds: getBoardVariantRootIds(board),
  })),
)
</script>

<template>
  <aside class="objects-sidebar">
    <header class="objects-sidebar__title">Objects</header>
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
  padding: 0.75rem 1rem;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #71717a;
  border-bottom: 1px solid #27272a;
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
</style>
