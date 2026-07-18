<script setup lang="ts">
import { useToastStore } from "@lib/stores/toast-store"
import { storeToRefs } from "pinia"

const toastStore = useToastStore()
const { toasts } = storeToRefs(toastStore)
</script>

<template>
  <Teleport to="body">
    <div class="toast-stack">
      <div v-for="toast in toasts" :key="toast.id" class="toast" role="status">
        {{ toast.message }}
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-stack {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 9999;
}
.toast {
  background: #222;
  color: #fff;
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
  font-size: 0.85rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
