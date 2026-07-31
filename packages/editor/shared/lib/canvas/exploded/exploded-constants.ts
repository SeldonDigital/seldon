import { ComponentLevel, ORDERED_COMPONENT_LEVELS } from "@seldon/core"

// This file holds every value the exploded view is built from. It covers the stack of
// surfaces, the geometry of the scene in device pixels and degrees, and the attribute
// and custom property names that the stage, the surfaces, and the stylesheet share.

/**
 * The surfaces of the stack, ordered back to front. Each node goes on the surface for
 * its own component level. The stack always has these surfaces and no others. Core
 * defines the order of the levels, so the stack follows it.
 *
 * Frames and primitives get no surface. A frame is a container rather than a level of
 * composition, so it goes on the surface of whatever holds it. A primitive ends a
 * branch, so it is drawn onto its parent's surface. That puts it with the element that
 * holds it.
 */
export const EXPLODE_SURFACE_LEVELS: ComponentLevel[] = ORDERED_COMPONENT_LEVELS.filter(
  (level) => level !== ComponentLevel.PRIMITIVE && level !== ComponentLevel.FRAME,
)

/** How far apart two neighboring surfaces sit along z. */
export const EXPLODE_SURFACE_GAP_PX = 50

/** How far the viewer sits from the stage. A larger value flattens the perspective. */
export const EXPLODE_PERSPECTIVE_PX = 2400

/**
 * How far a copied node's clip reaches past its own edge on a side that nothing clips.
 *
 * A clip path must give a value for all four sides. This value pushes those sides far
 * enough out to clear anything the node draws outside its box, such as a shadow.
 */
export const EXPLODE_CLIP_OUTSET_PX = 2000

/**
 * How much ink the backdrop mixes in at its edges. Ink is the neutral swatch that
 * contrasts with the sheet in the current interface mode.
 *
 * The middle of the backdrop stays clear and the edges take the ink. The backdrop
 * therefore works in both interface modes without setting a color of its own.
 */
export const EXPLODE_BACKDROP_INK_PERCENT = 14

/** How much ink a surface's shadow mixes in over whatever sits behind it. */
export const EXPLODE_SHADOW_INK_PERCENT = 20

// How much offset and blur a surface's shadow gains per plane. A surface further
// forward stands further off the backdrop, so its shadow grows.
export const EXPLODE_SHADOW_OFFSET_PX = 7
export const EXPLODE_SHADOW_BLUR_PX = 11

/**
 * How much opacity a surface loses per plane. Leave this at 0 to keep every surface
 * solid. Raise it to fade the front surfaces and show the ones behind them.
 */
export const EXPLODE_SURFACE_OPACITY_FALLOFF = 0

/** The lowest opacity the fade may reach, so the frontmost surface stays readable. */
export const EXPLODE_MIN_SURFACE_OPACITY = 0.5

// The angles the scene rests at. They give a three-quarter view from above.
export const EXPLODE_INITIAL_ROTATION_X_DEG = 12
export const EXPLODE_INITIAL_ROTATION_Y_DEG = 24
export const EXPLODE_INITIAL_ROTATION_Z_DEG = -8

/** How many degrees the scene turns per pixel dragged. */
export const EXPLODE_DEGREES_PER_PX = 0.35

/**
 * How far each axis may turn away from square. The limit keeps the stack in a readable
 * three-quarter view. The stack never turns edge-on, never shows its back, and never
 * stands on end.
 */
export const EXPLODE_ROTATION_LIMIT_DEG = 45

/** Marks the element that holds the scene and handles the drag. */
export const EXPLODE_STAGE_ATTRIBUTE = "data-explode-stage"

/** Marks a surface. Its value is the plane the surface sits on. */
export const EXPLODE_SURFACE_ATTRIBUTE = "data-explode-surface"

// The stage writes the current angles to these custom properties. A drag then repaints
// the scene without rebuilding it.
export const EXPLODE_ROTATION_X_PROPERTY = "--explode-rotation-x"
export const EXPLODE_ROTATION_Y_PROPERTY = "--explode-rotation-y"
export const EXPLODE_ROTATION_Z_PROPERTY = "--explode-rotation-z"

/**
 * The stage writes the shadow color to this custom property. The interface mode decides
 * which neutral swatch counts as ink, and only the board knows the mode. The stylesheet
 * therefore reads the color from here instead of naming a swatch itself.
 */
export const EXPLODE_SHADOW_COLOR_PROPERTY = "--explode-shadow-color"
