import { ComponentType } from "react"

import { CustomReactTemplate } from "../../types"
import { ToggleSwitch } from "./ToggleSwitch/ToggleSwitch"

export * from "./registry"
export { ToggleSwitch } from "./ToggleSwitch/ToggleSwitch"

/**
 * Maps each bespoke template id to the React component the canvas renders. Kept
 * separate from `CUSTOM_REACT_TEMPLATE_META` so consumers that only need the
 * emit metadata (the factory) do not import the component modules.
 */
export const CUSTOM_REACT_TEMPLATE_COMPONENTS: Record<
  CustomReactTemplate,
  ComponentType<Record<string, unknown>>
> = {
  toggleSwitch: ToggleSwitch as ComponentType<Record<string, unknown>>,
}
