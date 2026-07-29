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
import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import { ButtonToggle, ButtonToggleProps } from "../elements/ButtonToggle"
import { Chip, ChipProps } from "../elements/Chip"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { Textarea, TextareaProps } from "../primitives/Textarea"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelHariProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  frame?: FrameProps | null
  buttonToggle?: ButtonToggleProps | null
  icon?: IconProps | null
  buttonToggle2?: ButtonToggleProps | null
  icon2?: IconProps | null
  buttonToggle3?: ButtonToggleProps | null
  icon3?: IconProps | null
  buttonIconic?: ButtonIconicProps | null
  icon4?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon5?: IconProps | null

  frame2?: FrameProps | null

  frame3?: FrameProps | null
  textarea?: TextareaProps | null

  frame4?: FrameProps | null
  frame5?: FrameProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon6?: IconProps | null
  buttonMenu2?: ButtonMenuProps | null
  textLabel2?: TextLabelProps | null
  icon7?: IconProps | null
  chip?: ChipProps | null
  textLabel3?: TextLabelProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon8?: IconProps | null
}

//
// Default property values
//
const sdn: PanelHariProps = {
  role: "dialog",
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--9xs7",
  },
  textTitle: {
    children: "Hari",
    className: "sdn-text-title sdn-text-title--ulid",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--i5kj",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariOutcome",
  },
  icon: {
    icon: "material-outputCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariTools",
  },
  icon2: {
    icon: "material-buildCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle3: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClamp",
  },
  icon3: {
    icon: "material-neurology",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "seldon-reset",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClose",
  },
  icon5: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--vorn",
    "data-seldon-ref": "turns",
  },

  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jhsq",
  },
  textarea: {
    placeholder: "Placeholder text",
    className: "sdn-textarea sdn-textarea--2upw",
    "data-seldon-ref": "hariInput",
  },

  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--meos",
  },
  frame5: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a5w4",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariModel",
  },
  textLabel: {
    children: "Model",
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon6: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariThinking",
  },
  textLabel2: {
    children: "Thinking Level",
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon7: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  chip: {
    className: "sdn-chip sdn-chip--lo6k",
    "data-seldon-ref": "hariSelection",
  },
  textLabel3: {
    children: "Scope",
    className: "sdn-text-label sdn-text-label--lug5",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--wh0i",
    "data-seldon-ref": "hariSend",
  },
  icon8: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
}

/**
 * Panel: PanelHari
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar               bar
 *     TextTitle       textTitle
 *     Frame           frame
 *       ButtonToggle  buttonToggle   -> hariOutcome
 *         Icon        icon
 *       ButtonToggle  buttonToggle2  -> hariTools
 *         Icon        icon2
 *       ButtonToggle  buttonToggle3  -> hariClamp
 *         Icon        icon3
 *     ButtonIconic    buttonIconic
 *       Icon          icon4
 *     ButtonIconic    buttonIconic2  -> hariClose
 *       Icon          icon5
 *   Frame             frame2         -> turns
 *   Frame             frame3
 *     Textarea        textarea       -> hariInput
 *   Frame             frame4
 *     Frame           frame5
 *       ButtonMenu    buttonMenu     -> hariModel
 *         TextLabel   textLabel
 *         Icon        icon6
 *       ButtonMenu    buttonMenu2    -> hariThinking
 *         TextLabel   textLabel2
 *         Icon        icon7
 *       Chip          chip           -> hariSelection
 *         TextLabel   textLabel3
 *       ButtonIconic  buttonIconic3  -> hariSend
 *         Icon        icon8
 *
 * @example
 * ```tsx
 * <PanelHari
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelHari({
  className = "",
  bar,
  textTitle,
  frame,
  buttonToggle,
  icon,
  buttonToggle2,
  icon2,
  buttonToggle3,
  icon3,
  buttonIconic,
  icon4,
  buttonIconic2,
  icon5,

  frame2,

  frame3,
  textarea,

  frame4,
  frame5,
  buttonMenu,
  textLabel,
  icon6,
  buttonMenu2,
  textLabel2,
  icon7,
  chip,
  textLabel3,
  buttonIconic3,
  icon8,

  children,
  seldonRefs,
  ...props
}: PanelHariProps) {
  const panelHariClassName = combineClassNames("sdn-panel-hari", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const buttonToggleProps = mergeOptionalSlot(sdn.buttonToggle, buttonToggle, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonToggle2Props = mergeOptionalSlot(sdn.buttonToggle2, buttonToggle2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const buttonToggle3Props = mergeOptionalSlot(sdn.buttonToggle3, buttonToggle3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const textareaProps = mergeOptionalSlot(sdn.textarea, textarea, seldonRefs)

  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const frame5Props = mergeSlot(sdn.frame5, frame5, seldonRefs)
  const buttonMenuProps = mergeOptionalSlot(sdn.buttonMenu, buttonMenu, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const buttonMenu2Props = mergeOptionalSlot(sdn.buttonMenu2, buttonMenu2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const icon7Props = mergeSlot(sdn.icon7, icon7, seldonRefs)
  const chipProps = mergeOptionalSlot(sdn.chip, chip, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const buttonIconic3Props = mergeOptionalSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon8Props = mergeSlot(sdn.icon8, icon8, seldonRefs)

  return (
    <HTMLDiv
      className={panelHariClassName}
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
              <Frame {...frameProps}>
                {buttonToggleProps !== null && (
                  <ButtonToggle {...buttonToggleProps} icon={iconProps} />
                )}
                {buttonToggle2Props !== null && (
                  <ButtonToggle {...buttonToggle2Props} icon={icon2Props} />
                )}
                {buttonToggle3Props !== null && (
                  <ButtonToggle {...buttonToggle3Props} icon={icon3Props} />
                )}
              </Frame>
              {buttonIconicProps !== null && (
                <ButtonIconic {...buttonIconicProps} icon={icon4Props} />
              )}
              {buttonIconic2Props !== null && (
                <ButtonIconic {...buttonIconic2Props} icon={icon5Props} />
              )}
            </Bar>
          )}
          <Frame {...frame2Props}></Frame>
          <Frame {...frame3Props}>
            {textareaProps !== null && <Textarea {...textareaProps} />}
          </Frame>
          <Frame {...frame4Props}>
            <Frame {...frame5Props}>
              {buttonMenuProps !== null && (
                <ButtonMenu {...buttonMenuProps}>
                  {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                  {icon6Props !== null && <Icon {...icon6Props} />}
                </ButtonMenu>
              )}
              {buttonMenu2Props !== null && (
                <ButtonMenu {...buttonMenu2Props}>
                  {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                  {icon7Props !== null && <Icon {...icon7Props} />}
                </ButtonMenu>
              )}
              {chipProps !== null && (
                <Chip {...chipProps}>
                  {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                </Chip>
              )}
              {buttonIconic3Props !== null && (
                <ButtonIconic {...buttonIconic3Props} icon={icon8Props} />
              )}
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
