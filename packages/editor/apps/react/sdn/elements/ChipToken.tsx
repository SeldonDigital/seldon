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

import { Frame, FrameProps } from "../frames/Frame"
import { HTMLSpan } from "../native-react/HTML.Span"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ChipTokenProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ChipTokenProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--cysn",
  },
  textLabel: {
    children: "Token Name",
    className: "sdn-text-label sdn-text-label--sh8c",
  },
  textLabel2: {
    children: "16px · 1rem",
    className: "sdn-text-label sdn-text-label--qqqg",
  },
}

/**
 * Chip: ChipToken
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Inline
 *
 * Structure:
 *   Frame        frame
 *     TextLabel  textLabel
 *     TextLabel  textLabel2
 *
 * @example
 * ```tsx
 * <ChipToken
 *   aria-hidden="false"
 *   frame="{}"
 *   textLabel="{}"
 *   textLabel2="{}"
 * />
 * ```
 */
export function ChipToken({
  className = "",
  frame,
  textLabel,
  textLabel2,

  children,
  seldonRefs,
  ...props
}: ChipTokenProps) {
  const chipTokenClassName = combineClassNames("sdn-chip-token", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <HTMLSpan className={chipTokenClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
          </Frame>
        </>
      )}
    </HTMLSpan>
  )
}
