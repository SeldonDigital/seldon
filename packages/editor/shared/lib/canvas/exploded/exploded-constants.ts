// Exploded view geometry, measured in device pixels and degrees rather than
// theme tokens. The stage holds a copy of the anchored variant turned into a 3D
// scene, so every number here is canvas geometry.

/** Distance along z between one layer and the layer inside it. */
export const EXPLODE_LAYER_GAP_PX = 48

/** Viewer distance from the stage. A larger value flattens the perspective. */
export const EXPLODE_PERSPECTIVE_PX = 2400

/** Room around the layers, so a turned scene has space inside the row. */
export const EXPLODE_STAGE_PADDING_PX = 96

/**
 * Deepest plane in the stack. Layers below it share that plane, which bounds both
 * how far the stack reaches and how many compositing layers it can create.
 */
export const EXPLODE_MAX_DEPTH = 12

/** Opacity taken off a layer for each level of depth. */
export const EXPLODE_LAYER_OPACITY_FALLOFF = 0.05

/** Floor for the fade, so the frontmost layer stays readable. */
export const EXPLODE_MIN_LAYER_OPACITY = 0.45

// Resting angles, a three-quarter view from above.
export const EXPLODE_INITIAL_ROTATION_X_DEG = -22
export const EXPLODE_INITIAL_ROTATION_Y_DEG = -28
export const EXPLODE_INITIAL_ROTATION_Z_DEG = 0

/** Degrees turned per pixel dragged. */
export const EXPLODE_DEGREES_PER_PX = 0.35

/**
 * How far each axis can turn from square. The stack stays a readable three-quarter
 * view: it never reaches edge-on, turns past its own back, or stands on end.
 */
export const EXPLODE_ROTATION_LIMIT_DEG = 45

/** Marks the element that holds the scene and reads the drag. */
export const EXPLODE_STAGE_ATTRIBUTE = "data-explode-stage"

/** Marks a copied node as a layer, carrying its depth in the copied tree. */
export const EXPLODE_DEPTH_ATTRIBUTE = "data-explode-depth"

/** Marks a layer with no layers inside it, the only ones the fade applies to. */
export const EXPLODE_LEAF_ATTRIBUTE = "data-explode-leaf"

// Custom properties the stage writes the current angles to, so a drag repaints
// the scene without rebuilding it.
export const EXPLODE_ROTATION_X_PROPERTY = "--explode-rotation-x"
export const EXPLODE_ROTATION_Y_PROPERTY = "--explode-rotation-y"
export const EXPLODE_ROTATION_Z_PROPERTY = "--explode-rotation-z"
