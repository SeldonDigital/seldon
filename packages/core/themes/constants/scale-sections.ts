/**
 * Scale section lists shared by the dynamic schema generators, the empty
 * custom-token payload builder, and any other consumer that needs to know
 * which token sections behave as ordered scales.
 */

/** Scale sections whose default custom cell is a modulated step on the scale. */
export const MODULATED_SCALE_SECTIONS = [
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "corners",
  "fontSize",
  "blur",
  "spread",
] as const

/** Scale sections whose custom rows render as a `.step` input. */
export const SCALE_STEP_SECTIONS = [
  ...MODULATED_SCALE_SECTIONS,
  "borderWidth",
  "lineHeight",
] as const

export type ModulatedScaleSection = (typeof MODULATED_SCALE_SECTIONS)[number]
export type ScaleStepSection = (typeof SCALE_STEP_SECTIONS)[number]
