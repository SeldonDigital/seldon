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

import { HTMLSpan } from "../native-react/HTML.Span"
import { TextCodeblock } from "../primitives/TextCodeblock"
import { combineClassNames } from "../utils/class-name"
import { mergeOptionalSlot } from "../utils/merge-slot"

import type { TextCodeblockProps } from "../primitives/TextCodeblock"
import type { SeldonRefs } from "../utils/merge-slot"
import type { HTMLAttributes } from "react"

export interface ChipMonoProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textCodeblock?: TextCodeblockProps | null
}

//
// Default property values
//
const sdn: ChipMonoProps = {
  "aria-hidden": "false",
  textCodeblock: {
    children: "/vlak",
    className: "sdn-text-codeblock sdn-text-codeblock--i10e",
  },
}

/**
 * Chip: ChipMono
 * Level: Element
 * Intent: Schema for a small, interactive UI element used to display information, categories, or actions with optional removal or selection states.
 * Tags: chip, ui, tag, label, badge, filter, category, pill
 * Type: Custom
 *
 * Structure:
 *   TextCodeblock  textCodeblock
 *
 * @example
 * ```tsx
 * <ChipMono
 *   aria-hidden="false"
 *   textCodeblock="{}"
 * />
 * ```
 */
export function ChipMono({
  className = "",
  textCodeblock,

  children,
  seldonRefs,
  ...props
}: ChipMonoProps) {
  const chipMonoClassName = combineClassNames("sdn-chip-mono", className)

  const textCodeblockProps = mergeOptionalSlot(sdn.textCodeblock, textCodeblock, seldonRefs)

  return (
    <HTMLSpan className={chipMonoClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>{textCodeblockProps !== null && <TextCodeblock {...textCodeblockProps} />}</>
      )}
    </HTMLSpan>
  )
}
