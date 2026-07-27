<script setup lang="ts">
import type { Workspace } from "@seldon/core/workspace/types"
import { workspaceFontCollectionService } from "@seldon/core/workspace/services"
import { buildFontFaceCss } from "@seldon/editor/lib/font-collections/build-font-face-css"
import { computed } from "vue"

const props = defineProps<{ workspace: Workspace }>()

// Self-hosts every enabled font-collection family for the canvas. The enabled
// families' woff2 files are served from `public/font-files`, so this injects a
// single `@font-face` stylesheet with no request to a font host. Mirrors the
// React `LoadEditorFonts`.
const fontFaceCss = computed(() => {
  const families = workspaceFontCollectionService.getEnabledRemoteFamilies(
    props.workspace,
  )
  return buildFontFaceCss(families)
})
</script>

<template>
  <Teleport to="head">
    <component :is="'style'" v-if="fontFaceCss">{{ fontFaceCss }}</component>
  </Teleport>
</template>
