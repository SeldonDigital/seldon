<script setup lang="ts">
import type { Workspace } from "@lib/core"
import { getBoardVariantRootIds } from "@lib/workspace/workspace-accessors"
import { computed, ref } from "vue"
import CanvasNode from "./CanvasNode.vue"
import SelectionOverlay from "./SelectionOverlay.vue"

const props = defineProps<{ workspace: Workspace }>()

const scrollEl = ref<HTMLElement | null>(null)

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
  <div ref="scrollEl" class="canvas-scroll">
    <section v-for="board in boards" :key="board.key" class="canvas-board">
      <header class="canvas-board__label">{{ board.name }}</header>
      <div class="canvas-board__surface">
        <CanvasNode
          v-for="rootId in board.rootIds"
          :key="rootId"
          :workspace="workspace"
          :node-id="rootId"
        />
      </div>
    </section>
    <SelectionOverlay :container="scrollEl" />
  </div>
</template>

<style scoped>
.canvas-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-content: flex-start;
  background: #f4f4f5;
}
.canvas-board {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.canvas-board__label {
  font-size: 0.75rem;
  color: #71717a;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.canvas-board__surface {
  background: #fff;
  border: 1px solid #e4e4e7;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
