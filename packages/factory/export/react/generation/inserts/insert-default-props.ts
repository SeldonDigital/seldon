import { CSSProperties } from "react"
import { ComponentToExport } from "../../../types"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"
import { generateDefaultProps } from "../shared/generate-default-props"

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
 * @param propNames - Map of node paths to prop names
 * @returns Updated source content with default props
 */
export function insertDefaultProps(
  source: string,
  component: ComponentToExport,
  nodeIdToClass: Record<string, string> | undefined,
  propNames: Map<string, string>,
) {
  const defaultProps: Record<
    string,
    Record<
      string,
      string | CSSProperties | boolean | number | object | string[] | number[]
    >
  > = generateDefaultProps(component, nodeIdToClass, propNames)

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
