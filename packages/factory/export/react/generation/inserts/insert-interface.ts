import { Workspace } from "@seldon/core/workspace/types"
import { ComponentToExport } from "../../../types"
import {
  TransformStrategy,
  transformSource,
} from "../../utils/transform-source"
import { generateCustomComponentChildrenProps } from "../custom-components/generate-custom-interface"
import { isCustomComponent } from "../custom-components/is-custom-component"
import { generateDefaultComponentChildrenProps } from "../default-components/generate-default-interface"
import { isDefaultComponent } from "../default-components/is-default-component"
import { generateInlineComponentChildrenProps } from "../inline-components/generate-inline-interface"
import { isInlineComponent } from "../inline-components/is-inline-component"
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
 * @param propKeysMap - Map of node paths to prop key names (for JSX attributes and direct children interface keys)
 * @param propValuesMap - Map of node paths to prop value names (for grandchildren interface keys and function signatures)
 * @param workspace - Workspace for variant type detection
 * @returns Updated source content with TypeScript interface
 */
export function insertInterface(
  source: string,
  component: ComponentToExport,
  propKeysMap: Map<string, string>,
  propValuesMap: Map<string, string>,
  workspace: Workspace,
) {
  const { generic, parameters } = getGenericAndParameters(component)

  const ownProps = generateOwnPropsContent(component)
  // Use component-type-specific generator based on variant type and frame presence
  const isInline = isInlineComponent(component)
  const isDefault = isDefaultComponent(component, workspace)
  const isCustom = isCustomComponent(component, workspace)

  const childrenProps = isInline
    ? generateInlineComponentChildrenProps(
        component,
        propKeysMap,
        propValuesMap,
      )
    : isDefault
      ? generateDefaultComponentChildrenProps(
          component,
          propKeysMap,
          propValuesMap,
        )
      : generateCustomComponentChildrenProps(
          component,
          propKeysMap,
          propValuesMap,
        )

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
