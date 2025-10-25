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
 *
 * But not:
 * - #border
 * - #parent.border
 */
export type BasedOnPropertyKey =
  | `#${string}`
  | `#parent.${string}`
  | `#${string}`
  | `#parent.${string}`
