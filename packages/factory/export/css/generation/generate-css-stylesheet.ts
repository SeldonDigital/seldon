import { Workspace } from "@seldon/core"

import { Classes } from "../types"
import { format } from "../utils/format"
import { insertBaseStyles } from "./insert-base-styles"
import { insertNodeStyles } from "./insert-node-styles"
import { insertResetStyles } from "./insert-reset-styles"

export async function generateComponentStylesheet(
  classes: Classes,
  workspace: Workspace,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
): Promise<string> {
  let stylesheet = ""

  stylesheet = insertResetStyles(stylesheet)
  stylesheet = insertBaseStyles(stylesheet)
  stylesheet = insertNodeStyles(
    stylesheet,
    classes,
    workspace,
    classNameToNodeId,
    nodeTreeDepths,
  )

  return format(stylesheet)
}
