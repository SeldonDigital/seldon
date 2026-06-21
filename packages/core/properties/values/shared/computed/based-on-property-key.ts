/**
 * This type is used in the basedOn property of computed values.
 * It can be a property key or a property key of the parent component.
 * See packages/core/properties/values/shared/computed/auto-fit.ts for an example.
 *
 * This basically creates type where you can use:
 * - #color
 * - #parent.color
 * - #background.color
 * - #parent.background.color
 * - #self.background.color
 *
 * But not:
 * - #border
 * - #parent.border
 *
 * Anchor prefixes:
 * - `#` reads the current node only.
 * - `#parent.` starts at the parent and walks up the parent chain past
 *   non-contributing layers.
 * - `#self.` reads the current node first and falls back to the parent walk
 *   when the node's own value is non-contributing (missing, `EMPTY`,
 *   `INHERIT`, explicit `transparent`, or a `none` background layer).
 */
export type BasedOnPropertyKey = `#${string}` | `#parent.${string}`
