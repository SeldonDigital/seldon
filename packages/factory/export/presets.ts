/**
 * Framework project layouts for the export. A layout only sets where files land
 * and how the generated code references assets at runtime. It does not change
 * which framework is emitted; that is the separate platform axis.
 */
export interface OutputLayout {
  componentsFolder: string
  assetsFolder?: string
  assetPublicPath?: string
}

/**
 * Project layouts the export can target. `none` writes the self-contained
 * library at the output root; the others match a framework's expected folders,
 * placing assets in the directory that framework serves at the site root.
 */
export type FrameworkId = "none" | "vite" | "next" | "nuxt" | "sveltekit" | "astro" | "remix"

export const FRAMEWORK_IDS: FrameworkId[] = [
  "none",
  "vite",
  "next",
  "nuxt",
  "sveltekit",
  "astro",
  "remix",
]

/**
 * `none` keeps the library self-contained under `sdn/`, matching the factory
 * default. The rest split components from assets so assets land in the folder
 * each framework serves at the site root (`public/`, `static/`).
 */
export const FRAMEWORK_LAYOUTS: Record<FrameworkId, OutputLayout> = {
  none: {
    componentsFolder: "sdn",
  },
  vite: {
    componentsFolder: "src/sdn",
    assetsFolder: "public/sdn",
    assetPublicPath: "/sdn",
  },
  next: {
    componentsFolder: "components/sdn",
    assetsFolder: "public/sdn",
    assetPublicPath: "/sdn",
  },
  nuxt: {
    componentsFolder: "components/sdn",
    assetsFolder: "public/sdn",
    assetPublicPath: "/sdn",
  },
  sveltekit: {
    componentsFolder: "src/lib/sdn",
    assetsFolder: "static/sdn",
    assetPublicPath: "/sdn",
  },
  astro: {
    componentsFolder: "src/components/sdn",
    assetsFolder: "public/sdn",
    assetPublicPath: "/sdn",
  },
  remix: {
    componentsFolder: "app/components/sdn",
    assetsFolder: "public/sdn",
    assetPublicPath: "/sdn",
  },
}

/** Resolves the output folder layout for a framework. */
export function resolveOutputLayout(framework: FrameworkId): OutputLayout {
  return FRAMEWORK_LAYOUTS[framework]
}
