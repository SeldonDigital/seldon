import type { Workspace } from "@seldon/core/workspace/types"

export function isIconSetVariant(
  variant: { type?: string },
  workspace: Workspace,
): boolean {
  return variant.type === "iconSheet"
}
