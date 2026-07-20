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
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MessageOutcomeProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  textDescription?: TextDescriptionProps | null
}

/*****
 * Message: MessageOutcome
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * @example
 * ```tsx
 * <MessageOutcome
 *   aria-hidden="false"
 *   frame="{}"
 *   icon="material-star"
 *   textLabel="{}"
 *   textDescription="{}"
 * />
 * ```
 *****/
export function MessageOutcome({
  className = "",
  frame = sdn.frame,
  icon,
  textLabel,
  textDescription,
  children,
  seldonRefs,
  ...props
}: MessageOutcomeProps) {
  const messageOutcomeClassName = combineClassNames(
    "sdn-message-outcome",
    className,
  )
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
      className={messageOutcomeClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {icon && iconProps && <Icon {...iconProps} />}
            {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
          </Frame>
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
const sdn: MessageOutcomeProps = {
  "aria-hidden": "false",
  className: "sdn-message-outcome sdn-message",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ieew",
  },
  icon: {
    className: "sdn-icon sdn-icon--wxt9",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  textDescription: {
    className: "sdn-text-description sdn-text-description--choa",
  },
}
