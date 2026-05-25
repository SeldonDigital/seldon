import { ComponentLevel } from "@seldon/core/components/constants"
import { ComponentToExport } from "../../../types"

/**
 * Inline Component:
 * Generated when a Frame component encompasses any component
 *
 * Components that have a Frame as a direct child. Frame's children (grandchildren
 * from parent perspective) must be generated as either default-components or
 * custom-components based on their variant type.
 *
 * Key characteristics:
 * - Has Frame as direct child: Component has any direct child with level === ComponentLevel.FRAME
 * - Frame contains other components: These are grandchildren from parent's perspective
 * - Nested components: Frame's children are generated as default-components or custom-components
 * - Each nested component gets its own className and props structure
 *
 */
export function isInlineComponent(component: ComponentToExport): boolean {
  if (!Array.isArray(component.tree.children)) {
    return false
  }

  // Check if component has any direct child with level === ComponentLevel.FRAME
  return component.tree.children.some(
    (child) => child.level === ComponentLevel.FRAME,
  )
}
