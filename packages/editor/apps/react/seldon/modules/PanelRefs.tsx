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

import { ChipAssist, ChipAssistProps } from "../elements/ChipAssist"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { Text, TextProps } from "../primitives/Text"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelRefsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  chipAssist?: ChipAssistProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null

  frame?: FrameProps | null
  frame2?: FrameProps | null
  textLabel2?: TextLabelProps | null
  text?: TextProps | null
  text2?: TextProps | null
  text3?: TextProps | null
  textLabel3?: TextLabelProps | null
  frame3?: FrameProps | null
}

//
// Default property values
//
const sdn: PanelRefsProps = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--ik8r",
    "data-seldon-ref": "refChip",
  },
  textLabel: {
    children: "ReferenceName",
    className: "sdn-text-label sdn-text-label--litz",
    "data-seldon-ref": "refChipName",
  },
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--afgp",
    "data-seldon-ref": "refChipIcon",
  },

  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--lad1",
    "data-seldon-ref": "refCard",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--xmfu",
  },
  textLabel2: {
    children: "Reference",
    className: "sdn-text-label sdn-text-label--b5oa",
  },
  text: {
    children: "referenceName: { interfaceKey }",
    className: "sdn-text sdn-text--9wfd",
    "data-seldon-ref": "refCardView",
  },
  text2: {
    children: "elements/ItemNode.tsx",
    className: "sdn-text sdn-text--wvhe",
    "data-seldon-ref": "refCardPath",
  },
  text3: {
    children: "render unless null",
    className: "sdn-text sdn-text--mc6h",
    "data-seldon-ref": "refCardCondition",
  },
  textLabel3: {
    children: "Controlled By",
    className: "sdn-text-label sdn-text-label--csur",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--lv6n",
    "data-seldon-ref": "refCardControllers",
  },
}

/**
 * Panel: PanelRefs
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist     chipAssist  -> refChip
 *     TextLabel    textLabel   -> refChipName
 *     Icon         icon        -> refChipIcon
 *   Frame          frame       -> refCard
 *     Frame        frame2
 *       TextLabel  textLabel2
 *       Text       text        -> refCardView
 *       Text       text2       -> refCardPath
 *       Text       text3       -> refCardCondition
 *     TextLabel    textLabel3
 *     Frame        frame3      -> refCardControllers
 *
 * @example
 * ```tsx
 * <PanelRefs
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelRefs({
  className = "",
  chipAssist,
  textLabel,
  icon,

  frame,
  frame2,
  textLabel2,
  text,
  text2,
  text3,
  textLabel3,
  frame3,

  children,
  seldonRefs,
  ...props
}: PanelRefsProps) {
  const panelRefsClassName = combineClassNames("sdn-panel-refs", className)

  const chipAssistProps = mergeOptionalSlot(sdn.chipAssist, chipAssist, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const textProps = mergeOptionalSlot(sdn.text, text, seldonRefs)
  const text2Props = mergeOptionalSlot(sdn.text2, text2, seldonRefs)
  const text3Props = mergeOptionalSlot(sdn.text3, text3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)

  return (
    <HTMLDiv
      className={panelRefsClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {chipAssistProps !== null && (
            <ChipAssist {...chipAssistProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {iconProps !== null && <Icon {...iconProps} />}
            </ChipAssist>
          )}
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              {textProps !== null && <Text {...textProps} />}
              {text2Props !== null && <Text {...text2Props} />}
              {text3Props !== null && <Text {...text3Props} />}
            </Frame>
            {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            <Frame {...frame3Props}></Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
