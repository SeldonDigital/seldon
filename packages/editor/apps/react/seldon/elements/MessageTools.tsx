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
import { Icon, IconProps } from "../primitives/Icon"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MessageToolsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  textDescription?: TextDescriptionProps | null

  frame2?: FrameProps | null
  icon2?: IconProps | null
  textDescription2?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: MessageToolsProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ieew",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--iklu",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--bmas",
  },
  textDescription: {
    children: "Tools Applied",
    className: "sdn-text-description sdn-text-description--71gg",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rstc",
    "data-seldon-ref": "tool",
  },
  icon2: {
    icon: "material-build",
    className: "sdn-icon sdn-icon--9ouj",
  },
  textDescription2: {
    children: "Tool",
    className: "sdn-text-description sdn-text-description--hqun",
  },
}

/**
 * Message: MessageTools
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     ButtonIconic     buttonIconic
 *       Icon           icon
 *     TextDescription  textDescription
 *   Frame              frame2            -> tool
 *     Icon             icon2
 *     TextDescription  textDescription2
 *
 * @example
 * ```tsx
 * <MessageTools
 *   aria-hidden="false"
 *   frame="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   textDescription="{}"
 *   frame2="{}"
 * />
 * ```
 */
export function MessageTools({
  className = "",
  frame,
  buttonIconic,
  icon,
  textDescription,

  frame2,
  icon2,
  textDescription2,

  children,
  seldonRefs,
  ...props
}: MessageToolsProps) {
  const messageToolsClassName = combineClassNames("sdn-message-tools", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const textDescription2Props = mergeOptionalSlot(
    sdn.textDescription2,
    textDescription2,
    seldonRefs,
  )

  return (
    <Frame className={messageToolsClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          </Frame>
          <Frame {...frame2Props}>
            {icon2Props !== null && <Icon {...icon2Props} />}
            {textDescription2Props !== null && <TextDescription {...textDescription2Props} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
