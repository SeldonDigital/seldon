/**
 * Re-exports property value modules for `@seldon/core/properties/values`.
 *
 * Numbered `// N. …` blocks follow **PROPERTIES.md** catalog categories (Attributes, Layout,
 * Appearance, Typography, Effects), not the on-disk folder tree — for example `display` is
 * implemented under `layout/display` but is listed with Attributes in the spec.
 */

// ========================================
// 1. Attributes (PROPERTIES.md — may import from layout/, appearance/, etc.)
// ========================================
export * from "./layout/display"
export * from "./attributes/html-element"
export * from "./attributes/wrapper-element"
export * from "./attributes/content"
export * from "./attributes/symbol"
export * from "./attributes/source"
export * from "./shared/utilities/image-fit"
export * from "./attributes/alt-text"
export * from "./attributes/input-type"
export * from "./attributes/placeholder"
export * from "./attributes/checked"
export * from "./attributes/media"
export * from "./appearance/size"
export * from "./shared/utilities/button-size"
export * from "./layout/board"
export * from "./layout/screen-width"
export * from "./layout/screen-height"
export * from "./attributes/cursor"

// ========================================
// 2. Layout (PROPERTIES.md)
// ========================================
export * from "./layout/direction"
export * from "./layout/placement"
export * from "./layout/position"
export * from "./layout/orientation"
export * from "./layout/align"
export * from "./layout/width"
export * from "./layout/height"
export * from "./layout/margin"
export * from "./layout/padding"
export * from "./layout/gap"
export * from "./layout/rotation"
export * from "./layout/wrap-children"
export * from "./layout/clip"
export * from "./layout/list-style-type"
export * from "./layout/list-style-position"
export * from "./layout/columns"
export * from "./layout/rows"
export * from "./layout/column-start"
export * from "./layout/column-span"
export * from "./layout/row-start"
export * from "./layout/row-span"
export * from "./layout/cell-align"
export * from "./layout/dimension"
export * from "./layout/resize"
export * from "./layout/screen-size"

// ========================================
// 3. Appearance (PROPERTIES.md)
// ========================================
export * from "./appearance/color"
export * from "./appearance/accent-color"
export * from "./appearance/brightness"
export * from "./appearance/opacity"
export * from "./appearance/background"
export * from "./appearance/border"
export * from "./appearance/border-collapse"
export * from "./appearance/corners"

// ========================================
// 4. Typography (PROPERTIES.md)
// ========================================
export * from "./typography/font"
export * from "./typography/text-align"
export * from "./typography/letter-spacing"
export * from "./typography/text-casing"
export * from "./typography/text-decoration"
export * from "./typography/wrap-text"
export * from "./typography/lines"

// ========================================
// 5. Effects (PROPERTIES.md)
// ========================================
export * from "./effects/gradients"
export * from "./effects/shadow"
export * from "./effects/scroll"
export * from "./effects/scrollbar-style"

// ========================================
// 6. Accessibility (PROPERTIES.md)
// ========================================
export * from "./accessibility/role"
export * from "./accessibility/aria-label"
export * from "./accessibility/aria-hidden"
export * from "./accessibility/aria-disabled"
export * from "./accessibility/aria-expanded"
export * from "./accessibility/aria-selected"
export * from "./accessibility/aria-tristate"
export * from "./accessibility/aria-checked"
export * from "./accessibility/aria-pressed"
export * from "./accessibility/aria-current"
export * from "./accessibility/aria-has-popup"
export * from "./accessibility/aria-invalid"
export * from "./accessibility/aria-required"
export * from "./accessibility/aria-readonly"
export * from "./accessibility/aria-live"

// ========================================
// Shared wire shapes (exact / option / computed / inherit, etc.)
// ========================================
export * from "./shared/empty/empty"
export * from "./shared/exact/color-spaces"
export * from "./shared/exact/degrees"
export * from "./shared/exact/hex"
export * from "./shared/exact/hsl"
export * from "./shared/exact/lch"
export * from "./shared/exact/number"
export * from "./shared/exact/percentage"
export * from "./shared/exact/pixel"
export * from "./shared/exact/rem"
export * from "./shared/exact/rgb"
export * from "./shared/exact/string"
export * from "./shared/inherit/inherit"
export * from "./shared/option/align"
export * from "./shared/option/boolean"
export * from "./shared/option/double-axis"
export * from "./shared/option/screen-size"
export * from "./shared/option/transparent"
export * from "./shared/computed/auto-fit"
export * from "./shared/computed/computed"
export * from "./shared/computed/computed-value"
export * from "./shared/computed/high-contrast-color"
export * from "./shared/computed/match"
export * from "./shared/computed/optical-padding"
export * from "./shared/utilities/image-source"
