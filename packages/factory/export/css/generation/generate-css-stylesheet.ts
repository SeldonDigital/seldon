import { Workspace } from "@seldon/core"

import { Classes, DescendantStateClasses, StateClasses } from "../types"
import { format } from "../utils/format"
import { insertBaseStyles } from "./insert-base-styles"
import { insertNodeStyles } from "./insert-node-styles"
import { insertResetStyles } from "./insert-reset-styles"

export async function generateComponentStylesheet(
  classes: Classes,
  workspace: Workspace,
  classNameToNodeId?: Record<string, string>,
  nodeTreeDepths?: Record<string, number>,
  stateClasses?: StateClasses,
  descendantStateClasses?: DescendantStateClasses,
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
    stateClasses,
    descendantStateClasses,
  )

  return format(stylesheet)
}
