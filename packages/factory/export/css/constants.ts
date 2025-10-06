export const CSS_MARKERS = {
  RESET_STYLES_START: "/* Reset styles start */",
  RESET_STYLES_END: "/* Reset styles end */",
  BASE_STYLES_START: "/* Base styles start */",
  BASE_STYLES_END: "/* Base styles end */",
  COMPONENT_STYLES_START: "/* Component styles start */",
  COMPONENT_STYLES_END: "/* Component styles end */",
  THEME_VARIABLES_START: "/* Theme variables start */",
  THEME_VARIABLES_END: "/* Theme variables end */",
} as const

export const CSS_SECTIONS = {
  RESET: "reset",
  BASE: "base",
  COMPONENTS: "components",
  THEMES: "themes",
} as const
