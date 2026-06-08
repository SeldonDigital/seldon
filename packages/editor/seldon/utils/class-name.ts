/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/

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
