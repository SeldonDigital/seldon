export type ImageUploadTarget = "source" | "background-image"

/**
 * Maps a property key to its image upload target. Covers the top-level `source`
 * attribute and a background `image` facet at any layer index. Returns `null`
 * for keys that carry no image upload, so callers share one definition of
 * "this row sets an image".
 */
export function imageUploadTargetForKey(
  propertyKey: string,
): ImageUploadTarget | null {
  if (propertyKey === "source") return "source"
  if (
    propertyKey === "background.image" ||
    /^background\.\d+\.image$/.test(propertyKey)
  ) {
    return "background-image"
  }
  return null
}
