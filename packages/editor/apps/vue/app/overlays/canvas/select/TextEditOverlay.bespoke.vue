<script setup lang="ts">
import { useTextEditOverlay } from "./hooks/use-text-edit-overlay"

const { fieldRef, nodeId, overlayStyle, overlayTag, showOverlay, onInput, onKeydown, onBlur } =
  useTextEditOverlay()
</script>

<template>
  <component
    v-if="showOverlay"
    :is="overlayTag"
    :key="nodeId"
    ref="fieldRef"
    contenteditable="true"
    :style="overlayStyle"
    @input="onInput"
    @keydown="onKeydown"
    @blur="onBlur"
  />
</template>
