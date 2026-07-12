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
import {
  TextDescription,
  TextDescriptionProps,
} from "../primitives/TextDescription"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MessageUserProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  textDescription?: TextDescriptionProps | null
}

/*****
 * Message: MessageUser
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Custom
 *
 * @example
 * ```tsx
 * <MessageUser
 *   aria-hidden="false"
 *   textDescription="{}"
 * />
 * ```
 *****/
export function MessageUser({
  className = "",
  textDescription,
  children,
  seldonRefs,
  ...props
}: MessageUserProps) {
  const messageUserClassName = combineClassNames("sdn-message-user", className)
  const textDescriptionProps = applyRef(
    seldonRefs,
    textDescription === null
      ? null
      : {
          ...sdn.textDescription,
          ...textDescription,
          className: combineClassNames(
            sdn.textDescription?.className,
            textDescription?.className,
          ),
        },
  )

  return (
    <Frame
      className={messageUserClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {textDescription && textDescriptionProps && (
            <TextDescription {...textDescriptionProps} />
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: MessageUserProps = {
  "aria-hidden": "false",
  className: "sdn-message-user sdn-message",
  textDescription: {
    className: "sdn-text sdn-text-title--noun",
  },
}
