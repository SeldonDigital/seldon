import isEqual from "lodash.isequal"
import { StaticTheme } from "@seldon/core"

export function areThemesEqual(theme1: StaticTheme, theme2: StaticTheme) {
  // Remove the id and name from the themes, they will always be different
  // eslint-disable-next-line
  const { id: _id1, name: _name1, ...theme1WithoutBasics } = theme1
  // eslint-disable-next-line
  const { id: _id2, name: _name2, ...theme2WithoutBasics } = theme2
  return isEqual(theme1WithoutBasics, theme2WithoutBasics)
}
