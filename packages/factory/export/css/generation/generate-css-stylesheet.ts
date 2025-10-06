import { Workspace } from "@seldon/core"
import { Classes } from "../types"
import { format } from "../utils/format"
import { insertBaseStyles } from "./insert-base-styles"
import { insertNodeStyles } from "./insert-node-styles"
import { insertResetStyles } from "./insert-reset-styles"
import { insertThemeVariables } from "./insert-theme-variables"

export async function generateStylesheet(
  classes: Classes,
  workspace: Workspace,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
) {
  let stylesheet = ""

  stylesheet = insertResetStyles(stylesheet)
  stylesheet = insertBaseStyles(stylesheet)
  stylesheet = insertNodeStyles(
    stylesheet,
    classes,
    classNameToNodeId,
    nodeTreeDepths,
  )
  stylesheet = insertThemeVariables(stylesheet, workspace)

  stylesheet = await format(stylesheet)

  return stylesheet
}
