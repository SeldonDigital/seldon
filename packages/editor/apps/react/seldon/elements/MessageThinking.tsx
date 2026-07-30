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
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MessageThinkingProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  textDescription?: TextDescriptionProps | null
  textDescription2?: TextDescriptionProps | null

  textDescription3?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: MessageThinkingProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ieew",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--iklu",
    "data-seldon-ref": "hariReasoningToggle",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--kzy9",
    "data-seldon-ref": "hariReasoningChevron",
  },
  textDescription: {
    children: "Thinking...",
    className: "sdn-text-description sdn-text-description--0r1j",
    "data-seldon-ref": "hariReasoningLabel",
  },
  textDescription2: {
    children: "Clamped",
    className: "sdn-text-description sdn-text-description--aeeo",
    "data-seldon-ref": "hariReasoningClamped",
  },

  textDescription3: {
    children: "Reasoning...",
    className: "sdn-text-description sdn-text-description--choa",
    "data-seldon-ref": "hariReasoningBody",
  },
}

/**
 * Message: MessageThinking
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     ButtonIconic     buttonIconic      -> hariReasoningToggle
 *       Icon           icon              -> hariReasoningChevron
 *     TextDescription  textDescription   -> hariReasoningLabel
 *     TextDescription  textDescription2  -> hariReasoningClamped
 *   TextDescription    textDescription3  -> hariReasoningBody
 *
 * @example
 * ```tsx
 * <MessageThinking
 *   aria-hidden="false"
 *   frame="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   textDescription="{}"
 *   textDescription2="{}"
 * />
 * ```
 */
export function MessageThinking({
  className = "",
  frame,
  buttonIconic,
  icon,
  textDescription,
  textDescription2,

  textDescription3,

  children,
  seldonRefs,
  ...props
}: MessageThinkingProps) {
  const messageThinkingClassName = combineClassNames("sdn-message-thinking", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)
  const textDescription2Props = mergeOptionalSlot(
    sdn.textDescription2,
    textDescription2,
    seldonRefs,
  )

  const textDescription3Props = mergeOptionalSlot(
    sdn.textDescription3,
    textDescription3,
    seldonRefs,
  )

  return (
    <Frame className={messageThinkingClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
            {textDescription2Props !== null && <TextDescription {...textDescription2Props} />}
          </Frame>
          {textDescription3Props !== null && <TextDescription {...textDescription3Props} />}
        </>
      )}
    </Frame>
  )
}
