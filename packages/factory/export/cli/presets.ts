/**
 * Project-layout presets for the export CLI. A preset only sets where files land
 * and how the generated code references assets. It does not change which
 * framework is emitted; that is the separate `--platform` axis.
 */
export interface ExportPreset {
  /** Folder for generated component source, relative to the output root. */
  componentsFolder: string
  /** Folder for emitted asset files, relative to the output root. */
  assetsFolder?: string
  /** URL prefix the generated code uses to reference assets at runtime. */
  assetPublicPath?: string
}

export type ExportPresetId = "plain" | "vite" | "next"

/**
 * `plain` keeps the library self-contained under `seldon/`, matching the
 * factory default. `vite` and `next` split components from assets so assets sit
 * in the folder each dev server serves at the site root (`public/`).
 */
export const EXPORT_PRESETS: Record<ExportPresetId, ExportPreset> = {
  plain: {
    componentsFolder: "seldon",
  },
  vite: {
    componentsFolder: "src/seldon",
    assetsFolder: "public/seldon",
    assetPublicPath: "/seldon",
  },
  next: {
    componentsFolder: "components/seldon",
    assetsFolder: "public/seldon",
    assetPublicPath: "/seldon",
  },
}

export const EXPORT_PRESET_IDS = Object.keys(EXPORT_PRESETS) as ExportPresetId[]
