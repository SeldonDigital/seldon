import type { Instance, Variant } from "@seldon/core/workspace/types"

/**
 * Theme board preview fixture loader. Returns empty until a v0 preview is added.
 */
export async function loadCustomProductCard(): Promise<
  Record<string, Variant | Instance>
> {
  return {}
}
