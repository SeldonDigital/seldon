import { Board, Instance, Variant } from "@seldon/core"
import { getNodeProperties } from "@seldon/core/workspace/helpers/get-node-properties"
import { useNodeTheme } from "@lib/themes/hooks/use-node-theme"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { getShadowFromProperties } from "./resolve-shadow"

export function useShadow(node: Variant | Instance | Board) {
  const theme = useNodeTheme(node)
  const { workspace } = useWorkspace()

  return getShadowFromProperties(getNodeProperties(node, workspace), theme)
}
