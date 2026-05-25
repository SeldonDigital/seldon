import { computeTheme } from "../helpers/compute-theme"
import defaultStock from "../stock/default"

/** Computed stock default theme for unit tests. */
const testTheme = computeTheme(defaultStock)

export default testTheme
