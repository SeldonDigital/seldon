/**
 * Font collection types — barrel only; see files for roles:
 * - `font-collection.ts` — StockFontCollection / ComputedFontCollection / FontFamilyEntry
 * - `font-collection-id.ts` — FontCollectionTemplateId / FontCollectionInstanceId
 */
export type { FontOrigin } from "../constants/font-origin"
export type {
  ComputedFontCollection,
  FontCollection,
  FontCollectionCustomKey,
  FontCollectionMetadata,
  FontCollectionPipelineInput,
  FontFamilyEntry,
  FontFamilyTable,
  StockFontCollection,
} from "./font-collection"
export type {
  FontCollectionInstanceId,
  FontCollectionTemplateId,
} from "./font-collection-id"
