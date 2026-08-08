import { PLATFORMS } from "@seldon/factory/export/platforms/registry"

const PLATFORM_IDS = Object.keys(PLATFORMS)

/**
 * Drops a trailing framework segment from a workspace source name, so
 * `my-app.react` and `my-app.vue` both read as `my-app`.
 *
 * The Editor writes the design source as `<label>.<framework>.json`, and the
 * framework belongs to the file name, not the workspace. When a name is derived
 * from that file, such as importing a file that carries no label, this recovers
 * the label the user actually chose.
 */
export function stripPlatformSuffix(name: string): string {
  const lastDot = name.lastIndexOf(".")

  if (lastDot < 0) return name

  const suffix = name.slice(lastDot + 1)

  return PLATFORM_IDS.includes(suffix) ? name.slice(0, lastDot) : name
}
