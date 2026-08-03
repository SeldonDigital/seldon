/*****
 *
 * This code was generated using Seldon (https://github.com/SeldonDigital/seldon)
 *
 * License: https://github.com/SeldonDigital/seldon/blob/main/LICENSE.md
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it, in whole or in part,
 * for the purposes of training, fine-tuning, or otherwise improving (directly or indirectly)
 * any machine learning or artificial intelligence system without written permission.
 *
 *****/

import { HTMLAttributes } from "react"

import { HTMLSpan } from "../native-react/HTML.Span"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ChipInputProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null

  icon?: IconProps | null
}

//
// Default property values
//
const sdn: ChipInputProps = {
  "aria-hidden": "false",
  textLabel: {
    children: "Input",
    className: "sdn-text-label sdn-text-label--lug5",
  },

  icon: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },
}

/**
 * Chip: ChipInput
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * Structure:
 *   TextLabel  textLabel
 *   Icon       icon
 *
 * @example
 * ```tsx
 * <ChipInput
 *   aria-hidden="false"
 *   textLabel="{}"
 *   icon="material-star"
 * />
 * ```
 */
export function ChipInput({
  className = "",
  textLabel,

  icon,

  children,
  seldonRefs,
  ...props
}: ChipInputProps) {
  const chipInputClassName = combineClassNames("sdn-chip", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  return (
    <HTMLSpan className={chipInputClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          {iconProps !== null && <Icon {...iconProps} />}
        </>
      )}
    </HTMLSpan>
  )
}
