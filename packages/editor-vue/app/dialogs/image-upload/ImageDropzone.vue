<script setup lang="ts">
import { computed, ref, toRef, watch, type CSSProperties } from "vue"
import Frame from "@seldon/components/frames/Frame.vue"
import Icon from "@seldon/components/primitives/Icon.vue"
import Text from "@seldon/components/primitives/Text.vue"
import { useToastStore } from "@app/toaster/toast-store"
import { useObjectURL } from "./use-object-url"
import DropzoneSurface from "./DropzoneSurface.vue"
import ImagePreview from "./ImagePreview.vue"

const props = defineProps<{ currentFile: File | null }>()
const emit = defineEmits<{ (event: "fileChange", file: File | null): void }>()

const toast = useToastStore()
const isDragging = ref(false)
const surface = ref<InstanceType<typeof DropzoneSurface> | null>(null)
const previewUrl = useObjectURL(toRef(props, "currentFile"))

function acceptImage(file: File | null): void {
  if (file && file.type.startsWith("image/")) emit("fileChange", file)
}

function onDragOver(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = true
}
function onDragLeave(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false
}
function onDrop(event: DragEvent): void {
  event.preventDefault()
  isDragging.value = false
  acceptImage(event.dataTransfer?.files?.[0] ?? null)
}
function onImageError(): void {
  emit("fileChange", null)
  toast.addToast("Invalid image file. Please select a valid image.")
}

// A cleared file resets the hidden input so the same file can be picked again.
watch(
  () => props.currentFile,
  (file) => {
    if (!file) surface.value?.resetInput()
  },
)

const dropText = computed(() =>
  isDragging.value ? "Drop image here..." : "Select or drop image…",
)

const styles: Record<string, CSSProperties> = {
  dropzone: {
    width: "100%",
    height: "100%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dragging: {
    color: "var(--sdn-swatch-primary)",
    border: "2px solid var(--sdn-swatch-primary)",
  },
  uploadIcon: { fontSize: "var(--sdn-font-size-medium)" },
  uploadText: { fontSize: "var(--sdn-font-size-small)" },
  prompt: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--sdn-gaps-tight)",
  },
}

const dropzoneStyle = computed<CSSProperties>(() => ({
  ...styles.dropzone,
  ...(isDragging.value ? styles.dragging : {}),
  ...(props.currentFile ? { position: "relative" } : {}),
}))
</script>

<template>
  <DropzoneSurface
    ref="surface"
    :surface-style="dropzoneStyle"
    @file-change="acceptImage"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <ImagePreview v-if="previewUrl" :src="previewUrl" @error="onImageError" />
    <Frame v-else wrapperElement="div" :style="styles.prompt">
      <Icon icon="material-upload" :style="styles.uploadIcon" />
      <Text :style="styles.uploadText">{{ dropText }}</Text>
    </Frame>
  </DropzoneSurface>
</template>
