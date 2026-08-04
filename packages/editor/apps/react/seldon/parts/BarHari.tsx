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

import { ButtonToggle, ButtonToggleProps } from "../elements/ButtonToggle"
import { Frame, FrameProps } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface BarHariProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  frame?: FrameProps | null
  textTitle?: TextTitleProps | null

  buttonToggle?: ButtonToggleProps | null
  icon?: IconProps | null

  buttonToggle2?: ButtonToggleProps | null
  icon2?: IconProps | null

  buttonToggle3?: ButtonToggleProps | null
  icon3?: IconProps | null
}

//
// Default property values
//
const sdn: BarHariProps = {
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--x6r3",
  },
  textTitle: {
    children: "Hari",
    className: "sdn-text-title sdn-text-title--3vil",
    "data-seldon-ref": "hariTitle",
  },

  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--tlj6",
    "data-seldon-ref": "hariToggleOutcome",
  },
  icon: {
    icon: "material-outputCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
    "data-seldon-ref": "hariToggleOutcomeIcon",
  },

  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--tlj6",
    "data-seldon-ref": "hariToggleTools",
  },
  icon2: {
    icon: "material-buildCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
    "data-seldon-ref": "hariToggleToolsIcon",
  },

  buttonToggle3: {
    className: "sdn-button-toggle sdn-button-iconic--tlj6",
    "data-seldon-ref": "hariToggleClamp",
  },
  icon3: {
    icon: "material-neurology",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rftn",
    "data-seldon-ref": "hariToggleClampIcon",
  },
}

/**
 * Bar: BarHari
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * Structure:
 *   Frame         frame
 *     TextTitle   textTitle      -> hariTitle
 *   ButtonToggle  buttonToggle   -> hariToggleOutcome
 *     Icon        icon           -> hariToggleOutcomeIcon
 *   ButtonToggle  buttonToggle2  -> hariToggleTools
 *     Icon        icon2          -> hariToggleToolsIcon
 *   ButtonToggle  buttonToggle3  -> hariToggleClamp
 *     Icon        icon3          -> hariToggleClampIcon
 *
 * @example
 * ```tsx
 * <BarHari
 *   aria-hidden="false"
 *   frame="{}"
 *   textTitle="Product Title"
 *   buttonToggle={() => {}}
 *   icon="material-star"
 *   buttonToggle2={() => {}}
 *   buttonToggle3={() => {}}
 * />
 * ```
 */
export function BarHari({
  className = "",
  frame,
  textTitle,

  buttonToggle,
  icon,

  buttonToggle2,
  icon2,

  buttonToggle3,
  icon3,

  children,
  seldonRefs,
  ...props
}: BarHariProps) {
  const barHariClassName = combineClassNames("sdn-bar-state", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)

  const buttonToggleProps = mergeSlot(sdn.buttonToggle, buttonToggle, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const buttonToggle2Props = mergeOptionalSlot(sdn.buttonToggle2, buttonToggle2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const buttonToggle3Props = mergeOptionalSlot(sdn.buttonToggle3, buttonToggle3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  return (
    <Frame className={barHariClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textTitleProps !== null && <TextTitle {...textTitleProps} />}
          </Frame>
          {buttonToggleProps !== null && <ButtonToggle {...buttonToggleProps} icon={iconProps} />}
          {buttonToggle2Props !== null && (
            <ButtonToggle {...buttonToggle2Props} icon={icon2Props} />
          )}
          {buttonToggle3Props !== null && (
            <ButtonToggle {...buttonToggle3Props} icon={icon3Props} />
          )}
        </>
      )}
    </Frame>
  )
}
