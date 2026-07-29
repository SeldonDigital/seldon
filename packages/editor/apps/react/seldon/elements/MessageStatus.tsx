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
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface MessageStatusProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  textLabel?: TextLabelProps | null
}

//
// Default property values
//
const sdn: MessageStatusProps = {
  "aria-hidden": "false",
  icon: {
    icon: "material-robot",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--8ds9",
    "data-seldon-ref": "hariStatusIcon",
  },

  textLabel: {
    children: "Working...",
    className: "sdn-text-label sdn-text-label--ue8m",
    "data-seldon-ref": "hariStatusLabel",
  },
}

/**
 * Message: MessageStatus
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Custom
 *
 * Structure:
 *   Icon       icon       -> hariStatusIcon
 *   TextLabel  textLabel  -> hariStatusLabel
 *
 * @example
 * ```tsx
 * <MessageStatus
 *   aria-hidden="false"
 *   icon="material-star"
 *   textLabel="{}"
 * />
 * ```
 */
export function MessageStatus({
  className = "",
  icon,

  textLabel,

  children,
  seldonRefs,
  ...props
}: MessageStatusProps) {
  const messageStatusClassName = combineClassNames("sdn-message-status", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  return (
    <Frame className={messageStatusClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
        </>
      )}
    </Frame>
  )
}
