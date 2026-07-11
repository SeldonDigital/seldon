import { CustomReactTemplate, NativeReactPrimitive } from "../../types"

export interface CustomReactTemplateMeta {
  /** Export name used in generated imports. */
  importName: string
  /** Import path (without extension) used by generated code, relative to a component file. */
  importPath: string
  /** File stem under `components/custom` to read on export, mirrored into the output. */
  fileStem: string
  /** Native primitive whose props interface the generated component extends. */
  base: NativeReactPrimitive
}

/**
 * Metadata for bespoke React templates, keyed by `CustomReactTemplate`. This
 * module holds data only so the factory can resolve a template without pulling
 * the React component modules into its build.
 */
export const CUSTOM_REACT_TEMPLATE_META: Record<
  CustomReactTemplate,
  CustomReactTemplateMeta
> = {
  toggleSwitch: {
    importName: "SeldonToggle",
    importPath: "../custom/SeldonToggle",
    fileStem: "SeldonToggle",
    base: "HTMLInput",
  },
}
