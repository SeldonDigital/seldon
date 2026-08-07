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

export interface MessageToolsHeaderProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  textDescription?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: MessageToolsHeaderProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ieew",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--iklu",
    "data-seldon-ref": "hariToolsToggle",
  },
  icon: {
    icon: "material-keyboardArrowRight",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--bmas",
    "data-seldon-ref": "hariToolsChevron",
  },
  textDescription: {
    children: "Tools Applied",
    className: "sdn-text-description sdn-text-description--71gg",
    "data-seldon-ref": "hariToolsLabel",
  },
}

/**
 * Message: MessageToolsHeader
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame              frame
 *     ButtonIconic     buttonIconic     -> hariToolsToggle
 *       Icon           icon             -> hariToolsChevron
 *     TextDescription  textDescription  -> hariToolsLabel
 *
 * @example
 * ```tsx
 * <MessageToolsHeader
 *   aria-hidden="false"
 *   frame="{}"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   textDescription="{}"
 * />
 * ```
 */
export function MessageToolsHeader({
  className = "",
  frame,
  buttonIconic,
  icon,
  textDescription,

  children,
  seldonRefs,
  ...props
}: MessageToolsHeaderProps) {
  const messageToolsHeaderClassName = combineClassNames("sdn-message-tools-header", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  return (
    <Frame className={messageToolsHeaderClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
          </Frame>
        </>
      )}
    </Frame>
  )
}
