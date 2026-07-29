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
import { Hr, HrProps } from "../primitives/Hr"
import { Text, TextProps } from "../primitives/Text"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface MessageRefControllerProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  text?: TextProps | null

  text2?: TextProps | null

  text3?: TextProps | null

  text4?: TextProps | null

  hr?: HrProps | null
}

//
// Default property values
//
const sdn: MessageRefControllerProps = {
  "aria-hidden": "false",
  text: {
    children: "ImageUploadDialog",
    className: "sdn-text sdn-text--9wfd",
    "data-seldon-ref": "refCardControllerName",
  },

  text2: {
    children: "app/dialogs/image-upload/ImageUploadController.tsx:129",
    className: "sdn-text sdn-text--55ws",
    "data-seldon-ref": "refCardControllerPath",
  },

  text3: {
    children: "{ onClick: onSave }",
    className: "sdn-text sdn-text--mc6h",
    "data-seldon-ref": "refCardControllerPass",
  },

  text4: {
    children: "onSave (parameter, line 169)",
    className: "sdn-text sdn-text--mc6h",
    "data-seldon-ref": "refCardControllerFrom",
  },

  hr: {
    className: "sdn-hr sdn-hr--e6dj",
  },
}

/**
 * Message: MessageRefController
 * Level: Element
 * Intent: Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.
 * Tags: message, chat, transcript, ai, element, text, bubble
 * Type: Custom
 *
 * Structure:
 *   Text  text   -> refCardControllerName
 *   Text  text2  -> refCardControllerPath
 *   Text  text3  -> refCardControllerPass
 *   Text  text4  -> refCardControllerFrom
 *   Hr    hr
 *
 * @example
 * ```tsx
 * <MessageRefController
 *   aria-hidden="false"
 *   text="{}"
 *   text2="{}"
 *   text3="{}"
 *   text4="{}"
 *   hr="{}"
 * />
 * ```
 */
export function MessageRefController({
  className = "",
  text,

  text2,

  text3,

  text4,

  hr,

  children,
  seldonRefs,
  ...props
}: MessageRefControllerProps) {
  const messageRefControllerClassName = combineClassNames("sdn-message-ref-controller", className)

  const textProps = mergeOptionalSlot(sdn.text, text, seldonRefs)

  const text2Props = mergeOptionalSlot(sdn.text2, text2, seldonRefs)

  const text3Props = mergeOptionalSlot(sdn.text3, text3, seldonRefs)

  const text4Props = mergeOptionalSlot(sdn.text4, text4, seldonRefs)

  const hrProps = mergeOptionalSlot(sdn.hr, hr, seldonRefs)

  return (
    <Frame
      className={messageRefControllerClassName}
      data-seldon-ref={"refCardControllerItem"}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {textProps !== null && <Text {...textProps} />}
          {text2Props !== null && <Text {...text2Props} />}
          {text3Props !== null && <Text {...text3Props} />}
          {text4Props !== null && <Text {...text4Props} />}
          {hrProps !== null && <Hr {...hrProps} />}
        </>
      )}
    </Frame>
  )
}
