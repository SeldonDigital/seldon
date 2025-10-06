import { ComponentToExport } from "../../types"
import { TransformStrategy, transformSource } from "../utils/transform-source"
import {
  generateOwnPropsContent,
  getGenericAndParameters,
} from "./generate-typescript-interface-base"
import { generateChildrenPropsContent } from "./generate-typescript-interface-children-props"

/**
 * Inserts the interface for a component
 *
 * Basically this adds export interface ComponentProps
 * extends HTMLProps<HTMLComponentElement> { ... } to the source
 *
 * @param source
 * @param component
 * @returns - Update source content
 */
export function insertInterface(source: string, component: ComponentToExport) {
  const { generic, parameters } = getGenericAndParameters(component)

  const ownProps = generateOwnPropsContent(component)
  const childrenProps = generateChildrenPropsContent(component)

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
