import type { CustomReactTemplate, NativeReactPrimitive } from "../../types"

/**
 * Metadata for one bespoke React template. `importName` is the export name used in generated
 * imports. `importPath` is the import path without extension used by generated code, relative to a
 * component file. `fileStem` is the file stem under `components/custom` read on export and mirrored
 * into the output. `base` is the native primitive whose props interface the generated component
 * extends.
 */
export interface CustomReactTemplateMeta {
  importName: string
  importPath: string
  fileStem: string
  base: NativeReactPrimitive
}

/**
 * Metadata for bespoke React templates, keyed by `CustomReactTemplate`. This
 * module holds data only so the factory can resolve a template without pulling
 * the React component modules into its build.
 */
export const CUSTOM_REACT_TEMPLATE_META: Record<CustomReactTemplate, CustomReactTemplateMeta> = {
  toggleSwitch: {
    importName: "SeldonToggle",
    importPath: "../custom/SeldonToggle",
    fileStem: "SeldonToggle",
    base: "HTMLInput",
  },
}
