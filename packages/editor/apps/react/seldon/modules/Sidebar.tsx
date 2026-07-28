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
import { ButtonSimpleProps } from "../elements/ButtonSimple"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { BarTabsBar, BarTabsBarProps } from "../parts/BarTabsBar"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  barTabsBar?: BarTabsBarProps | null
  buttonSimple?: ButtonSimpleProps | null
  textLabel?: TextLabelProps | null
  buttonSimple2?: ButtonSimpleProps | null
  textLabel2?: TextLabelProps | null
  buttonSimple3?: ButtonSimpleProps | null
  textLabel3?: TextLabelProps | null

  frame?: FrameProps | null

  barButtons?: BarButtonsProps | null
  frame2?: FrameProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel4?: TextLabelProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel5?: TextLabelProps | null
  button3?: ButtonProps | null
  icon3?: IconProps | null
  textLabel6?: TextLabelProps | null
  frame3?: FrameProps | null
  button4?: ButtonProps | null
  icon4?: IconProps | null
  textLabel7?: TextLabelProps | null
  button5?: ButtonProps | null
  icon5?: IconProps | null
  textLabel8?: TextLabelProps | null
}

//
// Default property values
//
const sdn: SidebarProps = {
  role: "complementary",
  "aria-hidden": "false",
  barTabsBar: {
    role: "tablist",
    "aria-hidden": "false",
    className: "sdn-bar-tabs-bar sdn-bar-tabs-bar--qtpt",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple2: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  buttonSimple3: {
    className: "sdn-button-simple sdn-button-simple--znxu",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--946h",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--ftcm",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon: {
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon2: {
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button4: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel7: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button5: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon5: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel8: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Sidebar: Sidebar
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * Structure:
 *   BarTabsBar       barTabsBar
 *     ButtonSimple   buttonSimple
 *       TextLabel    textLabel
 *     ButtonSimple   buttonSimple2
 *       TextLabel    textLabel2
 *     ButtonSimple   buttonSimple3
 *       TextLabel    textLabel3
 *   Frame            frame
 *   BarButtons       barButtons
 *     Frame          frame2
 *       Button       button
 *         Icon       icon
 *         TextLabel  textLabel4
 *       Button       button2
 *         Icon       icon2
 *         TextLabel  textLabel5
 *       Button       button3
 *         Icon       icon3
 *         TextLabel  textLabel6
 *     Frame          frame3
 *       Button       button4
 *         Icon       icon4
 *         TextLabel  textLabel7
 *       Button       button5
 *         Icon       icon5
 *         TextLabel  textLabel8
 *
 * @example
 * ```tsx
 * <Sidebar
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 */
export function Sidebar({
  className = "",
  barTabsBar,
  buttonSimple,
  textLabel,
  buttonSimple2,
  textLabel2,
  buttonSimple3,
  textLabel3,

  frame,

  barButtons,
  frame2,
  button,
  icon,
  textLabel4,
  button2,
  icon2,
  textLabel5,
  button3,
  icon3,
  textLabel6,
  frame3,
  button4,
  icon4,
  textLabel7,
  button5,
  icon5,
  textLabel8,

  children,
  seldonRefs,
  ...props
}: SidebarProps) {
  const sidebarClassName = combineClassNames("sdn-sidebar", className)

  const barTabsBarProps = mergeSlot(sdn.barTabsBar, barTabsBar, seldonRefs)
  const buttonSimpleProps = mergeSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const buttonSimple2Props = mergeSlot(sdn.buttonSimple2, buttonSimple2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const buttonSimple3Props = mergeSlot(sdn.buttonSimple3, buttonSimple3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const button3Props = mergeOptionalSlot(sdn.button3, button3, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const button4Props = mergeOptionalSlot(sdn.button4, button4, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const button5Props = mergeOptionalSlot(sdn.button5, button5, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)

  return (
    <HTMLDiv
      className={sidebarClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {barTabsBarProps !== null && (
            <BarTabsBar
              {...barTabsBarProps}
              buttonSimple={buttonSimpleProps}
              textLabel={textLabelProps}
              buttonSimple2={buttonSimple2Props}
              textLabel2={textLabel2Props}
              buttonSimple3={buttonSimple3Props}
              textLabel3={textLabel3Props}
            />
          )}
          <Frame {...frameProps}></Frame>
          {barButtonsProps !== null && (
            <BarButtons {...barButtonsProps}>
              <Frame {...frame2Props}>
                {buttonProps !== null && (
                  <Button {...buttonProps}>
                    {iconProps !== null && <Icon {...iconProps} />}
                    {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                  </Button>
                )}
                {button2Props !== null && (
                  <Button {...button2Props}>
                    {icon2Props !== null && <Icon {...icon2Props} />}
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                  </Button>
                )}
                {button3Props !== null && (
                  <Button {...button3Props}>
                    {icon3Props !== null && <Icon {...icon3Props} />}
                    {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                  </Button>
                )}
              </Frame>
              <Frame {...frame3Props}>
                {button4Props !== null && (
                  <Button {...button4Props}>
                    {icon4Props !== null && <Icon {...icon4Props} />}
                    {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                  </Button>
                )}
                {button5Props !== null && (
                  <Button {...button5Props}>
                    {icon5Props !== null && <Icon {...icon5Props} />}
                    {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
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
