import { Board, Instance, Variant } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { useNodeTheme } from "@lib/themes/hooks/use-node-theme"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { resolveBackground } from "./resolve-background"

export function useBackground(node: Variant | Instance | Board) {
  const theme = useNodeTheme(node)
  const { workspace } = useWorkspace()

  return resolveBackground(getNodeProperties(node, workspace), theme)
}
