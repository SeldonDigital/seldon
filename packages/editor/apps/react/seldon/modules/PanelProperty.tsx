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

export interface PanelPropertyProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null

  frame2?: FrameProps | null
}

//
// Default property values
//
const sdn: PanelPropertyProps = {
  role: "dialog",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
  },
  icon: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--tlj6",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--mahk",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jbzn",
  },
}

/**
 * Panel: PanelProperty
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Frame           frame
 *     ButtonIconic  buttonIconic
 *       Icon        icon
 *     ButtonIconic  buttonIconic2
 *       Icon        icon2
 *   Frame           frame2
 *
 * @example
 * ```tsx
 * <PanelProperty
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelProperty({
  className = "",
  frame,
  buttonIconic,
  icon,
  buttonIconic2,
  icon2,

  frame2,

  children,
  seldonRefs,
  ...props
}: PanelPropertyProps) {
  const panelPropertyClassName = combineClassNames("sdn-panel-palette", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)

  return (
    <HTMLDiv
      className={panelPropertyClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
            {buttonIconic2Props !== null && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
          </Frame>
          <Frame {...frame2Props}></Frame>
        </>
      )}
    </HTMLDiv>
  )
}
