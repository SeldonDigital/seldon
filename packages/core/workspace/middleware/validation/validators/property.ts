import { getComponentSchema } from "../../../../components/catalog"
import type { ComponentId } from "../../../../components/constants"
import { Properties } from "../../../../properties"
import { collectPropertyValueErrors } from "../../../../properties/schemas/helpers"
import type { Theme } from "../../../../themes/types"
import { getComputedTheme } from "../../../compute"
import { DEFAULT_THEME_ID } from "../../../constants"
import type { Workspace } from "../../../types"
import { check } from "../check"
import { boardValidators } from "./board"

export const propertyValidators = {
  values: (properties: Properties, workspace?: Workspace, themeId?: string) => {
    const theme = workspace
      ? (getComputedTheme(
          themeId ?? DEFAULT_THEME_ID,
          workspace,
        ) as unknown as Theme)
      : undefined

    for (const [key, value] of Object.entries(properties)) {
      const errors = collectPropertyValueErrors(key, value, theme)
      if (errors.length > 0) {
        const first = errors[0]!
        check(false, `Invalid property ${first.path}: ${first.reason}`)
      }
    }
  },
  keys: (
    properties: Properties,
    componentId: ComponentId,
    board?: { type: string },
  ) => {
    const allowedKeys = boardValidators.allowedPropertyKeys(componentId, board)
    const schema = getComponentSchema(componentId)

    for (const key of Object.keys(properties)) {
      const actualProperty = key.split(".")[0]
      check(
        allowedKeys.has(actualProperty),
        `Property ${actualProperty} is not valid for ${schema.name}`,
      )
    }
  },
}
