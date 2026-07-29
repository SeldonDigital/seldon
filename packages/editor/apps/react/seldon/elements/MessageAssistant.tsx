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

export interface MessageAssistantProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textDescription?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: MessageAssistantProps = {
  "aria-hidden": "false",
  textDescription: {
    children: "Assistant message",
    className: "sdn-text-description sdn-text-description--welb",
  },
}

/**
 * Message: MessageAssistant
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Custom
 *
 * Structure:
 *   TextDescription  textDescription
 *
 * @example
 * ```tsx
 * <MessageAssistant
 *   aria-hidden="false"
 *   textDescription="{}"
 * />
 * ```
 */
export function MessageAssistant({
  className = "",
  textDescription,

  children,
  seldonRefs,
  ...props
}: MessageAssistantProps) {
  const messageAssistantClassName = combineClassNames("sdn-message-assistant", className)

  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  return (
    <Frame className={messageAssistantClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>{textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}</>
      )}
    </Frame>
  )
}
