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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
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

/*****
 * Sidebar: Sidebar
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <Sidebar
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Sidebar({
  className = "",
  barTabsBar = sdn.barTabsBar,
  buttonSimple = sdn.buttonSimple,
  textLabel,
  buttonSimple2 = sdn.buttonSimple2,
  textLabel2,
  buttonSimple3 = sdn.buttonSimple3,
  textLabel3,
  frame = sdn.frame,
  barButtons = sdn.barButtons,
  frame2 = sdn.frame2,
  button,
  icon,
  textLabel4,
  button2,
  icon2,
  textLabel5,
  button3,
  icon3,
  textLabel6,
  frame3 = sdn.frame3,
  button4,
  icon4 = sdn.icon4,
  textLabel7,
  button5,
  icon5 = sdn.icon5,
  textLabel8,
  children,
  seldonRefs,
  ...props
}: SidebarProps) {
  const sidebarClassName = combineClassNames("sdn-sidebar", className)
  const barTabsBarProps = applyRef(
    seldonRefs,
    barTabsBar === null
      ? null
      : {
          ...sdn.barTabsBar,
          ...barTabsBar,
          className: combineClassNames(
            sdn.barTabsBar?.className,
            barTabsBar?.className,
          ),
        },
  )
  const buttonSimpleProps = applyRef(
    seldonRefs,
    buttonSimple === null
      ? null
      : {
          ...sdn.buttonSimple,
          ...buttonSimple,
          className: combineClassNames(
            sdn.buttonSimple?.className,
            buttonSimple?.className,
          ),
        },
  )
  const textLabelProps = applyRef(
    seldonRefs,
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        },
  )
  const buttonSimple2Props = applyRef(
    seldonRefs,
    buttonSimple2 === null
      ? null
      : {
          ...sdn.buttonSimple2,
          ...buttonSimple2,
          className: combineClassNames(
            sdn.buttonSimple2?.className,
            buttonSimple2?.className,
          ),
        },
  )
  const textLabel2Props = applyRef(
    seldonRefs,
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        },
  )
  const buttonSimple3Props = applyRef(
    seldonRefs,
    buttonSimple3 === null
      ? null
      : {
          ...sdn.buttonSimple3,
          ...buttonSimple3,
          className: combineClassNames(
            sdn.buttonSimple3?.className,
            buttonSimple3?.className,
          ),
        },
  )
  const textLabel3Props = applyRef(
    seldonRefs,
    textLabel3 === null
      ? null
      : {
          ...sdn.textLabel3,
          ...textLabel3,
          className: combineClassNames(
            sdn.textLabel3?.className,
            textLabel3?.className,
          ),
        },
  )
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        },
  )
  const barButtonsProps = applyRef(
    seldonRefs,
    barButtons === null
      ? null
      : {
          ...sdn.barButtons,
          ...barButtons,
          className: combineClassNames(
            sdn.barButtons?.className,
            barButtons?.className,
          ),
        },
  )
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
  )
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
        },
  )
  const iconProps = applyRef(
    seldonRefs,
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        },
  )
  const textLabel4Props = applyRef(
    seldonRefs,
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
          ),
        },
  )
  const button2Props = applyRef(
    seldonRefs,
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
          ),
        },
  )
  const icon2Props = applyRef(
    seldonRefs,
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        },
  )
  const textLabel5Props = applyRef(
    seldonRefs,
    textLabel5 === null
      ? null
      : {
          ...sdn.textLabel5,
          ...textLabel5,
          className: combineClassNames(
            sdn.textLabel5?.className,
            textLabel5?.className,
          ),
        },
  )
  const button3Props = applyRef(
    seldonRefs,
    button3 === null
      ? null
      : {
          ...sdn.button3,
          ...button3,
          className: combineClassNames(
            sdn.button3?.className,
            button3?.className,
          ),
        },
  )
  const icon3Props = applyRef(
    seldonRefs,
    icon3 === null
      ? null
      : {
          ...sdn.icon3,
          ...icon3,
          className: combineClassNames(sdn.icon3?.className, icon3?.className),
        },
  )
  const textLabel6Props = applyRef(
    seldonRefs,
    textLabel6 === null
      ? null
      : {
          ...sdn.textLabel6,
          ...textLabel6,
          className: combineClassNames(
            sdn.textLabel6?.className,
            textLabel6?.className,
          ),
        },
  )
  const frame3Props = applyRef(
    seldonRefs,
    frame3 === null
      ? null
      : {
          ...sdn.frame3,
          ...frame3,
          className: combineClassNames(
            sdn.frame3?.className,
            frame3?.className,
          ),
        },
  )
  const button4Props = applyRef(
    seldonRefs,
    button4 === null
      ? null
      : {
          ...sdn.button4,
          ...button4,
          className: combineClassNames(
            sdn.button4?.className,
            button4?.className,
          ),
        },
  )
  const icon4Props = applyRef(
    seldonRefs,
    icon4 === null
      ? null
      : {
          ...sdn.icon4,
          ...icon4,
          className: combineClassNames(sdn.icon4?.className, icon4?.className),
        },
  )
  const textLabel7Props = applyRef(
    seldonRefs,
    textLabel7 === null
      ? null
      : {
          ...sdn.textLabel7,
          ...textLabel7,
          className: combineClassNames(
            sdn.textLabel7?.className,
            textLabel7?.className,
          ),
        },
  )
  const button5Props = applyRef(
    seldonRefs,
    button5 === null
      ? null
      : {
          ...sdn.button5,
          ...button5,
          className: combineClassNames(
            sdn.button5?.className,
            button5?.className,
          ),
        },
  )
  const icon5Props = applyRef(
    seldonRefs,
    icon5 === null
      ? null
      : {
          ...sdn.icon5,
          ...icon5,
          className: combineClassNames(sdn.icon5?.className, icon5?.className),
        },
  )
  const textLabel8Props = applyRef(
    seldonRefs,
    textLabel8 === null
      ? null
      : {
          ...sdn.textLabel8,
          ...textLabel8,
          className: combineClassNames(
            sdn.textLabel8?.className,
            textLabel8?.className,
          ),
        },
  )

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
              textLabel={textLabel && textLabelProps}
              buttonSimple2={buttonSimple2Props}
              textLabel2={textLabel2 && textLabel2Props}
              buttonSimple3={buttonSimple3Props}
              textLabel3={textLabel3 && textLabel3Props}
            />
          )}
          <Frame {...frameProps}></Frame>
          {barButtonsProps !== null && (
            <BarButtons {...barButtonsProps}>
              <Frame {...frame2Props}>
                {button && buttonProps && (
                  <Button {...buttonProps}>
                    {icon && iconProps && <Icon {...iconProps} />}
                    {textLabel4 && textLabel4Props && (
                      <TextLabel {...textLabel4Props} />
                    )}
                  </Button>
                )}
                {button2 && button2Props && (
                  <Button {...button2Props}>
                    {icon2 && icon2Props && <Icon {...icon2Props} />}
                    {textLabel5 && textLabel5Props && (
                      <TextLabel {...textLabel5Props} />
                    )}
                  </Button>
                )}
                {button3 && button3Props && (
                  <Button {...button3Props}>
                    {icon3 && icon3Props && <Icon {...icon3Props} />}
                    {textLabel6 && textLabel6Props && (
                      <TextLabel {...textLabel6Props} />
                    )}
                  </Button>
                )}
              </Frame>
              <Frame {...frame3Props}>
                {button4 && button4Props && (
                  <Button {...button4Props}>
                    {icon4 && icon4Props && <Icon {...icon4Props} />}
                    {textLabel7 && textLabel7Props && (
                      <TextLabel {...textLabel7Props} />
                    )}
                  </Button>
                )}
                {button5 && button5Props && (
                  <Button {...button5Props}>
                    {icon5 && icon5Props && <Icon {...icon5Props} />}
                    {textLabel8 && textLabel8Props && (
                      <TextLabel {...textLabel8Props} />
                    )}
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

//
// Default property values
//
const sdn: SidebarProps = {
  role: "complementary",
  "aria-hidden": "false",
  className: "sdn-sidebar",
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
    className: "sdn-bar-buttons sdn-bar-tabs-bar--qtpt",
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
