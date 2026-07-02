import type { Workspace } from "../model/workspace"

/** Top-level maps every serialized workspace must carry. */
const REQUIRED_TOP_LEVEL_KEYS = ["metadata", "boards", "nodes"] as const

/**
 * Top-level maps that may be absent in files saved before the map existed.
 * When present they must be objects. `playgrounds` holds Sandbox trees and is
 * carried by editor-saved files.
 */
const OPTIONAL_TOP_LEVEL_KEYS = [
  "playgrounds",
  "themes",
  "font-collections",
  "icon-sets",
  "media",
] as const

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

/**
 * Parses serialized workspace JSON and checks the top-level shape before the
 * result enters the reducer pipeline. Throws with a readable message when the
 * text is not valid JSON or a required map is missing or malformed. Deeper
 * integrity is enforced by the validation and verification middleware.
 */
export function parseWorkspace(json: string): Workspace {
  const parsed: unknown = JSON.parse(json)

  if (!isPlainObject(parsed)) {
    throw new Error("Workspace file must contain a JSON object.")
  }
  for (const key of REQUIRED_TOP_LEVEL_KEYS) {
    if (!isPlainObject(parsed[key])) {
      throw new Error(`Workspace file is missing the "${key}" map.`)
    }
  }
  for (const key of OPTIONAL_TOP_LEVEL_KEYS) {
    if (parsed[key] !== undefined && !isPlainObject(parsed[key])) {
      throw new Error(`Workspace file has a malformed "${key}" map.`)
    }
  }

  return parsed as unknown as Workspace
}
