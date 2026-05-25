import { CSSProperties } from "react"
import { Workspace } from "@seldon/core/workspace/types"
import { ComponentToExport } from "../../../types"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"
import { generateCustomComponentDefaultProps } from "../custom-components/generate-custom-default-props"
import { isCustomComponent } from "../custom-components/is-custom-component"
import { generateDefaultComponentDefaultProps } from "../default-components/generate-default-default-props"
import { isDefaultComponent } from "../default-components/is-default-component"
import { generateInlineComponentDefaultProps } from "../inline-components/generate-inline-default-props"
import { isInlineComponent } from "../inline-components/is-inline-component"

/**
 * We build a defaultProps object to make sure nested children have
 * the correct overrides, In the function body the are merged together
 * with the props that are passed from the parent.
 *
 * Only includes props that have default values in function signature (valid props).
 * Grandchildren props are included regardless of parent being conditional.
 *
 * @param source
 * @param component
 * @param nodeIdToClass - Mapping of node IDs to CSS class names for themed components
 * @param propValuesMap - Map of node paths to prop value names (for variable names)
 * @param workspace - Workspace for variant type detection
 * @returns Updated source content with default props
 */
export function insertDefaultProps(
  source: string,
  component: ComponentToExport,
  nodeIdToClass: Record<string, string> | undefined,
  propValuesMap: Map<string, string>,
  workspace: Workspace,
) {
  // Use component-type-specific generator based on variant type and frame presence
  const isInline = isInlineComponent(component)
  const isDefault = isDefaultComponent(component, workspace)
  const isCustom = isCustomComponent(component, workspace)

  let defaultProps: Record<
    string,
    Record<
      string,
      string | CSSProperties | boolean | number | object | string[] | number[]
    >
  > = {}

  if (isInline) {
    // Inline components: exclude invalid grandchildren but include valid grandchildren
    defaultProps = generateInlineComponentDefaultProps(
      component,
      nodeIdToClass,
      propValuesMap,
    )
  } else if (isDefault) {
    // Default components: use simplified generator
    defaultProps = generateDefaultComponentDefaultProps(
      component,
      nodeIdToClass,
      propValuesMap,
    )
  } else {
    // Custom components: exclude conditional props but include grandchildren
    defaultProps = generateCustomComponentDefaultProps(
      component,
      nodeIdToClass,
      propValuesMap,
    )
  }

  if (Object.keys(defaultProps).length === 0) {
    return source
  }

  source = transformSource({
    source,
    strategy: TransformStrategy.APPEND,
    content: `
//
// Default property values
//
const sdn: ${component.tree.dataBinding.interfaceName} = ${JSON.stringify(
      defaultProps,
      null,
      2,
    )}`,
  })

  return source
}
