import { getComponentSchema } from "../../../../components/catalog"
import type { ComponentId } from "../../../../components/constants"
import { Properties, ValueType } from "../../../../properties"
import { validatePropertyValue } from "../../../../properties/schemas/helpers"
import { getComputedTheme } from "../../../compute"
import { check } from "../check"
import { componentValidators } from "./component"
import type { Workspace } from "../../../types"

function getActualPropertyName(propertyKey: string): string {
  if (propertyKey.includes(".")) {
    const parts = propertyKey.split(".")
    return parts[parts.length - 1]
  }
  return propertyKey
}

function validateThemeReferences(
  value: unknown,
  workspace?: Workspace,
  themeId?: string,
): void {
  if (!workspace || !value || typeof value !== "object") return

  if (Array.isArray(value)) {
    value.forEach((item) => validateThemeReferences(item, workspace, themeId))
    return
  }

  if ("type" in value) {
    const propertyValue = value as { type?: unknown; value?: unknown }

    if (
      (propertyValue.type === ValueType.THEME_CATEGORICAL ||
        propertyValue.type === ValueType.THEME_ORDINAL) &&
      typeof propertyValue.value === "string"
    ) {
      const [namespace, tokenId] = propertyValue.value
        .replace(/^@/, "")
        .split(".")
      const theme = getComputedTheme(themeId ?? "default", workspace) as Record<
        string,
        unknown
      >
      const section = theme[namespace] as Record<string, unknown> | undefined
      check(
        Boolean(section?.[tokenId]),
        `Theme token ${propertyValue.value} not found in theme ${themeId ?? "default"}`,
      )
    }

    return
  }

  Object.values(value).forEach((childValue) => {
    validateThemeReferences(childValue, workspace, themeId)
  })
}

export const propertyValidators = {
  values: (
    properties: Properties,
    workspace?: Workspace,
    themeId?: string,
  ) => {
    for (const [key, value] of Object.entries(properties)) {
      validateThemeReferences(value, workspace, themeId)
      if (!value || typeof value !== "object" || !("type" in value)) continue

      const actualProperty = getActualPropertyName(key)
      const valueType = value.type

      if (
        valueType === ValueType.EXACT &&
        "value" in value &&
        value.value !== null &&
        value.value !== undefined &&
        !validatePropertyValue(actualProperty, "exact", value.value)
      ) {
        const rendered =
          typeof value.value === "object"
            ? JSON.stringify(value.value)
            : String(value.value)
        throw new Error(`Invalid ${actualProperty} value: ${rendered}`)
      }
    }
  },
  keys: (
    properties: Properties,
    componentId: ComponentId,
    board?: { type: string },
  ) => {
    const allowedKeys = componentValidators.allowedPropertyKeys(
      componentId,
      board,
    )

    for (const key of Object.keys(properties)) {
      const actualProperty = key.split(".")[0]
      const schema = getComponentSchema(componentId)
      check(
        allowedKeys.has(actualProperty),
        `Property ${actualProperty} is not valid for ${schema.name}`,
      )
    }
  },
}

export { validateThemeReferences }
