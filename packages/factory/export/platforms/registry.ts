import { Workspace } from "@seldon/core"

import { exportReact } from "../react/export-react"
import type {
  ExportOptions,
  ExportStyleId,
  FileToExport,
  PlatformId,
  PlatformStatus,
} from "../types"
import { exportVue } from "../vue/export-vue"

/**
 * A single export platform. `export` is present only when the platform can
 * generate output today. Planned platforms omit it and surface a clear error if
 * invoked, while still appearing in the platform picker.
 */
export interface PlatformDefinition {
  id: PlatformId
  label: string
  status: PlatformStatus
  styles: ExportStyleId
  export?: (
    workspace: Workspace,
    options: ExportOptions,
  ) => Promise<FileToExport[]>
}

/**
 * Registry of every export platform, keyed by id. To add a platform: implement
 * its generator, add its `PlatformId` in `../types.ts`, then register it here
 * with `status: "available"` and an `export` function.
 */
export const PLATFORMS: Record<PlatformId, PlatformDefinition> = {
  react: {
    id: "react",
    label: "React",
    status: "available",
    styles: "css-properties",
    export: exportReact,
  },
  swift: {
    id: "swift",
    label: "Swift",
    status: "planned",
    styles: "css-properties",
  },
  vue: {
    id: "vue",
    label: "Vue",
    status: "available",
    styles: "css-properties",
    export: exportVue,
  },
  svelte: {
    id: "svelte",
    label: "Svelte",
    status: "planned",
    styles: "css-properties",
  },
}

/** Ordered list of platforms for menus and pickers. */
export const PLATFORM_LIST: PlatformDefinition[] = Object.values(PLATFORMS)

/** Look up a platform definition by id. */
export function getPlatform(id: PlatformId): PlatformDefinition | undefined {
  return PLATFORMS[id]
}
