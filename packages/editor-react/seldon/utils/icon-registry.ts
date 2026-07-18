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
import type { ComponentType } from "react"

/** Props any registered icon may receive; the generated `Icon` spreads its own props through. */
export type RegisteredIconProps = Record<string, unknown>

const registry = new Map<string, ComponentType<RegisteredIconProps>>()

/**
 * Registers a React component under an icon id. Call this at startup for each
 * dynamic icon the generated `Icon` should render but that has no catalog SVG.
 */
export function registerIcon(
  id: string,
  component: ComponentType<RegisteredIconProps>,
): void {
  registry.set(id, component)
}

/** Returns the component registered for an icon id, or undefined when none is. */
export function getRegisteredIcon(
  id: string | undefined,
): ComponentType<RegisteredIconProps> | undefined {
  if (!id) return undefined
  return registry.get(id)
}
