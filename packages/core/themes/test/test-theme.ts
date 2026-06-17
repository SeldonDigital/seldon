import { theme as defaultStock } from "../catalog/seldon"
import { computeTheme } from "../helpers/compute-theme"

/** Computed stock default theme for unit tests. */
export const testTheme = computeTheme(defaultStock)
