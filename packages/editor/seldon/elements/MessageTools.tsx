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
  frame?: FrameProps | null
  icon?: IconProps | null
  textDescription?: TextDescriptionProps | null
  frame2?: FrameProps | null
  icon2?: IconProps | null
  textDescription2?: TextDescriptionProps | null
}

/*****
 * Message: MessageTools
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * @example
 * ```tsx
 * <MessageTools
 *   aria-hidden="false"
 *   frame="{}"
 *   icon="material-star"
 *   textDescription="{}"
 *   frame2="{}"
 * />
 * ```
 *****/
export function MessageTools({
  className = "",
  frame = sdn.frame,
  icon,
  textDescription,
  frame2 = sdn.frame2,
  icon2,
  textDescription2,
  children,
  seldonRefs,
  ...props
}: MessageToolsProps) {
  const messageToolsClassName = combineClassNames("sdn-message", className)
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        },
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
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        },
  )
  const textDescription2Props = applyRef(
    seldonRefs,
    textDescription2 === null
      ? null
      : {
          ...sdn.textDescription2,
          ...textDescription2,
          className: combineClassNames(
            sdn.textDescription2?.className,
            textDescription2?.className,
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
          <Frame {...frameProps}>
            {icon && iconProps && <Icon {...iconProps} />}
            {textDescription && textDescriptionProps && (
              <TextDescription {...textDescriptionProps} />
            )}
          </Frame>
          <Frame {...frame2Props}>
            {icon2 && icon2Props && <Icon {...icon2Props} />}
            {textDescription2 && textDescription2Props && (
              <TextDescription {...textDescription2Props} />
            )}
          </Frame>
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
  className: "sdn-message sdn-message",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--fvwe",
  },
  icon: {
    className: "sdn-icon sdn-icon--nlt7",
  },
  textDescription: {
    className: "sdn-text sdn-text-description--ri62",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--fvwe",
  },
  icon2: {
    className: "sdn-icon sdn-icon--nlt7",
  },
  textDescription2: {
    className: "sdn-text sdn-text-description--ri62",
  },
}
