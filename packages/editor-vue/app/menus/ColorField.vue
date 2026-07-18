<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{ value: string }>()

const emit = defineEmits<{ (event: "commit", raw: string): void }>()

/**
 * Normalizes any CSS color string (hex, rgb, hsl, named) to `#rrggbb` using the
 * canvas parser, so the native color input can seed from the stored value.
 * Returns null for values the browser can't parse, such as theme token refs
 * (`@swatch.primary`), which keep the text field as the only editor.
 */
function cssColorToHex(input: string): string | null {
  if (typeof document === "undefined" || !input) return null
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return null
  // Seed with a sentinel so an unparseable input leaves fillStyle unchanged.
  ctx.fillStyle = "#000000"
  ctx.fillStyle = input
  const first = ctx.fillStyle
  ctx.fillStyle = "#ffffff"
  ctx.fillStyle = input
  const second = ctx.fillStyle
  if (first !== second) return null
  return typeof first === "string" && first.startsWith("#") ? first : null
}

const hex = computed(() => cssColorToHex(props.value) ?? "#000000")
const hasHex = computed(() => cssColorToHex(props.value) !== null)

function onSwatch(event: Event): void {
  emit("commit", (event.target as HTMLInputElement).value)
}

function onText(event: Event): void {
  emit("commit", (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="color-field">
    <input
      type="color"
      class="color-field__swatch"
      :class="{ 'color-field__swatch--muted': !hasHex }"
      :value="hex"
      @input="onSwatch"
    />
    <input
      type="text"
      class="color-field__text"
      :value="value"
      @change="onText"
    />
  </div>
</template>

<style scoped>
.color-field {
  display: flex;
  align-items: center;
  gap: 6px;
}
.color-field__swatch {
  flex: 0 0 auto;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
}
.color-field__swatch--muted {
  opacity: 0.4;
}
.color-field__text {
  flex: 1;
  min-width: 0;
  background: #27272a;
  border: 1px solid #3f3f46;
  border-radius: 4px;
  padding: 6px 8px;
  color: #fafafa;
  font-size: 0.8rem;
}
.color-field__text:focus {
  outline: none;
  border-color: #6366f1;
}
</style>
