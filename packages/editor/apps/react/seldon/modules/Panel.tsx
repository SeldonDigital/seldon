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

import { Button, ButtonProps } from "../elements/Button"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  button?: ButtonProps | null
  icon2?: IconProps | null
  textLabel?: TextLabelProps | null

  frame?: FrameProps | null

  barButtons?: BarButtonsProps | null
  frame2?: FrameProps | null
  button2?: ButtonProps | null
  icon3?: IconProps | null
  textLabel2?: TextLabelProps | null
  button3?: ButtonProps | null
  icon4?: IconProps | null
  textLabel3?: TextLabelProps | null
  button4?: ButtonProps | null
  icon5?: IconProps | null
  textLabel4?: TextLabelProps | null
  frame3?: FrameProps | null
  button5?: ButtonProps | null
  icon6?: IconProps | null
  textLabel5?: TextLabelProps | null
  button6?: ButtonProps | null
  icon7?: IconProps | null
  textLabel6?: TextLabelProps | null
}

//
// Default property values
//
const sdn: PanelProps = {
  role: "dialog",
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--yje0",
  },
  textTitle: {
    children: "Dialog",
    className: "sdn-text-title sdn-text-title--8ah1",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--taul",
  },
  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--ylte",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--88jo",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--dabm",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel2: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel3: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button4: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon5: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    children: "Button",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button5: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon6: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    children: "Cancel",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button6: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon7: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel6: {
    children: "OK",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Panel: Panel
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar              bar
 *     TextTitle      textTitle
 *     ButtonIconic   buttonIconic
 *       Icon         icon
 *     Button         button
 *       Icon         icon2
 *       TextLabel    textLabel
 *   Frame            frame
 *   BarButtons       barButtons
 *     Frame          frame2
 *       Button       button2
 *         Icon       icon3
 *         TextLabel  textLabel2
 *       Button       button3
 *         Icon       icon4
 *         TextLabel  textLabel3
 *       Button       button4
 *         Icon       icon5
 *         TextLabel  textLabel4
 *     Frame          frame3
 *       Button       button5
 *         Icon       icon6
 *         TextLabel  textLabel5
 *       Button       button6
 *         Icon       icon7
 *         TextLabel  textLabel6
 *
 * @example
 * ```tsx
 * <Panel
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function Panel({
  className = "",
  bar,
  textTitle,
  buttonIconic,
  icon,
  button,
  icon2,
  textLabel,

  frame,

  barButtons,
  frame2,
  button2,
  icon3,
  textLabel2,
  button3,
  icon4,
  textLabel3,
  button4,
  icon5,
  textLabel4,
  frame3,
  button5,
  icon6,
  textLabel5,
  button6,
  icon7,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: PanelProps) {
  const panelClassName = combineClassNames("sdn-panel", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const button3Props = mergeOptionalSlot(sdn.button3, button3, seldonRefs)
  const icon4Props = mergeOptionalSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const button4Props = mergeOptionalSlot(sdn.button4, button4, seldonRefs)
  const icon5Props = mergeOptionalSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const button5Props = mergeOptionalSlot(sdn.button5, button5, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const button6Props = mergeOptionalSlot(sdn.button6, button6, seldonRefs)
  const icon7Props = mergeSlot(sdn.icon7, icon7, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

  return (
    <HTMLDiv
      className={panelClassName}
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
              {buttonProps !== null && (
                <Button {...buttonProps}>
                  {icon2Props !== null && <Icon {...icon2Props} />}
                  {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                </Button>
              )}
            </Bar>
          )}
          <Frame {...frameProps}></Frame>
          {barButtonsProps !== null && (
            <BarButtons {...barButtonsProps}>
              <Frame {...frame2Props}>
                {button2Props !== null && (
                  <Button {...button2Props}>
                    {icon3Props !== null && <Icon {...icon3Props} />}
                    {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                  </Button>
                )}
                {button3Props !== null && (
                  <Button {...button3Props}>
                    {icon4Props !== null && <Icon {...icon4Props} />}
                    {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                  </Button>
                )}
                {button4Props !== null && (
                  <Button {...button4Props}>
                    {icon5Props !== null && <Icon {...icon5Props} />}
                    {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                  </Button>
                )}
              </Frame>
              <Frame {...frame3Props}>
                {button5Props !== null && (
                  <Button {...button5Props}>
                    {icon6Props !== null && <Icon {...icon6Props} />}
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                  </Button>
                )}
                {button6Props !== null && (
                  <Button {...button6Props}>
                    {icon7Props !== null && <Icon {...icon7Props} />}
                    {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                  </Button>
                )}
              </Frame>
            </BarButtons>
          )}
        </>
      )}
    </HTMLDiv>
  )
}
