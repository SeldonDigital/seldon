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

export interface ChipAssistProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ChipAssistProps = {
  "aria-hidden": "false",
  icon: {
    icon: "material-calendarToday",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },

  textLabel: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
}

/**
 * Chip: ChipAssist
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * Structure:
 *   Icon       icon
 *   TextLabel  textLabel
 *
 * @example
 * ```tsx
 * <ChipAssist
 *   aria-hidden="false"
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 */
export function ChipAssist({
  className = "",
  icon,

  textLabel,

  children,
  seldonRefs,
  ...props
}: ChipAssistProps) {
  const chipAssistClassName = combineClassNames("sdn-chip", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <HTMLSpan className={chipAssistClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
        </>
      )}
    </HTMLSpan>
  )
}
