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
import { IconProps } from "../primitives/Icon"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelPaletteProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  frame2?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null

  frame3?: FrameProps | null

  frame4?: FrameProps | null
  frame5?: FrameProps | null
}

//
// Default property values
//
const sdn: PanelPaletteProps = {
  role: "dialog",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
    "data-seldon-ref": "paletteTopBar",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jm7o",
    "data-seldon-ref": "paletteTopBarSlot",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
    "data-seldon-ref": "paletteOption",
  },
  icon: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
    "data-seldon-ref": "paletteOptionIcon",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
    "data-seldon-ref": "paletteClose",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
    "data-seldon-ref": "paletteCloseIcon",
  },

  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--p4qj",
    "data-seldon-ref": "paletteContents",
  },

  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rc9x",
    "data-seldon-ref": "paletteBottomBar",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jm7o",
    "data-seldon-ref": "paletteBottomBarSlot",
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
 *   Frame           frame          -> paletteTopBar
 *     Frame         frame2         -> paletteTopBarSlot
 *     ButtonIconic  buttonIconic   -> paletteOption
 *       Icon        icon           -> paletteOptionIcon
 *     ButtonIconic  buttonIconic2  -> paletteClose
 *       Icon        icon2          -> paletteCloseIcon
 *   Frame           frame3         -> paletteContents
 *   Frame           frame4         -> paletteBottomBar
 *     Frame         frame5         -> paletteBottomBarSlot
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
  frame,
  frame2,
  buttonIconic,
  icon,
  buttonIconic2,
  icon2,

  frame3,

  frame4,
  frame5,

  children,
  seldonRefs,
  ...props
}: PanelPaletteProps) {
  const panelPaletteClassName = combineClassNames("sdn-panel-palette", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)

  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)

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
          <Frame {...frameProps}>
            <Frame {...frame2Props}></Frame>
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {buttonIconic2Props !== null && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
          </Frame>
          <Frame {...frame3Props}></Frame>
          <Frame {...frame4Props}>
            <Frame {...frame5Props}></Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
