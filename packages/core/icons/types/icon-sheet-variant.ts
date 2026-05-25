import type { ComponentId, ComponentLevel } from "../../components/constants"
import type { IconId } from "../../icons"
import type { Properties } from "../../properties/types/properties"
import type { VariantId } from "@seldon/core/workspace/helpers/rules/workspace-node-ids"

/**
 * Icon-set sheet variant row used by icon-set helpers until icon boards use EntryNode only.
 */
export interface IconSheetVariant {
  id: VariantId
  type: "iconSheet"
  component: ComponentId
  level: ComponentLevel
  theme: string | null
  isChild: boolean
  fromSchema: boolean
  label: string
  properties: Properties
  __editor?: Record<string, unknown>
  children: string[]
  includedIcons: IconId[]
}

export function isIconSheetVariant(node: unknown): node is IconSheetVariant {
  return (
    typeof node === "object" &&
    node !== null &&
    (node as { type?: unknown }).type === "iconSheet"
  )
}
