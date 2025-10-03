import { produce } from "immer"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Set a value in the dimension section of the custom theme
 *
 * @param payload Contains the key and value to set in the dimension section
 * @param workspace Current workspace
 * @returns Workspace with updated custom theme dimension section
 */
export function handleSetCustomThemeDimensionValue(
  payload: ExtractPayload<"set_custom_theme_dimension_value">,
  workspace: Workspace,
): Workspace {
  return produce(workspace, (draft) => {
    draft.customTheme.dimension[payload.key].parameters = {
      ...draft.customTheme.dimension[payload.key].parameters,
      ...payload.value,
    }
  })
}
