/**
 * Property constants, types, value shapes, schemas, and merge helpers.
 * **Computed resolution** is not re-exported here: import `@seldon/core/properties/compute`
 * or `@seldon/core` (root re-exports `./properties/compute`) so this barrel stays free of
 * import cycles with the compute implementation. See `properties/compute/PROPERTIES-COMPUTE.md`.
 */
export * from "./constants"
export * from "./types"
export * from "./values"
export * from "./schemas"
export * from "./helpers"

// Re-export commonly used enums for convenience
export { Align } from "./values/layout/align"
export { BackgroundPosition } from "./values/appearance/background/background-position"
export { BackgroundRepeat } from "./values/appearance/background/background-repeat"
export { BorderCollapse } from "./values/appearance/border-collapse"
export { BorderStyle } from "./values/appearance/border/border-style"
export { BorderWidth } from "./values/appearance/border/border-width"
export { Color } from "./values/appearance/color"
export { Corner } from "./values/appearance/corners"
export { Cursor } from "./values/attributes/cursor"
export { Direction } from "./values/layout/direction"
export { Display } from "./values/layout/display"
export { FontStyle } from "./values/typography/font/font-style"
export { Gap } from "./values/layout/gap"
export { Margin } from "./values/layout/margin"
export { Padding } from "./values/layout/padding"
export { GradientType } from "./values/effects/gradients/gradient-type"
export { HtmlElement } from "./values/attributes/html-element"
export { WrapperElement } from "./values/attributes/wrapper-element"
export { ImageFit } from "./values/shared/utilities/image-fit"
export { InputType } from "./values/attributes/input-type"
export { Orientation } from "./values/layout/orientation"
export { Placement } from "./values/layout/placement"
export { Resize } from "./values/layout/resize"
export { ScreenSize } from "./values/layout/screen-size"
export { Scroll } from "./values/effects/scroll"
export { ScrollbarStyle } from "./values/effects/scrollbar-style"
export { TextAlign } from "./values/typography/text-align"
export { TextCasing } from "./values/typography/text-casing"
export { TextDecoration } from "./values/typography/text-decoration"
