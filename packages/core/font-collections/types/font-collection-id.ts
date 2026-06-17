/**
 * Packaged font collection catalog ids (`FontCollectionTemplateId`).
 *
 * **`FontCollectionTemplateId`** — Use these exact strings as the suffix in `catalog:{id}`
 * template references. They match `metadata.id` on packaged collections under
 * `font-collections/catalog/`.
 *
 * **`FontCollectionInstanceId`** — Models the catalog identity of a computed collection.
 * In a workspace file, board collection refs and keys in the `font-collections` map are
 * opaque strings (for example `font-collection-system-default`).
 */

export type FontCollectionTemplateId = "system" | "googleFonts"

export type FontCollectionInstanceId = FontCollectionTemplateId
