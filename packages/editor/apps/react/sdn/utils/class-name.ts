/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

/**
 * Combines any number of className sources while removing duplicates.
 *
 * @param names - The className sources, in order of increasing precedence
 * @returns A clean, deduplicated className string
 *
 * @example
 * ```ts
 * combineClassNames("btn primary", "primary large") // "btn primary large"
 * combineClassNames("btn", undefined) // "btn"
 * combineClassNames("btn", null, "large") // "btn large"
 * ```
 */
export function combineClassNames(...names: Array<string | null | undefined>): string {
  const classes = names.flatMap((name) => (name ? name.split(" ") : [])).filter(Boolean)

  return Array.from(new Set(classes)).join(" ")
}
