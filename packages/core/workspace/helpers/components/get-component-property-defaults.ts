import { getComponentSchema } from "../../../components/catalog"
import { ComponentId } from "../../../components/constants"
import type { Properties } from "../../../properties/types/properties"

/**
 * Baseline `Properties` for a workspace board row before merging `componentProperties`.
 */
export function getComponentPropertyDefaults(): Properties {
  return getComponentSchema(ComponentId.BOARD).properties
}
