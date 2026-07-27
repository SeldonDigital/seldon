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
import type { IconGeometry } from "../icons/index"

// Prop-driven dynamic icons (color chips, theme swatches) register geometry at
// runtime, since the factory cannot emit them as static SVG data.
const registry = new Map<string, IconGeometry>()

export function registerIcon(id: string, geometry: IconGeometry): void {
  registry.set(id, geometry)
}

export function getRegisteredIcon(
  id: string | undefined,
): IconGeometry | undefined {
  if (!id) return undefined
  return registry.get(id)
}
