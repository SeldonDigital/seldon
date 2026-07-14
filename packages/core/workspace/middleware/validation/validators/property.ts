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
    options?: { rejectDottedKeys?: boolean },
  ) => {
    const allowedKeys = boardValidators.allowedPropertyKeys(componentId, board)
    const schema = getComponentSchema(componentId)

    for (const key of Object.keys(properties)) {
      // A property write addresses a top-level key; facets live inside the value
      // as a nested object or a layer array, never in the key. mergeProperties
      // stores a dotted key verbatim and compute then ignores it, so a set write
      // with a dotted key resolves to nothing. Reject it with the nested shape to
      // use, rather than accept a silent no-op. Reset actions pass a top-level
      // propertyKey and keep the lenient path.
      if (options?.rejectDottedKeys && key.includes(".")) {
        const [root, ...rest] = key.split(".")
        check(
          false,
          `Property "${key}" must be a top-level key on ${schema.name}. Write the facet nested: { "${root}": { "${rest.join(".")}": <value> } }.`,
        )
      }
      const actualProperty = key.split(".")[0]
      check(
        allowedKeys.has(actualProperty),
        `Property ${actualProperty} is not valid for ${schema.name}`,
      )
    }
  },
}
