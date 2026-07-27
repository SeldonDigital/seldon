import { useEditorFonts } from "@app/fonts/use-editor-fonts"
import { useNodeTheme } from "@app/themes/hooks/use-node-theme"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useEffect } from "react"

import { resolveFontFamily } from "@seldon/core/helpers/resolution/resolve-font-family"
import { resolveValue } from "@seldon/core/helpers/resolution/resolve-value"
import { getThemeOption } from "@seldon/core/helpers/theme/get-theme-option"
import { InstanceId, VariantId } from "@seldon/core/index"
import { getNodeById } from "@seldon/core/workspace/helpers/nodes/get-node-by-id"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"

/**
 * Adds the nodes used font family to the editor fonts
 * @param nodeId - The id of the node we want to add the font family of
 */
export function useAddNodeFontFamily(nodeId: VariantId | InstanceId) {
  const { workspace } = useWorkspace()
  const { addFont } = useEditorFonts()
  const node = getNodeById(nodeId, workspace)

  const theme = useNodeTheme(node)
  const nodeProperties = getNodeProperties(node, workspace)
  const preset = resolveValue(nodeProperties.font?.preset)
  const themeFont = preset ? getThemeOption(preset.value, theme) : undefined

  const family =
    resolveFontFamily({ fontFamily: nodeProperties.font?.family, theme }) ||
    resolveFontFamily({ fontFamily: themeFont?.parameters.family, theme })

  useEffect(() => {
    if (!family?.value) return

    addFont(family.value)
  }, [family, addFont])
}
