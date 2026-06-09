import defaultStock from "../catalog/seldon"
import { computeTheme } from "../helpers/compute-theme"

/** Computed stock default theme for unit tests. */
const testTheme = computeTheme(defaultStock)

export default testTheme
