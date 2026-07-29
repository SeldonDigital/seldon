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
import { Text, TextProps } from "../primitives/Text"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface HeaderActionProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  textTitle?: TextTitleProps | null
  text?: TextProps | null
}

//
// Default property values
//
const sdn: HeaderActionProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--khlc",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-label--yqnd",
  },
  text: {
    className: "sdn-text sdn-text--5rcy",
  },
}

/**
 * Header: HeaderAction
 * Level: Element
 * Intent: Arranges header content. The card variant groups identity and a primary action; the action variant groups title text with a set of action controls.
 * Tags: header, card, actions, layout, UI, group, toolbar, summary
 * Type: Inline
 *
 * Structure:
 *   Frame        frame
 *     TextTitle  textTitle
 *     Text       text
 *
 * @example
 * ```tsx
 * <HeaderAction
 *   aria-hidden="false"
 *   frame="{}"
 *   textTitle="Product Title"
 *   text2="{}"
 * />
 * ```
 */
export function HeaderAction({
  className = "",
  frame,
  textTitle,
  text,

  children,
  seldonRefs,
  ...props
}: HeaderActionProps) {
  const headerActionClassName = combineClassNames("sdn-header", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const textProps = mergeOptionalSlot(sdn.text, text, seldonRefs)

  return (
    <Frame className={headerActionClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textTitleProps !== null && <TextTitle {...textTitleProps} />}
            {textProps !== null && <Text {...textProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
