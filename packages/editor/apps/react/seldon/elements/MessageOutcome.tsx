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
import { TextDescription, TextDescriptionProps } from "../primitives/TextDescription"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MessageOutcomeProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null

  textDescription?: TextDescriptionProps | null
}

//
// Default property values
//
const sdn: MessageOutcomeProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ieew",
  },
  icon: {
    icon: "material-checkCircle",
    className: "sdn-icon sdn-icon--wxt9",
    "data-seldon-ref": "hariOutcomeIcon",
  },
  textLabel: {
    children: "Applied",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "hariOutcomeLabel",
  },

  textDescription: {
    children: "Button background: primary -&gt; accent",
    className: "sdn-text-description sdn-text-description--choa",
    "data-seldon-ref": "hariOutcomeText",
  },
}

/**
 * Message: MessageOutcome
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Inline
 *
 * Structure:
 *   Frame            frame
 *     Icon           icon             -> hariOutcomeIcon
 *     TextLabel      textLabel        -> hariOutcomeLabel
 *   TextDescription  textDescription  -> hariOutcomeText
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
 */
export function MessageOutcome({
  className = "",
  frame,
  icon,
  textLabel,

  textDescription,

  children,
  seldonRefs,
  ...props
}: MessageOutcomeProps) {
  const messageOutcomeClassName = combineClassNames("sdn-message-outcome", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const textDescriptionProps = mergeOptionalSlot(sdn.textDescription, textDescription, seldonRefs)

  return (
    <Frame className={messageOutcomeClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {iconProps !== null && <Icon {...iconProps} />}
            {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          </Frame>
          {textDescriptionProps !== null && <TextDescription {...textDescriptionProps} />}
        </>
      )}
    </Frame>
  )
}
