import { Properties, Theme } from "@seldon/core"
import type {
  ComputeContext,
  LayoutMode,
} from "@seldon/core/properties/compute"

export type StyleGenerationContext = {
  properties: Properties
  /**
   * The same effective (pre-compute) {@link ComputeContext} the core compute engine runs against,
   * as built by `getNodeComputeContext`. Style helpers read it in `useThemeVariableReferences` mode
   * to detect a `ValueType.COMPUTED` cell (high contrast, auto fit, optical padding) and to resolve
   * its source exactly as core does, so the emitted theme variable matches the baked value. Absent
   * on live rendering, where computed values stay concrete.
   */
  computeContext?: ComputeContext
  parentContext: StyleGenerationContext | null
  theme: Theme
  /**
   * Layout model the node arranges its children with. `"grid"` switches layout
   * and sizing style helpers to CSS grid. Absent means flexbox. Children read the
   * parent's mode through `parentContext.layoutMode`.
   */
  layoutMode?: LayoutMode
  /**
   * Emit `var(--sdn-*)` theme references (swatches, scales, and typography)
   * instead of resolved literals. Every theme file defines these variables under
   * the same unprefixed names, scoped by `[data-theme]`, so the export tracks the
   * active theme stylesheet. Only the export pipeline sets it. Live rendering
   * leaves it unset and receives concrete values.
   */
  useThemeVariableReferences?: boolean
}
