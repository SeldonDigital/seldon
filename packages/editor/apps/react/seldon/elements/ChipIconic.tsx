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
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface ChipIconicProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null
}

//
// Default property values
//
const sdn: ChipIconicProps = {
  "aria-hidden": "false",
  icon: {
    icon: "material-inbox",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
}

/**
 * Chip: ChipIconic
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * Structure:
 *   Icon  icon
 *
 * @example
 * ```tsx
 * <ChipIconic
 *   aria-hidden="false"
 *   icon="material-star"
 * />
 * ```
 */
export function ChipIconic({
  className = "",
  icon,

  children,
  seldonRefs,
  ...props
}: ChipIconicProps) {
  const chipIconicClassName = combineClassNames("sdn-chip-iconic", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  return (
    <HTMLSpan className={chipIconicClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? children : <>{iconProps !== null && <Icon {...iconProps} />}</>}
    </HTMLSpan>
  )
}
