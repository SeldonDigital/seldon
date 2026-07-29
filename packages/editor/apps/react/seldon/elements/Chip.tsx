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
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface ChipProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ChipProps = {
  "aria-hidden": "false",
  textLabel: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
}

/**
 * Chip: Chip
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Default
 *
 * Structure:
 *   TextLabel  textLabel
 *
 * @example
 * ```tsx
 * <Chip
 *   aria-hidden="false"
 *   textLabel="{}"
 * />
 * ```
 */
export function Chip({
  className = "",
  textLabel,

  children,
  seldonRefs,
  ...props
}: ChipProps) {
  const chipClassName = combineClassNames("sdn-chip", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <HTMLSpan className={chipClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>{textLabelProps !== null && <TextLabel {...textLabelProps} />}</>
      )}
    </HTMLSpan>
  )
}
