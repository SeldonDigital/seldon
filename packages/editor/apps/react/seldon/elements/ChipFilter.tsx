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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ChipFilterProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * Chip: ChipFilter
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ChipFilter
 *   aria-hidden="false"
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 *****/
export function ChipFilter({
  className = "",
  icon = sdn.icon,
  textLabel,
  children,
  seldonRefs,
  ...props
}: ChipFilterProps) {
  const chipFilterClassName = combineClassNames("sdn-chip-filter", className)
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
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )

  return (
    <HTMLSpan
      className={chipFilterClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
        </>
      )}
    </HTMLSpan>
  )
}

//
// Default property values
//
const sdn: ChipFilterProps = {
  "aria-hidden": "false",
  className: "sdn-chip-filter sdn-chip",
  icon: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
}
