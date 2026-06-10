import { ComponentId, ComponentLevel, Theme, Workspace } from "@seldon/core"
import { getThemePickerOptions } from "@seldon/core/helpers/properties/properties-bridge"
import { IconId, iconLabels } from "@seldon/core/icon-sets"
import { isBoard } from "@seldon/core/workspace/helpers/components/is-board"
import { Board, Instance, Variant } from "@seldon/core/workspace/types"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { getComboboxStoredValue } from "./combobox-stored-value"
import { PropertyPickerResult, generatePropertyOptions } from "./options-utils"
import { FlatProperty } from "./properties-data"

type PropertyOptions = PropertyPickerResult["options"]
type MaybePropertyOptions = PropertyOptions | undefined

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

  // Rows that carry their own options (font collection family rows) are not
  // backed by the property schema, so use the supplied options directly.
  if (property.options) {
    return [property.options]
  }

  if (property.key === "theme") {
    return [
      getThemePickerOptions({
        workspace,
        allowInherit: !(subject && isBoard(subject)),
      }),
    ]
  }

  const componentId: ComponentId | undefined =
    subject && isBoard(subject)
      ? (getComponentKey(subject) as ComponentId)
      : subject
        ? (getNodeCatalogComponentId(subject, workspace) ?? undefined)
        : undefined
  const componentLevel: ComponentLevel | undefined =
    subject && isBoard(subject)
      ? undefined
      : (subject?.level as ComponentLevel | undefined)

  const result = generatePropertyOptions(
    property,
    theme,
    componentId,
    componentLevel,
    workspace,
    subject ?? undefined,
  )

  if (includeCurrentSymbol && property.key === "symbol" && result.options) {
    addCurrentSymbolOption(result.options, property)
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
