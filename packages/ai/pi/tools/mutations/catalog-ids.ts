import { catalog } from "@seldon/core/components/catalog"

/** Every component catalog id add_component and insert_component accept. */
function allCatalogIds(): string[] {
  return [
    ...catalog.frames,
    ...catalog.primitives,
    ...catalog.elements,
    ...catalog.parts,
    ...catalog.modules,
    ...catalog.screens,
  ].map((schema) => schema.id)
}

/** Lowercased, alphanumeric-only form so casing and separators do not matter. */
function normalize(id: string): string {
  return id.toLowerCase().replace(/[^a-z0-9]/g, "")
}

export interface CatalogIdResolution {
  /** The real catalog id to use, present unless the id is unresolvable. */
  id?: string
  /** Set when `id` was corrected from a near miss, e.g. "media-card". */
  note?: string
  /** Set when the id is unknown; return this to the model instead of acting. */
  message?: string
}

/**
 * Resolves a model-supplied catalog id to a real one so a formatting slip does
 * not become a hard "schema not found" rejection. An exact match passes through.
 * A near miss with the same letters but different casing or separators, such as
 * "media-card" for "mediaCard", is corrected and flagged with a note. An id with
 * no match returns a message telling the model to pick an exact id from
 * list_catalog_ids.
 */
export function resolveCatalogId(catalogId: string): CatalogIdResolution {
  const ids = allCatalogIds()
  if (ids.includes(catalogId)) return { id: catalogId }

  const wanted = normalize(catalogId)
  const near = ids.find((id) => normalize(id) === wanted)
  if (near) {
    return {
      id: near,
      note: `Corrected catalog id "${catalogId}" to "${near}".`,
    }
  }
  return {
    message: `Unknown catalog id "${catalogId}". It is not in the catalog. Call list_catalog_ids and pass an exact id from that list.`,
  }
}
