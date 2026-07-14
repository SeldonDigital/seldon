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
import { Icon, IconProps } from "../primitives/Icon"
import {
  TextDescription,
  TextDescriptionProps,
} from "../primitives/TextDescription"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MessageToolsProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  textDescription?: TextDescriptionProps | null
}

/*****
 * Message: MessageTools
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Custom
 *
 * @example
 * ```tsx
 * <MessageTools
 *   aria-hidden="false"
 *   icon="material-star"
 *   textDescription="{}"
 * />
 * ```
 *****/
export function MessageTools({
  className = "",
  icon,
  textDescription,
  children,
  seldonRefs,
  ...props
}: MessageToolsProps) {
  const messageToolsClassName = combineClassNames(
    "sdn-message-tools",
    className,
  )
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
      className={messageToolsClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {icon && iconProps && <Icon {...iconProps} />}
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
const sdn: MessageToolsProps = {
  "aria-hidden": "false",
  className: "sdn-message-tools sdn-message",
  icon: {
    className: "sdn-icon sdn-icon--9ouj",
  },
  textDescription: {
    className: "sdn-text sdn-text-description--hqun",
  },
}
