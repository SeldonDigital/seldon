/**
 * Packaged icon set catalog ids. These are the suffixes used in `catalog:{id}`
 * template refs and match each stock set's `metadata.id`.
 */
export type IconSetTemplateId =
  | "seldonIcons"
  | "googleSymbols"
  | "ibmCarbon"
  | "lucideIcons"

/**
 * Catalog identity of a computed icon set. Workspace entry keys are opaque
 * strings such as `icon-set-seldonIcons-default`.
 */
export type IconSetInstanceId = IconSetTemplateId
