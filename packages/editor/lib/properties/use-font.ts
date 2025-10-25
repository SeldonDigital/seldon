import { Board, Instance, Variant } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { useNodeTheme } from "@lib/themes/hooks/use-node-theme"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { resolveFont } from "./resolve-font"

export function useFont(node: Variant | Instance | Board) {
  const theme = useNodeTheme(node)
  const { workspace } = useWorkspace()

  return resolveFont(getNodeProperties(node, workspace), theme)
}
