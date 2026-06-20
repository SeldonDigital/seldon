import { ComponentToExport } from "../../../types"

/**
 * Whether a prop key is an HTML attribute that the element's `HTMLAttributes`
 * base already declares (`role` and any `aria-*`). These keys are not threaded
 * through JS identifiers: dashed keys are illegal identifiers, and they would
 * duplicate the base attributes in the generated interface.
 */
export function isAttributeKey(key: string): boolean {
  return key === "role" || key.startsWith("aria-")
}

/**
 * Builds the JSX attribute string for a component's root attribute-style props,
 * sourcing each value from the `sdn` default object via bracket access so dashed
 * keys stay legal. Returns a space-prefixed string, or an empty string when the
 * root declares no attribute-style props. Emit this before `{...props}` so a
 * caller-passed value overrides the authored default.
 */
export function generateRootAttributePropsString(
  component: ComponentToExport,
): string {
  const keys = Object.keys(component.tree.dataBinding.props).filter(
    isAttributeKey,
  )
  if (keys.length === 0) {
    return ""
  }
  return (
    " " + keys.map((key) => `${key}={sdn[${JSON.stringify(key)}]}`).join(" ")
  )
}
