<script setup lang="ts">
import { useHistoryStore } from "@lib/stores/history-store"
import { storeToRefs } from "pinia"

defineProps<{ title?: string }>()

const history = useHistoryStore()
const { canUndo, canRedo } = storeToRefs(history)
</script>

<template>
  <header class="topbar">
    <div class="topbar__left">
      <RouterLink to="/" class="topbar__home">Seldon · Vue</RouterLink>
      <span class="topbar__title">{{ title ?? "Workspace" }}</span>
    </div>
    <div class="topbar__right">
      <button
        class="topbar__btn"
        :disabled="!canUndo"
        @click="history.undo()"
      >
        Undo
      </button>
      <button
        class="topbar__btn"
        :disabled="!canRedo"
        @click="history.redo()"
      >
        Redo
      </button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  height: 44px;
  flex: 0 0 44px;
  background: #09090b;
  border-bottom: 1px solid #27272a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
.topbar__left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.topbar__home {
  color: #fafafa;
  font-weight: 600;
  font-size: 0.85rem;
  text-decoration: none;
}
.topbar__title {
  color: #71717a;
  font-size: 0.8rem;
}
.topbar__right {
  display: flex;
  gap: 0.5rem;
}
.topbar__btn {
  background: #27272a;
  border: 1px solid #3f3f46;
  color: #d4d4d8;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 0.75rem;
  cursor: pointer;
}
.topbar__btn:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
