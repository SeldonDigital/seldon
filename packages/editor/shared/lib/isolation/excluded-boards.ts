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

/**
 * Catalog ids left out of the isolation canvas height baseline. Image ships a
 * large default that would set the height for every board in its level group,
 * so it takes the group height like its siblings without setting it.
 */
export const ISOLATION_HEIGHT_EXCLUDED_CATALOG_IDS: ReadonlySet<string> = new Set([
  ComponentId.IMAGE,
])
