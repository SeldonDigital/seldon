import { InstanceId, VariantId } from "@seldon/core"
import { NodeIdToClass } from "../../css/types"
import { ComponentToExport } from "../../types"

/**
 * Get the class name for a specific node ID from the nodeIdToClass mapping
 */
export function getClassName(
  nodeId: string,
  nodeIdToClass: Record<string, string | null | undefined>,
): string | null | undefined {
  return nodeIdToClass[nodeId]
}

/**
 * Get the variant class names for a component
 */
export function getVariantClassNames(
  component: ComponentToExport,
  nodeIdToClass: NodeIdToClass,
): string {
  const { defaultVariantId, variantId } = component
  const map = (id: InstanceId | VariantId) => nodeIdToClass[id as string]

  if (defaultVariantId === variantId) return map(variantId)

  return `${map(defaultVariantId)} ${map(variantId)}`
}

/**
 * Normalize class names by removing duplicates and empty values
 */
export function normalizeClassNames(classNames?: string[]): string {
  return (
    classNames
      ?.filter(Boolean)
      .filter((className, index, array) => array.indexOf(className) === index) // Remove duplicates
      .join(" ")
      .trim() ?? ""
  )
}

/**
 * Utility function to combine default and custom classNames while removing duplicates
 *
 * @param defaultClassName - The base className(s)
 * @param customClassName - Optional additional className(s) to append
 * @returns A clean, deduplicated className string
 *
 * @example
 * ```ts
 * combineClassNames("btn primary", "primary large") // "btn primary large"
 * combineClassNames("btn", undefined) // "btn"
 * combineClassNames("btn", "") // "btn"
 * ```
 */
export function combineClassNames(
  defaultClassName?: string,
  customClassName?: string,
): string {
  if (!defaultClassName) return customClassName || ""
  if (!customClassName) return defaultClassName

  const defaultClasses = defaultClassName.split(" ").filter(Boolean)
  const customClasses = customClassName.split(" ").filter(Boolean)
  const allClasses = [...defaultClasses, ...customClasses]

  // Remove duplicates using Set
  const uniqueClasses = Array.from(new Set(allClasses))
  return uniqueClasses.join(" ")
}
