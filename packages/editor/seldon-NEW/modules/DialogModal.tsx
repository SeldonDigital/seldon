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
import { Bar, BarProps } from "../parts/Bar"
import { BarButtonBar, BarButtonBarProps } from "../parts/BarButtonBar"
import { IconProps } from "../primitives/Icon"
import { TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"

export interface DialogModalProps extends HTMLAttributes<HTMLElement> {
  className?: string
  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  frame?: FrameProps | null
  barButtonBar?: BarButtonBarProps | null
  button?: ButtonProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  button2?: ButtonProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
}

/*****
 * Dialog: DialogModal
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * @example
 * ```tsx
 * <DialogModal
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function DialogModal({
  className = "",
  bar = sdn.bar,
  textTitle,
  frame = sdn.frame,
  barButtonBar = sdn.barButtonBar,
  button = sdn.button,
  icon = sdn.icon,
  textLabel,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  textLabel2,
  children,
  ...props
}: DialogModalProps) {
  const dialogModalClassName = combineClassNames("sdn-dialog", className)
  const barProps =
    bar === null
      ? null
      : {
          ...sdn.bar,
          ...bar,
          className: combineClassNames(sdn.bar?.className, bar?.className),
        }
  const textTitleProps =
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        }
  const frameProps =
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        }
  const barButtonBarProps =
    barButtonBar === null
      ? null
      : {
          ...sdn.barButtonBar,
          ...barButtonBar,
          className: combineClassNames(
            sdn.barButtonBar?.className,
            barButtonBar?.className,
          ),
        }
  const buttonProps =
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
        }
  const iconProps =
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        }
  const textLabelProps =
    textLabel === null
      ? null
      : {
          ...sdn.textLabel,
          ...textLabel,
          className: combineClassNames(
            sdn.textLabel?.className,
            textLabel?.className,
          ),
        }
  const button2Props =
    button2 === null
      ? null
      : {
          ...sdn.button2,
          ...button2,
          className: combineClassNames(
            sdn.button2?.className,
            button2?.className,
          ),
        }
  const icon2Props =
    icon2 === null
      ? null
      : {
          ...sdn.icon2,
          ...icon2,
          className: combineClassNames(sdn.icon2?.className, icon2?.className),
        }
  const textLabel2Props =
    textLabel2 === null
      ? null
      : {
          ...sdn.textLabel2,
          ...textLabel2,
          className: combineClassNames(
            sdn.textLabel2?.className,
            textLabel2?.className,
          ),
        }

  return (
    <HTMLDiv
      className={dialogModalClassName}
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
              {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
            </Bar>
          )}
          <Frame {...frameProps}></Frame>
          {barButtonBarProps !== null && (
            <BarButtonBar
              {...barButtonBarProps}
              button={buttonProps}
              button2={button2Props}
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
const sdn: DialogModalProps = {
  role: "dialog",
  "aria-hidden": "false",
  className: "sdn-dialog sdn-dialog",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--yje0",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--eodu",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--88jo",
  },
  barButtonBar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar-button-bar--dabm",
  },
  button: {
    className: "sdn-button sdn-button--cq5m",
  },
  icon: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--x7ac",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--yo51",
  },
  button2: {
    className: "sdn-button sdn-button--cq5m",
  },
  icon2: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--x7ac",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--yo51",
  },
}
