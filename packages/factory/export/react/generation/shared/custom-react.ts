import { invariant } from "@seldon/core"
import {
  CUSTOM_REACT_TEMPLATE_META,
  CustomReactTemplateMeta,
} from "@seldon/core/components/catalog/custom/registry"

import { ComponentToExport } from "../../../types"

/**
 * Resolves the emit metadata for a component that returns `"custom"`. Throws
 * when the export config omits the `react.custom` block.
 */
export function getCustomTemplateMeta(
  component: ComponentToExport,
): CustomReactTemplateMeta {
  const custom = component.config.react.custom
  invariant(
    custom,
    `Custom component ${component.name} is missing react.custom`,
  )
  return CUSTOM_REACT_TEMPLATE_META[custom.template]
}

/**
 * JSX tag name for a component's root element. Custom components resolve to
 * their bespoke template's import name; every other component uses its
 * `react.returns` value directly.
 */
export function getReactReturnTag(component: ComponentToExport): string {
  const { config } = component
  if (config.react.returns === "custom") {
    return getCustomTemplateMeta(component).importName
  }
  return config.react.returns
}
