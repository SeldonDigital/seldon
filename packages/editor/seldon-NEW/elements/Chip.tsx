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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ChipProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textLabel?: TextLabelProps | null
}

/*****
 * Chip: Chip
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Default
 *
 * @example
 * ```tsx
 * <Chip
 *   aria-hidden="false"
 *   textLabel="{}"
 * />
 * ```
 *****/
export function Chip({
  className = "",
  textLabel,
  children,
  seldonRefs,
  ...props
}: ChipProps) {
  const chipClassName = combineClassNames("sdn-chip", className)
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
      className={chipClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>{textLabel && textLabelProps && <TextLabel {...textLabelProps} />}</>
      )}
    </HTMLSpan>
  )
}

//
// Default property values
//
const sdn: ChipProps = {
  "aria-hidden": "false",
  className: "sdn-chip",
  textLabel: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
}
