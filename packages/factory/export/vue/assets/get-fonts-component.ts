import { collectRemoteFontUrls } from "../../shared/collect-remote-font-urls"

import type { ExportOptions, FileToExport } from "../../types"
import type { Workspace } from "@seldon/core"

/**
 * Builds the exported `Fonts.vue` component from the workspace's font
 * collections. Family selection matches the React `Fonts` component through
 * {@link collectRemoteFontUrls}.
 */
export function getFontsComponent(workspace: Workspace, options: ExportOptions): FileToExport {
  const hrefsLiteral = JSON.stringify(collectRemoteFontUrls(workspace, options), null, 2)
  const content = `<script setup lang="ts">
const hrefs: string[] = ${hrefsLiteral}
</script>

<template>
  <link v-for="href in hrefs" :key="href" rel="stylesheet" :href="href" />
</template>
`

  return {
    path: `${options.output.componentsFolder}/Fonts.vue`.replaceAll("//", "/"),
    content,
  }
}
