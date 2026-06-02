/**
 * `StockFontCollection` — packaged collection schema in `collections/`.
 * `ComputedFontCollection` — materialized collection from `computeFontCollection`.
 */
import type { FontOrigin } from "../constants/font-origin"
import type {
  FontCollectionInstanceId,
  FontCollectionTemplateId,
} from "./font-collection-id"

/** One font family in a collection. */
export interface FontFamilyEntry {
  /** Display label and CSS family name, such as `Inter` or `System Sans`. */
  name: string
  /** Where the family loads from. `local` never makes a network request. */
  origin: FontOrigin
  /** CSS fallback stack for local families. */
  stack?: string
  /** Weight and style variants for remote families. Used to build font host URLs. */
  variants?: string[]
}

export interface FontCollectionMetadata<
  TId extends string = FontCollectionTemplateId,
> {
  id: TId
  name: string
  description: string
  intent: string
}

/** Slot key convention for user-added families, such as `family01`. */
export type FontCollectionCustomKey = `family${number}`

/** Family map keyed by family slot id. */
export type FontFamilyTable = Record<string, FontFamilyEntry>

/** Packaged collection schema (`collections/`). */
export interface StockFontCollection {
  metadata: FontCollectionMetadata
  families: FontFamilyTable
}

/** Complete collection in memory, including the resolved `id`. */
export type ComputedFontCollection = StockFontCollection & {
  id: FontCollectionInstanceId
}

export type FontCollection = ComputedFontCollection

/** Valid input to `computeFontCollection`: packaged schema or computed collection. */
export type FontCollectionPipelineInput =
  | StockFontCollection
  | ComputedFontCollection
