import { Workspace, getGoogleFontURL } from "@seldon/core"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { workspaceThemeService } from "@seldon/core/workspace/services"
import { getWorkspaceNodeList } from "../../../helpers/workspace-nodes"
import { ExportOptions, FileToExport } from "../../types"
import { format } from "../format"

export async function getFontsComponent(
  workspace: Workspace,
  options: ExportOptions,
): Promise<FileToExport> {
  const fonts: Set<string> = new Set()

  const addFontIfValid = (font: unknown) => {
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

  const usedThemeIds = workspaceThemeService.collectUsedThemes(workspace)

  usedThemeIds.forEach((themeId) => {
    try {
      const theme = workspaceThemeService.getTheme(themeId, workspace)
      if (theme?.fontFamily) {
        Object.values(theme.fontFamily).forEach(addFontIfValid)
      }
    } catch {
      // Continue if theme is not found
    }
  })

  const allThemes = workspaceThemeService.getThemes(workspace)
  allThemes.forEach((theme) => {
    if (theme?.fontFamily) {
      Object.values(theme.fontFamily).forEach(addFontIfValid)
    }
  })

  for (const node of getWorkspaceNodeList(workspace)) {
    const properties = getNodeProperties(node, workspace)

    if (properties.font) {
      try {
        const font = resolveValue(properties.font)
        if (font?.family?.value && typeof font.family.value === "string") {
          addFontIfValid(font.family.value)
        }
      } catch {
        // Continue if font resolution fails
      }
    }
  }

  const fontLinks = Array.from(fonts)
    .map((font) => {
      const url = getGoogleFontURL(font)
      return `    <link rel="stylesheet" href="${url}" />`
    })
    .join("\n")

  const content = await format(
    `import React from "react"

export function Fonts() {
  return (
    <>
${fontLinks}
    </>
  )
}
`,
    options,
  )

  return {
    path: `${options.output.componentsFolder}/Fonts.tsx`,
    content,
  }
}
