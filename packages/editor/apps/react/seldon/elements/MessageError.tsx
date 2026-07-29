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

import { ButtonSimple, ButtonSimpleProps } from "../elements/ButtonSimple"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MessageErrorProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  icon?: IconProps | null
  textDescription?: TextDescriptionProps | null

  buttonSimple?: ButtonSimpleProps | null
  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MessageErrorProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ieew",
  },
  icon: {
    className: "sdn-icon sdn-icon--gm8j",
  },
  textDescription: {
    className: "sdn-text-description sdn-text-label--lbxv",
  },

  buttonSimple: {
    className: "sdn-button-simple sdn-button-iconic--iklu",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--aftu",
  },
}

/**
 * Message: MessageError
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     Icon             icon
 *     TextDescription  textDescription
 *   ButtonSimple       buttonSimple
 *     TextLabel        textLabel
 *
 * @example
 * ```tsx
 * <MessageError
 *   aria-hidden="false"
 *   frame="{}"
 *   icon="material-star"
 *   textDescription="{}"
 *   buttonSimple={() => {}}
 *   textLabel="{}"
 * />
 * ```
 */
export function MessageError({
  className = "",
  frame,
  icon,
  textDescription,

  buttonSimple,
  textLabel,

  children,
  seldonRefs,
  ...props
}: MessageErrorProps) {
  const messageErrorClassName = combineClassNames("sdn-message-error", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  const buttonSimpleProps = mergeSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <Frame className={messageErrorClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {iconProps !== null && <Icon {...iconProps} />}
            {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          </Frame>
          {buttonSimpleProps !== null && (
            <ButtonSimple {...buttonSimpleProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </ButtonSimple>
          )}
        </>
      )}
    </Frame>
  )
}
