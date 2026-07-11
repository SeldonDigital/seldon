import { ComponentType } from "react"

import { CustomReactTemplate } from "../../types"
import { SeldonToggle } from "./SeldonToggle"

export * from "./registry"
export { SeldonToggle } from "./SeldonToggle"

/**
 * Maps each bespoke template id to the React component the canvas renders. Kept
 * separate from `CUSTOM_REACT_TEMPLATE_META` so consumers that only need the
 * emit metadata (the factory) do not import the component modules.
 */
export const CUSTOM_REACT_TEMPLATE_COMPONENTS: Record<
  CustomReactTemplate,
  ComponentType<Record<string, unknown>>
> = {
  toggleSwitch: SeldonToggle as ComponentType<Record<string, unknown>>,
}
