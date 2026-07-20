<script setup lang="ts">
import { ref, type CSSProperties } from "vue"
import Frame from "@seldon/components/frames/Frame.vue"

// A generated Input does not forward a DOM ref, so the hidden file input is a
// native element here. Selection and drag events surface through emits; the
// surface style is supplied by the caller.
const props = withDefaults(
  defineProps<{ accept?: string; surfaceStyle?: CSSProperties }>(),
  { accept: "image/*" },
)

const emit = defineEmits<{
  (event: "fileChange", file: File | null): void
  (event: "dragover", value: DragEvent): void
  (event: "dragleave", value: DragEvent): void
  (event: "drop", value: DragEvent): void
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const hiddenInputStyle: CSSProperties = { display: "none" }

function openPicker(): void {
  inputRef.value?.click()
}

function resetInput(): void {
  if (inputRef.value) inputRef.value.value = ""
}

function onChange(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0] ?? null
  emit("fileChange", file)
}

defineExpose({ resetInput })
</script>

<template>
  <input
    ref="inputRef"
    type="file"
    :accept="props.accept"
    :style="hiddenInputStyle"
    @change="onChange"
  />
  <Frame
    wrapperElement="div"
    :style="props.surfaceStyle"
    @click="openPicker"
    @dragover="emit('dragover', $event)"
    @dragleave="emit('dragleave', $event)"
    @drop="emit('drop', $event)"
  >
    <slot />
  </Frame>
</template>
