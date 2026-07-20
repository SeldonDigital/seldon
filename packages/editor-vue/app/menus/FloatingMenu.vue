<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue"

const props = defineProps<{
  open: boolean
  anchor: HTMLElement | null
}>()

const emit = defineEmits<{ (event: "close"): void }>()

const menuEl = ref<HTMLElement | null>(null)
const position = ref({ top: 0, left: 0, minWidth: 0 })

function place(): void {
  if (!props.anchor) return
  const rect = props.anchor.getBoundingClientRect()
  position.value = {
    top: rect.bottom + window.scrollY + 4,
    left: rect.left + window.scrollX,
    minWidth: rect.width,
  }
}

function onDocumentPointerDown(event: PointerEvent): void {
  const target = event.target as Node
  if (menuEl.value?.contains(target)) return
  if (props.anchor?.contains(target)) return
  emit("close")
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === "Escape") emit("close")
}

watch(
  () => props.open,
  (open) => {
    if (open) place()
  },
)

onMounted(() => {
  document.addEventListener("pointerdown", onDocumentPointerDown, true)
  document.addEventListener("keydown", onKeydown)
  window.addEventListener("resize", place)
  window.addEventListener("scroll", place, true)
})

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocumentPointerDown, true)
  document.removeEventListener("keydown", onKeydown)
  window.removeEventListener("resize", place)
  window.removeEventListener("scroll", place, true)
})

const style = computed(() => ({
  top: `${position.value.top}px`,
  left: `${position.value.left}px`,
  minWidth: `${position.value.minWidth}px`,
}))
</script>

<template>
  <Teleport to="body">
    <div v-if="open" ref="menuEl" class="floating-menu" :style="style">
      <slot />
    </div>
  </Teleport>
</template>

<style scoped>
.floating-menu {
  position: absolute;
  z-index: 1000;
  background: #18181b;
  border: 1px solid #3f3f46;
  border-radius: 6px;
  padding: 4px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  color: #e4e4e7;
  font-size: 0.8rem;
  font-family:
    ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
</style>
