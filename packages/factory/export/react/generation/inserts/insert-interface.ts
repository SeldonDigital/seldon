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

  // Build props array with proper formatting. Every component may be a ref
  // target, and child refs ride the `sdn` default props through the
  // `{...props}` spread onto the child root, so declare the ref attribute.
  const allProps = ["className?: string", `"data-seldon-ref"?: string`]

  // Components that compose children expose a ref override channel. A caller
  // keys overrides by a descendant's `data-seldon-ref` name, and the merged
  // slot props pick them up via `applyRef`, so view models drive nested slots
  // by stable ref name instead of positional prop name.
  const hasChildren =
    Array.isArray(component.tree.children) && component.tree.children.length > 0
  if (hasChildren) {
    allProps.push("seldonRefs?: Record<string, Record<string, unknown>>")
  }

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
