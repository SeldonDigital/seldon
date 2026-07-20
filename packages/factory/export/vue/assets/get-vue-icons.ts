import fs from "node:fs"

import { IconId } from "@seldon/core/icon-sets"

import {
  getIconSourcePath,
  resolveIconExport,
} from "../../react/utils/find-icon-path"
import { IconGeometry, parseIconSource } from "../../shared/parse-icon-source"
import { ExportOptions, FileToExport } from "../../types"

const DEFAULT_ICON: IconGeometry = {
  viewBox: "0 0 320 320",
  fill: "currentColor",
  body: `<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="22"><path d="m149.745 193.824-77.015 79.99 111.427 11.736M189.587 179.323 300 191.094l-77.817 80.616M184.157 285.55l5.43-106.227M300 191.094 247.27 46.22M72.73 273.814 20 128.939M97.017 48.953 20 128.939l111.427 11.737M136.854 34.45 247.27 46.22l-77.815 80.619"/></g>`,
}

/**
 * Emits the Vue icon layer: a framework-neutral geometry data module
 * (`icons/index.ts`), a runtime registry for prop-driven dynamic icons
 * (`utils/icon-registry.ts`), and the `Icon.vue` renderer that draws any icon
 * from that shared data. Geometry is parsed from the same catalog `.tsx` sources
 * the React target copies, so both editors render identical icons.
 */
export function getVueIcons(
  usedIconIds: Set<IconId>,
  options: ExportOptions,
): FileToExport[] {
  const folder = options.output.componentsFolder
  const geometry: Record<string, IconGeometry> = {
    __default__: DEFAULT_ICON,
  }

  for (const iconId of usedIconIds) {
    if (iconId === "__default__") continue
    const resolved = resolveIconExport(iconId, options.rootDirectory)
    if (!resolved) continue
    const sourcePath = getIconSourcePath(resolved, options.rootDirectory)
    let source: string | undefined
    const fromReader = options.assetReader?.readIconFile(sourcePath)
    if (fromReader) {
      source = fromReader.toString("utf8")
    } else if (fs.existsSync(sourcePath)) {
      source = fs.readFileSync(sourcePath, "utf8")
    }
    if (!source) continue
    const parsed = parseIconSource(source)
    if (parsed) geometry[iconId] = parsed
  }

  const dataModule = `export type IconGeometry = {
  viewBox: string
  fill?: string
  body: string
}

export const ICONS: Record<string, IconGeometry> = ${JSON.stringify(geometry, null, 2)}
`

  const registryModule = `import type { IconGeometry } from "../icons/index"

// Prop-driven dynamic icons (color chips, theme swatches) register geometry at
// runtime, since the factory cannot emit them as static SVG data.
const registry = new Map<string, IconGeometry>()

export function registerIcon(id: string, geometry: IconGeometry): void {
  registry.set(id, geometry)
}

export function getRegisteredIcon(id: string | undefined): IconGeometry | undefined {
  if (!id) return undefined
  return registry.get(id)
}
`

  const iconComponent = `<script setup lang="ts">
import { computed } from "vue"
import { ICONS } from "../icons/index"
import { combineClassNames } from "../utils/class-names"
import { getRegisteredIcon } from "../utils/icon-registry"

const props = defineProps<{
  className?: string
  icon?: string
}>()

const iconClassName = computed(() => combineClassNames("sdn-icon", props.className))
const geometry = computed(
  () =>
    ICONS[props.icon ?? "__default__"] ??
    getRegisteredIcon(props.icon) ??
    ICONS.__default__,
)
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :viewBox="geometry.viewBox"
    :fill="geometry.fill ?? 'currentColor'"
    height="1em"
    width="1em"
    :class="iconClassName"
    aria-hidden="true"
    v-html="geometry.body"
  />
</template>
`

  return [
    {
      path: `${folder}/icons/index.ts`.replaceAll("//", "/"),
      content: dataModule,
    },
    {
      path: `${folder}/utils/icon-registry.ts`.replaceAll("//", "/"),
      content: registryModule,
    },
    {
      path: `${folder}/primitives/Icon.vue`.replaceAll("//", "/"),
      content: iconComponent,
    },
  ]
}
