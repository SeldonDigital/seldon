/**
 * Untagged objects that appear as the compound branch of {@link Value}.
 * Border and font shapes match the full stored object on `Properties` for those keys.
 * Background, gradient, and shadow shapes match one layer inside the node's array, not the whole array.
 */
import {
  BackgroundLayer,
  BoardCompound,
  BorderCompound,
  FontCompound,
  GradientCompound,
  ShadowCompound,
} from "../values"

/** One stored border, font, or board facet map. */
export type ObjectFacetCompoundValue =
  | BorderCompound
  | FontCompound
  | BoardCompound

/** One layer in a background, gradient, or shadow list. */
export type PaintStackLayerValue =
  | BackgroundLayer
  | GradientCompound
  | ShadowCompound

/** Union of facet maps and single paint layers for the compound branch of {@link Value}. */
export type CompoundBranchPayload =
  | ObjectFacetCompoundValue
  | PaintStackLayerValue
