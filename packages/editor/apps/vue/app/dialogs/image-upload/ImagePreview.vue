<script setup lang="ts">
import Frame from "@seldon/components/frames/Frame.vue"
import Image from "@seldon/components/primitives/Image.vue"

import type { CSSProperties } from "vue"

withDefaults(defineProps<{ src: string; alt?: string }>(), { alt: "Preview" })
defineEmits<{ (event: "error"): void }>()

const wrapperStyle: CSSProperties = { position: "absolute", inset: "1rem" }
const imageStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "contain",
}
</script>

<template>
  <Frame wrapperElement="div" :style="wrapperStyle">
    <Image :src="src" :alt="alt" :style="imageStyle" @error="$emit('error')" />
  </Frame>
</template>
