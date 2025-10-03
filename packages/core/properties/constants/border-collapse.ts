/**
 * Border collapse values for table styling.
 */
export enum BorderCollapse {
  SEPARATE = "separate",
  COLLAPSE = "collapse",
}

/**
 * Readable border collapse options for interface.
 */
export const BORDER_COLLAPSE_OPTIONS: {
  value: BorderCollapse
  name: string
}[] = [
  { value: BorderCollapse.SEPARATE, name: "Separate" },
  { value: BorderCollapse.COLLAPSE, name: "Collapse" },
]
