import { themeSwatchToColorValue } from "../../../helpers/color/theme-swatch-to-color-value"
import { getThemeOption } from "../../../helpers/theme/get-theme-option"
import { isCompoundValue } from "../../../helpers/type-guards/compound/is-compound-value"
import { isAtomicValue } from "../../../helpers/type-guards/value/is-atomic-value"
import { Properties, PropertyKey, ValueType } from "../../../properties"
import { AtomicValue, ThemeValue, Value } from "../../../properties/types"
import {
  Theme,
  ThemeSwatchKey,
  ThemeValueKey,
} from "../../../themes/types"
import { getWorkspaceNodes } from "../../helpers/general/get-workspace-nodes"
import { isEntryNodeForRules } from "../../helpers/rules/rules-node-subject"
import { Instance, Variant, Workspace } from "../../types"
import { mutateWorkspace } from "../shared/workspace-mutation.helper"
import { getNodeTheme } from "./theme-mutations"

/**
 * Replaces `@swatch.*` override refs with exact HSL for nodes on the given theme.
 * @param theme - The computed theme that resolves the swatch
 * @param key - The swatch token key, such as `@swatch.custom1`
 */
export function replaceSwatchRefsWithExactColor(
  theme: Theme,
  key: ThemeSwatchKey,
  workspace: Workspace,
): Workspace {
  const exactValue = themeSwatchToColorValue(
    getThemeOption(key, theme),
  ) as AtomicValue

  return mutateWorkspace(workspace, (draft) => {
    const nodes = findNodesWithThemeValue(key, draft).filter(
      (node) => getNodeTheme(node, draft) === theme.id,
    )

    for (const node of nodes) {
      if (isEntryNodeForRules(node)) {
        replaceThemeKeyInProperties(node.overrides, key, exactValue)
      }
    }
  })
}

function findNodesWithThemeValue(
  key: ThemeValueKey,
  workspace: Workspace,
): (Variant | Instance)[] {
  return Object.values(getWorkspaceNodes(workspace)).filter((node) =>
    Object.values(node.overrides).some((rawValue) =>
      valueReferencesThemeKey(rawValue as Value, key),
    ),
  ) as (Variant | Instance)[]
}

function isThemeRefValue(value: AtomicValue): value is ThemeValue {
  return (
    value.type === ValueType.THEME_CATEGORICAL ||
    value.type === ValueType.THEME_ORDINAL
  )
}

/** True when an atomic value is a theme ref pointing at `key`. */
function matchesThemeKey(value: AtomicValue, key: ThemeValueKey): boolean {
  return isThemeRefValue(value) && value.value === key
}

/** True when an atomic or compound value references the given theme token key. */
function valueReferencesThemeKey(value: Value, key: ThemeValueKey): boolean {
  if (isCompoundValue(value)) {
    return Object.values(value).some((sub: AtomicValue) =>
      matchesThemeKey(sub, key),
    )
  }
  return isAtomicValue(value) && matchesThemeKey(value, key)
}

/** Rewrites every atomic or compound facet that references `key` to `exactValue`. */
function replaceThemeKeyInProperties(
  bag: Properties,
  key: ThemeSwatchKey,
  exactValue: AtomicValue,
): void {
  for (const [propertyKey, rawValue] of Object.entries(bag)) {
    const value = rawValue as Value
    if (isCompoundValue(value)) {
      for (const [subKey, subValue] of Object.entries(value)) {
        if (matchesThemeKey(subValue, key)) {
          Object.assign(bag[propertyKey as PropertyKey]!, {
            [subKey]: exactValue,
          })
        }
      }
    } else if (isAtomicValue(value) && matchesThemeKey(value, key)) {
      Object.assign(bag, { [propertyKey]: exactValue })
    }
  }
}
