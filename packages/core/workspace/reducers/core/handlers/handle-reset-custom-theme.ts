import customTheme from "../../../../themes/custom"
import { ExtractPayload, Workspace } from "../../../types"

/**
 * Reset the custom theme to the default theme
 *
 * @param payload Empty payload
 * @param workspace Current workspace
 * @returns Workspace with reset custom theme
 */
export function handleResetCustomTheme(
  _payload: ExtractPayload<"reset_custom_theme">,
  workspace: Workspace,
): Workspace {
  return {
    ...workspace,
    customTheme,
  }
}
