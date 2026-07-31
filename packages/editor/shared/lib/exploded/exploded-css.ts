import {
  EXPLODE_INITIAL_ROTATION_X_DEG,
  EXPLODE_INITIAL_ROTATION_Y_DEG,
  EXPLODE_INITIAL_ROTATION_Z_DEG,
  EXPLODE_MIN_SURFACE_OPACITY,
  EXPLODE_ROTATION_X_PROPERTY,
  EXPLODE_ROTATION_Y_PROPERTY,
  EXPLODE_ROTATION_Z_PROPERTY,
  EXPLODE_SHADOW_BLUR_PX,
  EXPLODE_SHADOW_COLOR_PROPERTY,
  EXPLODE_SHADOW_OFFSET_PX,
  EXPLODE_STAGE_ATTRIBUTE,
  EXPLODE_SURFACE_ATTRIBUTE,
  EXPLODE_SURFACE_LEVELS,
  EXPLODE_SURFACE_OPACITY_FALLOFF,
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
 * What every plane of the stack gets: the shadow it casts on the backdrop, and the
 * fade that lets it show the planes behind it. One rule per plane, and there are as
 * many planes as there are component levels, so this does not grow with the tree.
 *
 * Placement is inline on each surface and each node, since every one sits somewhere
 * different.
 */
export function getExplodedCss(): string {
  const rules: string[] = []

  for (let plane = 0; plane < EXPLODE_SURFACE_LEVELS.length; plane++) {
    const declarations = [`  filter: ${getPlaneShadow(plane)};`]
    const opacity = getPlaneOpacity(plane)

    if (opacity) declarations.push(`  opacity: ${opacity};`)

    rules.push(
      `[${EXPLODE_STAGE_ATTRIBUTE}] [${EXPLODE_SURFACE_ATTRIBUTE}="${plane}"] {`,
      ...declarations,
      `}`,
    )
  }

  return rules.join("\n")
}

/**
 * How far a plane fades to let the planes behind it through, or nothing when the
 * falloff leaves it solid. With no falloff every plane stays as it is, so the rules
 * carry no opacity at all rather than one that does nothing.
 */
function getPlaneOpacity(plane: number): string | null {
  const faded = 1 - plane * EXPLODE_SURFACE_OPACITY_FALLOFF

  if (faded >= 1) return null

  return Math.max(EXPLODE_MIN_SURFACE_OPACITY, faded).toFixed(2)
}

/**
 * The shadow a plane casts, faked as a drop shadow of its own silhouette.
 *
 * Nothing here is cast by one plane onto another. A plane simply throws a shadow that
 * grows the further forward it stands, which is the cue that reads as height off the
 * backdrop. The light sits above and to the left, so every shadow falls the same way.
 *
 * A drop shadow reads the alpha of everything on the plane, so a plane holding several
 * nodes casts one shadow around all of them rather than a box per node.
 */
function getPlaneShadow(plane: number): string {
  const offset = EXPLODE_SHADOW_OFFSET_PX * (plane + 1)
  const blur = EXPLODE_SHADOW_BLUR_PX * (plane + 1)

  return `drop-shadow(${offset}px ${offset}px ${blur}px var(${EXPLODE_SHADOW_COLOR_PROPERTY}))`
}
