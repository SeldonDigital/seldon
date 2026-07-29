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
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { IconProps } from "../primitives/Icon"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelPaletteProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  frame?: FrameProps | null
}

//
// Default property values
//
const sdn: PanelPaletteProps = {
  role: "dialog",
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--9xs7",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--ulid",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--88jo",
  },
}

/**
 * Panel: PanelPalette
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar             bar
 *     TextTitle     textTitle
 *     ButtonIconic  buttonIconic
 *       Icon        icon
 *   Frame           frame
 *
 * @example
 * ```tsx
 * <PanelPalette
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelPalette({
  className = "",
  bar,
  textTitle,
  buttonIconic,
  icon,

  frame,

  children,
  seldonRefs,
  ...props
}: PanelPaletteProps) {
  const panelPaletteClassName = combineClassNames("sdn-panel-palette", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)

  return (
    <HTMLDiv
      className={panelPaletteClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>
              {textTitleProps !== null && <TextTitle {...textTitleProps} />}
              {buttonIconicProps !== null && (
                <ButtonIconic {...buttonIconicProps} icon={iconProps} />
              )}
            </Bar>
          )}
          <Frame {...frameProps}></Frame>
        </>
      )}
    </HTMLDiv>
  )
}
