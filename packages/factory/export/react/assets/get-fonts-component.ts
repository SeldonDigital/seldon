import { Workspace, getGoogleFontURL } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { themeService } from "@seldon/core/workspace/services/theme.service"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { ExportOptions, FileToExport } from "../../types"
import { format } from "../format"

/**
 * Generates a React component with a <link> for each font in the tokens object
 *
 * @param tokens - Tokens per components
 * @returns Fonts component
 */
export async function getFontsComponent(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport> {
  const fonts: Set<string> = new Set()

  // Helper function to add valid fonts
  const addFontIfValid = (font: any) => {
    if (
      typeof font === "string" &&
      font !== "inherit" &&
      font !== "serif" &&
      font !== "sans-serif" &&
      font !== "monospace"
    ) {
      fonts.add(font)
    }
  }

  // Get all themes used in the workspace
  const usedThemeIds = themeService.collectUsedThemes(workspace)

  // For each used theme, extract all fonts
  usedThemeIds.forEach((themeId) => {
    try {
      const theme = themeService.getTheme(themeId, workspace)
      if (theme?.fontFamily) {
        Object.values(theme.fontFamily).forEach(addFontIfValid)
      }
    } catch (error) {
      // Continue if theme is not found
    }
  })

  // Also get fonts from all available themes (not just used ones)
  // to ensure we export fonts that might be referenced indirectly
  const allThemes = themeService.getThemes(workspace)
  allThemes.forEach((theme) => {
    if (theme?.fontFamily) {
      Object.values(theme.fontFamily).forEach(addFontIfValid)
    }
  })

  // Check individual nodes for font properties and theme references
  const nodes = workspaceService.getNodes(workspace)
  for (const node of nodes) {
    const properties = getNodeProperties(node, workspace)

    // Check direct font properties
    if (properties.font) {
      try {
        const font = resolveValue(properties.font)
        if (font?.family?.value && typeof font.family.value === "string") {
          addFontIfValid(font.family.value)
        }
        // Also check if font family is a theme reference
        if (font?.family?.type === "theme.categorical") {
          const themeRef = font.family.value
          if (
            typeof themeRef === "string" &&
            themeRef.startsWith("@fontFamily.")
          ) {
            const fontKey = themeRef.replace("@fontFamily.", "")
            // Check all themes for this font key
            allThemes.forEach((theme) => {
              if (
                theme?.fontFamily &&
                typeof theme.fontFamily === "object" &&
                fontKey in theme.fontFamily
              ) {
                addFontIfValid((theme.fontFamily as any)[fontKey])
              }
            })
          }
        }
      } catch (error) {
        // Continue if font resolution fails
      }
    }
  }

  let content = ""

  Array.from(fonts).forEach((font) => {
    content += `<link key="${font}" href="${getGoogleFontURL(font)}" rel="stylesheet" />`
  })

  return {
    path: `${options.output.componentsFolder}/Fonts.tsx`,
    content: await format(`
    export function Fonts() {
      return <>${content}</>
    }
    `),
  }
}
