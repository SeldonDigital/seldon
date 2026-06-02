import { ComponentId } from "@seldon/core/components/constants"
import { createEmptyWorkspace } from "@seldon/core/workspace/helpers/create-empty-workspace"
import { addComponent } from "@seldon/core/workspace/reducers/handlers/add/add-component"
import type { Workspace } from "@seldon/core/workspace/types"

type CalendarPreviewBase = {
  workspace: Workspace
  rootId: string | null
}

let cached: CalendarPreviewBase | null = null

/**
 * Builds a throwaway workspace containing a single Calendar board and its nodes.
 *
 * The result is deterministic, so it is instantiated once and cached. Font
 * collection board previews clone this base and point the Calendar root at a board theme.
 */
export function getCalendarPreviewBase(): CalendarPreviewBase {
  if (cached) {
    return cached
  }

  const workspace = addComponent(
    { componentId: ComponentId.CALENDAR },
    createEmptyWorkspace(),
  )
  const board = workspace.components[ComponentId.CALENDAR]
  const rootId = board?.variants?.[0]?.id ?? null

  cached = { workspace, rootId }
  return cached
}
