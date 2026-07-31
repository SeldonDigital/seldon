import {
  EXPLODE_DEPTH_ATTRIBUTE,
  EXPLODE_INITIAL_ROTATION_X_DEG,
  EXPLODE_INITIAL_ROTATION_Y_DEG,
  EXPLODE_INITIAL_ROTATION_Z_DEG,
  EXPLODE_LAYER_OPACITY_FALLOFF,
  EXPLODE_MAX_DEPTH,
  EXPLODE_MIN_LAYER_OPACITY,
  EXPLODE_ROTATION_X_PROPERTY,
  EXPLODE_ROTATION_Y_PROPERTY,
  EXPLODE_ROTATION_Z_PROPERTY,
  EXPLODE_STAGE_ATTRIBUTE,
} from "./exploded-constants"

/**
 * Turn applied to the whole stack. The angles come from custom properties the
 * stage writes during a drag, and the resting angles are the fallbacks so the
 * first paint is already turned.
 */
export const EXPLODED_WORLD_TRANSFORM = [
  `rotateX(var(${EXPLODE_ROTATION_X_PROPERTY}, ${EXPLODE_INITIAL_ROTATION_X_DEG}deg))`,
  `rotateY(var(${EXPLODE_ROTATION_Y_PROPERTY}, ${EXPLODE_INITIAL_ROTATION_Y_DEG}deg))`,
  `rotateZ(var(${EXPLODE_ROTATION_Z_PROPERTY}, ${EXPLODE_INITIAL_ROTATION_Z_DEG}deg))`,
].join(" ")

/**
 * The fade that lets a layer show the layers behind it, as one stylesheet whose
 * size does not grow with the tree. A layer holds no layers inside it, so fading
 * it costs nothing but its own surface.
 *
 * Placement is inline on each layer, since every one sits somewhere different.
 */
export function getExplodedCss(): string {
  const rules: string[] = []

  for (let depth = 1; depth <= EXPLODE_MAX_DEPTH; depth++) {
    const faded = 1 - depth * EXPLODE_LAYER_OPACITY_FALLOFF
    const opacity = Math.max(EXPLODE_MIN_LAYER_OPACITY, faded).toFixed(2)

    rules.push(
      `[${EXPLODE_STAGE_ATTRIBUTE}] [${EXPLODE_DEPTH_ATTRIBUTE}="${depth}"] {`,
      `  opacity: ${opacity};`,
      `}`,
    )
  }

  return rules.join("\n")
}
