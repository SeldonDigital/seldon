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
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import {
  TextDescription,
  TextDescriptionProps,
} from "../primitives/TextDescription"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface MessageThinkingProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  textDescription?: TextDescriptionProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  textDescription2?: TextDescriptionProps | null
}

/*****
 * Message: MessageThinking
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * @example
 * ```tsx
 * <MessageThinking
 *   aria-hidden="false"
 *   frame="{}"
 *   textDescription="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 * />
 * ```
 *****/
export function MessageThinking({
  className = "",
  frame = sdn.frame,
  textDescription,
  buttonIconic,
  icon = sdn.icon,
  textDescription2,
  children,
  seldonRefs,
  ...props
}: MessageThinkingProps) {
  const messageThinkingClassName = combineClassNames(
    "sdn-message-thinking",
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
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
          ),
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
      className={messageThinkingClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textDescription && textDescriptionProps && (
              <TextDescription {...textDescriptionProps} />
            )}
            {buttonIconic && buttonIconicProps && (
              <ButtonIconic {...buttonIconicProps} icon={iconProps} />
            )}
          </Frame>
          {textDescription2 && textDescription2Props && (
            <TextDescription {...textDescription2Props} />
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: MessageThinkingProps = {
  "aria-hidden": "false",
  className: "sdn-message-thinking sdn-message",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ieew",
  },
  textDescription: {
    className: "sdn-text sdn-text-description--0r1j",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--iklu",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kzy9",
  },
  textDescription2: {
    className: "sdn-text sdn-text-description--choa",
  },
}
