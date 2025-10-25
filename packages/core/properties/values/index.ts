// ========================================
// 1. ATTRIBUTES - Component-specific properties
// ========================================
export * from "./attributes/content"
export * from "./attributes/cursor"
export * from "./attributes/html-element"
export * from "./attributes/input-type"
export * from "./attributes/symbol"

// ========================================
// 2. LAYOUT - Positioning, sizing, and spatial relationships
// ========================================
export * from "./layout/align"
export * from "./layout/clip"
export * from "./layout/columns" // Renamed from column-count
export * from "./layout/dimension" // NEW: Dimension value types
export * from "./layout/direction"
export * from "./layout/display"
export * from "./layout/gap"
export * from "./layout/height" // NEW: Extracted from properties.ts
export * from "./layout/margin"
export * from "./layout/orientation"
export * from "./layout/padding"
export * from "./layout/position"
export * from "./layout/resize"
export * from "./layout/rotation"
export * from "./layout/rows" // Renamed from row-count
export * from "./layout/screen-height" // NEW: Extracted from properties.ts
export * from "./layout/screen-width" // NEW: Extracted from properties.ts
export * from "./layout/width" // NEW: Extracted from properties.ts
export * from "./layout/wrap-children" // NEW: Extracted from properties.ts

// ========================================
// 3. APPEARANCE - Visual styling and appearance
// ========================================
export * from "./appearance/accent-color" // NEW: Extracted from properties.ts
export * from "./appearance/background"
export * from "./appearance/border"
export * from "./appearance/border-collapse" // NEW: Combined from shared/preset
export * from "./appearance/brightness"
export * from "./appearance/color"
export * from "./appearance/corners"
export * from "./appearance/opacity"
export * from "./appearance/size" // NEW: Size value types

// ========================================
// 4. TYPOGRAPHY - Text styling, fonts, and typography
// ========================================
export * from "./typography/font"
export * from "./typography/letter-spacing"
export * from "./typography/line-count"
export * from "./typography/lines"
export * from "./typography/text-align"
export * from "./typography/text-case" // Renamed from case
export * from "./typography/text-decoration"
export * from "./typography/wrap-text" // NEW: Extracted from properties.ts

// ========================================
// 5. GRADIENTS - Gradient effects and color transitions
// ========================================
export * from "./gradients"
export * from "./gradients/gradient-angle"
export * from "./gradients/gradient-preset"
export * from "./gradients/gradient-stop-brightness"
export * from "./gradients/gradient-stop-color"
export * from "./gradients/gradient-stop-opacity"
export * from "./gradients/gradient-stop-position"
export * from "./gradients/gradient-type"

// ========================================
// 6. EFFECTS - Visual effects and interactions
// ========================================
export * from "./effects/scroll"
export * from "./effects/scrollbar-style"
export * from "./effects/shadow"

// ========================================
// SHARED UTILITIES - Cross-cutting utilities and value types
// ========================================

// Empty values
export * from "./shared/empty/empty"

// Exact values (custom values like colors, dimensions, etc.)
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
export * from "./shared/exact/transparent"

// Inherit values
export * from "./shared/inherit/inherit"

// Preset values (predefined options) - Multi-use only
export * from "./shared/preset/align"
export * from "./shared/preset/boolean"
export * from "./shared/preset/double-axis"
export * from "./shared/preset/screen-size"

// Computed values (derived from other values)
export * from "./shared/computed/auto-fit"
export * from "./shared/computed/based-on-property-key"
export * from "./shared/computed/computed-functions"
export * from "./shared/computed/computed-value"
export * from "./shared/computed/high-contrast-color"
export * from "./shared/computed/match"
export * from "./shared/computed/optical-padding"

// Shared utilities (not user-facing properties)
export * from "./shared/utilities/buttonSize" // Moved from appearance/
export * from "./shared/utilities/image-fit" // Moved from appearance/
export * from "./shared/utilities/image-source" // Moved from appearance/
