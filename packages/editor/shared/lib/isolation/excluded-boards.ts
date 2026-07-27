import { ComponentId } from "@seldon/core/components/constants"

/**
 * Catalog ids hidden from Isolation mode. Frame and Container are structural
 * containers that add noise without representing a distinct used component, so
 * the isolation sidebar and canvas gallery both skip them. Instances of these
 * inside other boards still render as part of those boards.
 */
export const ISOLATION_EXCLUDED_CATALOG_IDS: ReadonlySet<string> = new Set([
  ComponentId.FRAME,
  ComponentId.CONTAINER,
])
