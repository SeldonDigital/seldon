import {
  ComponentId,
  ComponentLevel,
  HtmlElement,
  Theme,
  Workspace,
} from "@seldon/core"
import { getThemePickerOptions } from "@seldon/core/helpers/properties/properties-bridge"
import { IconId, iconLabels } from "@seldon/core/icon-sets"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { getNodeProperties } from "@seldon/core/workspace/helpers/nodes/get-node-properties"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import { getNodeCatalogComponentId } from "@seldon/editor/lib/workspace/node-tree"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { getComboboxStoredValue } from "@seldon/editor/lib/properties/combobox-stored-value"
import { PropertyPickerResult, generatePropertyOptions } from "./options-utils"
import { FlatProperty } from "./properties-data"
import { getRepeatSymbolDescendant } from "./repeat-display"

type PropertyOptions = PropertyPickerResult["options"]
type MaybePropertyOptions = PropertyOptions | undefined

// Ordered lists number their items, so they only expose counter-style markers.
// Unordered lists expose bullet-style markers. "none" plus Default/Inherit stay
// available to both.
const ORDERED_LIST_STYLE_TYPES = new Set([
  "decimal",
  "decimal-leading-zero",
  "lower-alpha",
  "upper-alpha",
  "lower-roman",
  "upper-roman",
])
const UNORDERED_LIST_STYLE_TYPES = new Set(["disc", "circle", "square"])

/**
 * Restricts listStyleType marker options to those relevant for the list kind.
 * The merged List component renders as ol or ul depending on its htmlElement
 * value, so the marker family is chosen from that value. Default (""), Inherit,
 * and None remain available regardless of kind.
 */
function filterListStyleTypeOptions(
  options: PropertyOptions,
  componentId: ComponentId | undefined,
  htmlElementValue: HtmlElement | undefined,
): PropertyOptions {
  if (componentId !== ComponentId.LIST) {
    return options
  }
  let allowed: Set<string> | null = null
  if (htmlElementValue === HtmlElement.OL) {
    allowed = ORDERED_LIST_STYLE_TYPES
  } else if (htmlElementValue === HtmlElement.UL) {
    allowed = UNORDERED_LIST_STYLE_TYPES
  }
  if (!allowed) {
    return options
  }
  return options
    .map((group) =>
      group.filter(
        (option) =>
          option.value === "" ||
          option.value === "inherit" ||
          option.value === "none" ||
          allowed.has(option.value),
      ),
    )
    .filter((group) => group.length > 0)
}

interface BuildPropertyOptionsInput {
  property: FlatProperty
  theme?: Theme
  workspace: Workspace
  subject: Variant | Instance | Board | undefined
  /**
   * Keep the current symbol selectable even when it is turned off in its icon
   * set, so the row can still display it. Only the symbol picker needs this.
   */
  includeCurrentSymbol?: boolean
}

/**
 * Builds grouped picker options for a property row. Shared by the property row
 * (for display-value matching) and the property control (for the combobox).
 * Returns undefined when the property has no combo or menu control.
 */
export function buildPropertyOptions({
  property,
  theme,
  workspace,
  subject,
  includeCurrentSymbol = false,
}: BuildPropertyOptionsInput): MaybePropertyOptions {
  if (
    !property.controlType ||
    (property.controlType !== "combo" && property.controlType !== "menu")
  ) {
    return undefined
  }

  // A repeat echo symbol row edits the `symbol` of an icon descendant. Resolve
  // it to the real symbol property against that descendant so every symbol path
  // below (options, current value, icon glyphs) runs unchanged.
  const repeatSymbolDescendant = getRepeatSymbolDescendant(
    property.key,
    workspace,
  )
  const effectiveProperty = repeatSymbolDescendant
    ? { ...property, key: "symbol" }
    : property
  const effectiveSubject = repeatSymbolDescendant ?? subject

  // Rows that carry their own options (font collection family rows) are not
  // backed by the property schema, so use the supplied options directly.
  if (effectiveProperty.options) {
    return [effectiveProperty.options]
  }

  if (effectiveProperty.key === "theme") {
    return [
      getThemePickerOptions({
        workspace,
        allowInherit: !(effectiveSubject && isBoard(effectiveSubject)),
      }),
    ]
  }

  const componentId: ComponentId | undefined =
    effectiveSubject && isBoard(effectiveSubject)
      ? (getComponentKey(effectiveSubject) as ComponentId)
      : effectiveSubject
        ? (getNodeCatalogComponentId(effectiveSubject, workspace) ?? undefined)
        : undefined
  const componentLevel: ComponentLevel | undefined =
    effectiveSubject && isBoard(effectiveSubject)
      ? undefined
      : (effectiveSubject?.level as ComponentLevel | undefined)

  const result = generatePropertyOptions(
    effectiveProperty,
    theme,
    componentId,
    componentLevel,
    workspace,
    effectiveSubject ?? undefined,
  )

  if (
    includeCurrentSymbol &&
    effectiveProperty.key === "symbol" &&
    result.options
  ) {
    addCurrentSymbolOption(result.options, effectiveProperty)
  }

  if (effectiveProperty.key === "listStyleType" && result.options) {
    const htmlElementValue =
      effectiveSubject && !isBoard(effectiveSubject)
        ? (getNodeProperties(effectiveSubject, workspace).htmlElement?.value as
            | HtmlElement
            | undefined)
        : undefined
    result.options = filterListStyleTypeOptions(
      result.options,
      componentId,
      htmlElementValue,
    )
  }

  return result.options
}

/**
 * The symbol picker lists only enabled icons. Keep the current value selectable
 * even when it is turned off so the row still shows it.
 */
function addCurrentSymbolOption(
  options: PropertyOptions,
  property: FlatProperty,
): void {
  const currentId = getComboboxStoredValue(property.value)
  if (typeof currentId !== "string" || currentId.length === 0) {
    return
  }

  const groups = options as Array<Array<{ value: string; name: string }>>
  const present = groups.some((group) =>
    group.some((option) => option.value === currentId),
  )
  if (present) {
    return
  }

  const synthetic = {
    value: currentId,
    name: iconLabels[currentId as IconId] ?? currentId,
  }
  if (groups.length > 0) {
    groups[groups.length - 1] = [...groups[groups.length - 1], synthetic]
  } else {
    groups.push([synthetic])
  }
}
