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
 * Packaged icon set schema. Lists every icon the set ships and the categories enabled by default
 * when the set is first added to a workspace.
 *
 * `source` is the shipped component set these icons come from, such as `seldon`. `icons` is every
 * icon id available in this set. `defaultEnabledCategories` are the categories enabled by default,
 * and icons in other categories start off. `defaultEnabledIcons`, when present, defines the default
 * inclusion by icon id and supersedes `defaultEnabledCategories`. `seededByDefault`, when true, seeds
 * this set into every new workspace alongside the protected `seldonIcons` base. The seeder derives
 * its list from this flag, so adding or removing a set needs no seeder edit.
 */
export interface StockIconSet {
  metadata: IconSetMetadata
  source: IconSetId
  icons: IconId[]
  defaultEnabledCategories: IconCategory[]
  defaultEnabledIcons?: IconId[]
  seededByDefault?: boolean
}

/** A computed icon set. Adds the resolved catalog `id`. */
export type ComputedIconSet = StockIconSet & { id: IconSetInstanceId }

/** Alias for a fully computed icon set. */
export type IconSet = ComputedIconSet

/** Valid input to `computeIconSet`. */
export type IconSetPipelineInput = StockIconSet | ComputedIconSet
