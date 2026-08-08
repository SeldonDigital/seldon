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
import { Icon, IconProps } from "../primitives/Icon"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MessageToolsUsedProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  icon?: IconProps | null
  textDescription?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: MessageToolsUsedProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ntc3",
  },
  icon: {
    icon: "material-build",
    className: "sdn-icon sdn-icon--rdh1",
    "data-seldon-ref": "hariToolIcon",
  },
  textDescription: {
    children: "Tool",
    className: "sdn-text-description sdn-text-label--y8ur",
    "data-seldon-ref": "hariToolText",
  },
}

/**
 * Message: MessageToolsUsed
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     Icon             icon             -> hariToolIcon
 *     TextDescription  textDescription  -> hariToolText
 *
 * @example
 * ```tsx
 * <MessageToolsUsed
 *   aria-hidden="false"
 *   frame="{}"
 *   icon="material-star"
 *   textDescription="{}"
 * />
 * ```
 */
export function MessageToolsUsed({
  className = "",
  frame,
  icon,
  textDescription,

  children,
  seldonRefs,
  ...props
}: MessageToolsUsedProps) {
  const messageToolsUsedClassName = combineClassNames("sdn-message-tools-used", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  return (
    <Frame className={messageToolsUsedClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {iconProps !== null && <Icon {...iconProps} />}
            {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
