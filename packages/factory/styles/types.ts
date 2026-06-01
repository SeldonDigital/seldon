import { Properties, Theme } from "@seldon/core"

export type StyleGenerationContext = {
  properties: Properties
  parentContext: StyleGenerationContext | null
  theme: Theme
  /**
   * Emit `var(--sdn-...swatch-*)` references for plain swatch colors instead of
   * resolved literals. This tracks the theme stylesheet the code export writes,
   * so it is only set by the export pipeline. Live rendering leaves it unset and
   * receives concrete colors.
   */
  useThemeVariableReferences?: boolean
}
