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
import { ButtonProps } from "../elements/Button"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { IconProps } from "../primitives/Icon"
import { TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  barButtons?: BarButtonsProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
  button3?: ButtonProps | null
  icon3?: IconProps | null
  textLabel3?: TextLabelProps | null
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
  frame = sdn.frame,
  barButtons = sdn.barButtons,
  button = sdn.button,
  icon = sdn.icon,
  textLabel,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  textLabel2,
  button3 = sdn.button3,
  icon3 = sdn.icon3,
  textLabel3,
  children,
  seldonRefs,
  ...props
}: SidebarProps) {
  const sidebarClassName = combineClassNames("sdn-sidebar", className)
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
          <Frame {...frameProps}></Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button={buttonProps}
              button2={button2Props}
              button3={button3Props}
            />
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
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--946h",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar-tabs-bar--qtpt",
  },
  button: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  button2: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-remove",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  button3: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
