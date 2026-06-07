import { getComponentSchema } from "../../../../components/catalog"
import type { ComponentId } from "../../../../components/constants"
import { Properties, ValueType } from "../../../../properties"
import { validatePropertyValue } from "../../../../properties/schemas/helpers"
import { getComputedTheme } from "../../../compute"
import { check } from "../check"
import { boardValidators } from "./board"
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
      checkThemeTokenExists(propertyValue.value, workspace, themeId)
    }
    return
  }

  Object.values(value).forEach((childValue) => {
    validateThemeReferences(childValue, workspace, themeId)
  })
}

/** Checks that a `@namespace.token` reference resolves in the active theme. */
function checkThemeTokenExists(
  tokenRef: string,
  workspace: Workspace,
  themeId?: string,
): void {
  const [namespace, tokenId] = tokenRef.replace(/^@/, "").split(".")
  const theme = getComputedTheme(themeId ?? "default", workspace) as Record<
    string,
    unknown
  >
  const section = theme[namespace] as Record<string, unknown> | undefined
  check(
    Boolean(section?.[tokenId]),
    `Theme token ${tokenRef} not found in theme ${themeId ?? "default"}`,
  )
}

/** Checks an EXACT property value against the property schema. */
function assertExactValueValid(
  actualProperty: string,
  rawValue: unknown,
): void {
  if (rawValue === null || rawValue === undefined) return
  if (validatePropertyValue(actualProperty, "exact", rawValue)) return
  const rendered =
    typeof rawValue === "object" ? JSON.stringify(rawValue) : String(rawValue)
  throw new Error(`Invalid ${actualProperty} value: ${rendered}`)
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

      if (value.type === ValueType.EXACT && "value" in value) {
        assertExactValueValid(getActualPropertyName(key), value.value)
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
