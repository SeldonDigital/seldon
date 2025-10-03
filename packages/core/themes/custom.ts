import defaultTheme from "./stock/default"
import { Theme } from "./types"

// This is the default state of the custom theme.
// User can change this theme in the editor and it is saved in the workspace.
const theme: Theme = {
  ...defaultTheme,
  id: "custom",
  name: "Custom",
}

export default theme
