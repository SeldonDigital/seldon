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

import { Frame } from "../frames/Frame"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface MessageProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textDescription?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: MessageProps = {
  "aria-hidden": "false",
  textDescription: {
    className: "sdn-text-description sdn-text-description--welb",
  },
}

/**
 * Message: Message
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Default
 *
 * Structure:
 *   TextDescription  textDescription
 *
 * @example
 * ```tsx
 * <Message
 *   aria-hidden="false"
 *   textDescription="{}"
 * />
 * ```
 */
export function Message({
  className = "",
  textDescription,

  children,
  seldonRefs,
  ...props
}: MessageProps) {
  const messageClassName = combineClassNames("sdn-message", className)

  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  return (
    <Frame className={messageClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>{textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}</>
      )}
    </Frame>
  )
}
