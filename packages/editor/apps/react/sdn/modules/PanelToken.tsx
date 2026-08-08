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
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelTokenProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  chipAssist?: ChipAssistProps | null
  textLabel?: TextLabelProps | null
  textLabel2?: TextLabelProps | null
  icon?: IconProps | null

  frame?: FrameProps | null
}

//
// Default property values
//
const sdn: PanelTokenProps = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--5mmz",
    "data-seldon-ref": "tokenChip",
  },
  textLabel: {
    children: "TokenName",
    className: "sdn-text-label sdn-text-label--ee5h",
    "data-seldon-ref": "tokenChipName",
  },
  textLabel2: {
    children: "Value",
    className: "sdn-text-label sdn-text-label--6ypr",
    "data-seldon-ref": "tokenChipValue",
  },
  icon: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
    "data-seldon-ref": "tokenChipIcon",
  },

  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tnni",
    "data-seldon-ref": "tokenCard",
  },
}

/**
 * Panel: PanelToken
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist   chipAssist  -> tokenChip
 *     TextLabel  textLabel   -> tokenChipName
 *     TextLabel  textLabel2  -> tokenChipValue
 *     Icon       icon        -> tokenChipIcon
 *   Frame        frame       -> tokenCard
 *
 * @example
 * ```tsx
 * <PanelToken
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelToken({
  className = "",
  chipAssist,
  textLabel,
  textLabel2,
  icon,

  frame,

  children,
  seldonRefs,
  ...props
}: PanelTokenProps) {
  const panelTokenClassName = combineClassNames("sdn-panel-token", className)

  const chipAssistProps = mergeOptionalSlot(sdn.chipAssist, chipAssist, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)

  return (
    <HTMLDiv
      className={panelTokenClassName}
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
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              {iconProps !== null && <Icon {...iconProps} />}
            </ChipAssist>
          )}
          <Frame {...frameProps}></Frame>
        </>
      )}
    </HTMLDiv>
  )
}
