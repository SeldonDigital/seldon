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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ChipIconicProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
}

/*****
 * Chip: ChipIconic
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ChipIconic
 *   aria-hidden="false"
 *   icon="material-star"
 * />
 * ```
 *****/
export function ChipIconic({
  className = "",
  icon = sdn.icon,
  children,
  seldonRefs,
  ...props
}: ChipIconicProps) {
  const chipIconicClassName = combineClassNames("sdn-chip-iconic", className)
  const iconProps = applyRef(
    seldonRefs,
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        },
  )

  return (
    <HTMLSpan
      className={chipIconicClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>{iconProps !== null && <Icon {...iconProps} />}</>
      )}
    </HTMLSpan>
  )
}

//
// Default property values
//
const sdn: ChipIconicProps = {
  "aria-hidden": "false",
  className: "sdn-chip-iconic sdn-chip",
  icon: {
    icon: "material-inbox",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
}
