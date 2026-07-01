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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface DialogProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  button?: ButtonProps | null
  icon2?: IconProps | null
  textLabel?: TextLabelProps | null
  frame?: FrameProps | null
  barButtons?: BarButtonsProps | null
  button2?: ButtonProps | null
  icon3?: IconProps | null
  textLabel2?: TextLabelProps | null
  button3?: ButtonProps | null
  icon4?: IconProps | null
  textLabel3?: TextLabelProps | null
  button4?: ButtonProps | null
  icon5?: IconProps | null
  textLabel4?: TextLabelProps | null
}

/*****
 * Dialog: Dialog
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * @example
 * ```tsx
 * <Dialog
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Dialog({
  className = "",
  bar = sdn.bar,
  textTitle,
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  button = sdn.button,
  icon2 = sdn.icon2,
  textLabel,
  frame = sdn.frame,
  barButtons = sdn.barButtons,
  button2 = sdn.button2,
  icon3 = sdn.icon3,
  textLabel2,
  button3 = sdn.button3,
  icon4 = sdn.icon4,
  textLabel3,
  button4 = sdn.button4,
  icon5 = sdn.icon5,
  textLabel4,
  children,
  seldonRefs,
  ...props
}: DialogProps) {
  const dialogClassName = combineClassNames("sdn-dialog", className)
  const barProps = applyRef(
    seldonRefs,
    bar === null
      ? null
      : {
          ...sdn.bar,
          ...bar,
          className: combineClassNames(sdn.bar?.className, bar?.className),
        },
  )
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        },
  )
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
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

  return (
    <HTMLDiv
      className={dialogClassName}
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
              {buttonIconic && buttonIconicProps && (
                <ButtonIconic {...buttonIconicProps} icon={iconProps} />
              )}
              {button && buttonProps && (
                <Button {...buttonProps}>
                  {icon2 && icon2Props && <Icon {...icon2Props} />}
                  {textLabel && textLabelProps && (
                    <TextLabel {...textLabelProps} />
                  )}
                </Button>
              )}
            </Bar>
          )}
          <Frame {...frameProps}></Frame>
          {barButtonsProps !== null && (
            <BarButtons
              {...barButtonsProps}
              button={button2Props}
              button2={button3Props}
              button3={button4Props}
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
const sdn: DialogProps = {
  role: "dialog",
  "aria-hidden": "false",
  className: "sdn-dialog",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--yje0",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--qbtu",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
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
    className: "sdn-text-label sdn-text-label--ylte",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--88jo",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar-buttons--dabm",
  },
  button2: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  button3: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "material-remove",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
  button4: {
    className: "sdn-button sdn-button-iconic--pgsr",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--ylte",
  },
}
