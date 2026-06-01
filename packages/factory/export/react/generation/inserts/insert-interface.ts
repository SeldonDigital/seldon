import { ComponentToExport } from "../../../types"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"
import { generateChildrenProps } from "../shared/generate-children-props"
import {
  generateOwnPropsContent,
  getGenericAndParameters,
} from "../shared/generate-typescript-interface-base"

/**
 * Inserts the interface for a component
 *
 * Basically this adds export interface ComponentProps
 * extends HTMLProps<HTMLComponentElement> { ... } to the source
 *
 * @param source
 * @param component
 * @param propNames - Map of node paths to prop names (for interface keys)
 * @returns Updated source content with TypeScript interface
 */
export function insertInterface(
  source: string,
  component: ComponentToExport,
  propNames: Map<string, string>,
) {
  const { generic, parameters } = getGenericAndParameters(component)

  const ownProps = generateOwnPropsContent(component)
  const childrenProps = generateChildrenProps(component, propNames)

  // Build props array with proper formatting
  const allProps = ["className?: string"]

  if (ownProps.trim()) {
    allProps.push(
      ...ownProps
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.trim()),
    )
  }

  if (childrenProps.trim()) {
    allProps.push(
      ...childrenProps
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.trim()),
    )
  }

  const content = `export interface ${component.tree.dataBinding.interfaceName} extends ${generic}<${parameters.join(" | ")}> {
  ${allProps.join("\n  ")}
}`

  return transformSource({
    strategy: TransformStrategy.PREPEND,
    source,
    content,
  })
}
