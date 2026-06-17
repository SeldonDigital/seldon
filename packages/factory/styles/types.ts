import { Properties, Theme } from "@seldon/core"
import type { LayoutMode } from "@seldon/core/properties/compute"

export type StyleGenerationContext = {
  properties: Properties
  parentContext: StyleGenerationContext | null
  theme: Theme
  /**
   * Layout model the node arranges its children with. `"grid"` switches layout
   * and sizing style helpers to CSS grid. Absent means flexbox. Children read the
   * parent's mode through `parentContext.layoutMode`.
   */
  layoutMode?: LayoutMode
  /**
   * Emit `var(--sdn-...swatch-*)` references for plain swatch colors instead of
   * resolved literals. This tracks the theme stylesheet the code export writes,
   * so it is only set by the export pipeline. Live rendering leaves it unset and
   * receives concrete colors.
   */
  useThemeVariableReferences?: boolean
  /**
   * Slug of the node's theme (for example `default` or `default-red`). Names the
   * `--sdn-{slug}-` prefix the export references must match. Only the export
   * pipeline sets it, alongside `useThemeVariableReferences`.
   */
  themeSlug?: string
}
