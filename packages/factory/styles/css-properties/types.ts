import type * as CSS from "csstype"

/**
 * Not sure if this is the best name, but basically a CSS object is this:
 *
 * const css: CSSObject = {
 *   color: "#eee",
 *   ":hover": {
 *     color: "#eee",
 *   },
 *   ":focus": {
 *     color: "#eee",
 *   },
 * }
 *
 */
export type CSSObject = {
  [P in CSS.SimplePseudos]?: CSS.Properties
} & CSS.Properties
