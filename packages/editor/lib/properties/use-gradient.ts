import { Board, Instance, Variant } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { useNodeTheme } from "@lib/themes/hooks/use-node-theme"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { resolveGradient } from "./resolve-gradient"

export function useGradient(node: Variant | Instance | Board) {
  const theme = useNodeTheme(node)
  const { workspace } = useWorkspace()

  return resolveGradient(getNodeProperties(node, workspace), theme)
}
