import type { IconId } from "../../icon-sets"
import type { IconCategory } from "../constants/categories"
import type { IconSetInstanceId, IconSetTemplateId } from "./icon-set-id"
import type { IconSetId } from "./icon-source"

/** Identity and description of a packaged icon set. */
export interface IconSetMetadata<TId extends string = IconSetTemplateId> {
  id: TId
  name: string
  description: string
  intent: string
}

/**
 * Packaged icon set schema. Lists every icon the set ships and the categories
 * enabled by default when the set is first added to a workspace.
 */
export interface StockIconSet {
  metadata: IconSetMetadata
  /** Shipped component set these icons come from, such as `seldon`. */
  source: IconSetId
  /** Every icon id available in this set. */
  icons: IconId[]
  /** Categories enabled by default. Icons in other categories start off. */
  defaultEnabledCategories: IconCategory[]
  /**
   * Icon ids enabled by default. When present this list defines the default
   * inclusion and supersedes `defaultEnabledCategories`.
   */
  defaultEnabledIcons?: IconId[]
}

/** A computed icon set. Adds the resolved catalog `id`. */
export type ComputedIconSet = StockIconSet & { id: IconSetInstanceId }

/** Alias for a fully computed icon set. */
export type IconSet = ComputedIconSet

/** Valid input to `computeIconSet`. */
export type IconSetPipelineInput = StockIconSet | ComputedIconSet
