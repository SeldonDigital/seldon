import { ComponentId } from "../../../components/constants"
import { buildComponentAddPlan } from "./component-add-plan"

/**
 * Collects all descendant component IDs a board add materializes, with parents
 * before their children. Thin wrapper over the unified planner so the board set
 * always matches the instantiation plans.
 * @param componentId - The root component ID to traverse
 * @returns Array of component IDs with parents before children
 */
export function getComponentDescendantIds(
  componentId: ComponentId,
  variantFallbacks?: ReadonlySet<string>,
): ComponentId[] {
  return buildComponentAddPlan(componentId, variantFallbacks)
    .orderedComponentIds
}
