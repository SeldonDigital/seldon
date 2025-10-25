import { Board, Instance, Variant } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { useNodeTheme } from "@lib/themes/hooks/use-node-theme"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { resolveBorder } from "./resolve-border"

export function useBorder(node: Variant | Instance | Board) {
  const theme = useNodeTheme(node)
  const { workspace } = useWorkspace()

  return resolveBorder(getNodeProperties(node, workspace), theme)
}
