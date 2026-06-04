import { computeTheme } from "../helpers/compute-theme"
import defaultStock from "../catalog/seldon"

/** Computed stock default theme for unit tests. */
const testTheme = computeTheme(defaultStock)

export default testTheme
