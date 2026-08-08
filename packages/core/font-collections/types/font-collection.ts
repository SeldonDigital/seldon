/**
 * `StockFontCollection` — packaged collection schema in `collections/`.
 * `ComputedFontCollection` — materialized collection from `computeFontCollection`.
 */
import type { FontOrigin } from "../constants/font-origin"
import type { FontCollectionInstanceId, FontCollectionTemplateId } from "./font-collection-id"

/**
 * Descriptive metadata for one font family, captured from the vendor at font
 * generation time and committed to core. `category` is the vendor's typeface
 * class, such as `Sans Serif`. `designer` names the type designers. `description`
 * is the vendor's blurb for the family. Every field is optional, so a family with
 * no captured metadata still renders.
 */
export interface FontFamilyMeta {
  category?: string
  designer?: string
  description?: string
}

/**
 * One font family in a collection. `name` is the display label and CSS family name, such as `Inter`
 * or `System Sans`. `origin` is where the family loads from, and `local` never makes a network
 * request. `stack` is the CSS fallback stack for local families. `variants` are the weight and style
 * variants for remote families, used to build font host URLs. `category`, `designer`, and
 * `description` are the captured vendor metadata shown in the editor.
 */
export interface FontFamilyEntry {
  name: string
  origin: FontOrigin
  stack?: string
  variants?: string[]
  category?: string
  designer?: string
  description?: string
}

export interface FontCollectionMetadata<TId extends string = FontCollectionTemplateId> {
  id: TId
  name: string
  description: string
  intent: string
}

/** Slot key convention for user-added families, such as `family01`. */
export type FontCollectionCustomKey = `family${number}`

/** Family map keyed by family slot id. */
export type FontFamilyTable = Record<string, FontFamilyEntry>

/**
 * Packaged collection schema (`collections/`). `families` lists every family the collection ships.
 * `defaultEnabledFamilies`, when present, names the families enabled by default when the collection
 * is first seeded or added. Every other family starts off. Names match the `name` of a family entry.
 * `seededByDefault`, when true, seeds this collection into every new workspace alongside the
 * protected `system` base. The seeder derives its list from this flag, so adding or removing a
 * collection needs no seeder edit.
 */
export interface StockFontCollection {
  metadata: FontCollectionMetadata
  families: FontFamilyTable
  defaultEnabledFamilies?: string[]
  seededByDefault?: boolean
}

/** Complete collection in memory, including the resolved `id`. */
export type ComputedFontCollection = StockFontCollection & {
  id: FontCollectionInstanceId
}

export type FontCollection = ComputedFontCollection

/** Valid input to `computeFontCollection`: packaged schema or computed collection. */
export type FontCollectionPipelineInput = StockFontCollection | ComputedFontCollection
