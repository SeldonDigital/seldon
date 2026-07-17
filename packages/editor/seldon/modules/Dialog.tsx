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
import { ButtonIconicProps } from "../elements/ButtonIconic"
import {
  ComboboxFieldSearch,
  ComboboxFieldSearchProps,
} from "../elements/ComboboxFieldSearch"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
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
  comboboxFieldSearch?: ComboboxFieldSearchProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
  frame?: FrameProps | null
  barButtons?: BarButtonsProps | null
  frame2?: FrameProps | null
  button?: ButtonProps | null
  icon3?: IconProps | null
  textLabel?: TextLabelProps | null
  button2?: ButtonProps | null
  icon4?: IconProps | null
  textLabel2?: TextLabelProps | null
  button3?: ButtonProps | null
  icon5?: IconProps | null
  textLabel3?: TextLabelProps | null
  frame3?: FrameProps | null
  button4?: ButtonProps | null
  icon6?: IconProps | null
  textLabel4?: TextLabelProps | null
  button5?: ButtonProps | null
  icon7?: IconProps | null
  textLabel5?: TextLabelProps | null
}

/*****
 * Module: Dialog
 * Level: Module
 * Intent:
 * Tags:
 * Type: Inline
 *
 * @example
 * ```tsx
 * <Dialog
 *   aria-hidden="false"
 *   bar="{}"
 *   textTitle="Product Title"
 *   comboboxFieldSearch="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   frame="{}"
 *   barButtons2="{}"
 *   button={() => {}}
 *   textLabel="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame2="{}"
 * />
 * ```
 *****/
export function Dialog({
  className = "",
  bar = sdn.bar,
  textTitle,
  comboboxFieldSearch,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  frame = sdn.frame,
  barButtons = sdn.barButtons,
  frame2 = sdn.frame2,
  button,
  icon3,
  textLabel,
  button2,
  icon4 = sdn.icon4,
  textLabel2,
  button3,
  icon5 = sdn.icon5,
  textLabel3,
  frame3 = sdn.frame3,
  button4,
  icon6 = sdn.icon6,
  textLabel4,
  button5,
  icon7 = sdn.icon7,
  textLabel5,
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
  const comboboxFieldSearchProps = applyRef(
    seldonRefs,
    comboboxFieldSearch === null
      ? null
      : {
          ...sdn.comboboxFieldSearch,
          ...comboboxFieldSearch,
          className: combineClassNames(
            sdn.comboboxFieldSearch?.className,
            comboboxFieldSearch?.className,
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
  const inputProps = applyRef(
    seldonRefs,
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
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
  const icon6Props = applyRef(
    seldonRefs,
    icon6 === null
      ? null
      : {
          ...sdn.icon6,
          ...icon6,
          className: combineClassNames(sdn.icon6?.className, icon6?.className),
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
  const icon7Props = applyRef(
    seldonRefs,
    icon7 === null
      ? null
      : {
          ...sdn.icon7,
          ...icon7,
          className: combineClassNames(sdn.icon7?.className, icon7?.className),
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

  return (
    <HTMLDiv
      className={dialogClassName}
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
              {comboboxFieldSearch && comboboxFieldSearchProps && (
                <ComboboxFieldSearch
                  {...comboboxFieldSearchProps}
                  icon={iconProps}
                  input={inputProps}
                  buttonIconic={buttonIconicProps}
                  icon2={icon2Props}
                />
              )}
            </Bar>
          )}
          <Frame {...frameProps}></Frame>
          {barButtonsProps !== null && (
            <BarButtons {...barButtonsProps}>
              <Frame {...frame2Props}>
                {button && buttonProps && (
                  <Button {...buttonProps}>
                    {icon3 && icon3Props && <Icon {...icon3Props} />}
                    {textLabel && textLabelProps && (
                      <TextLabel {...textLabelProps} />
                    )}
                  </Button>
                )}
                {button2 && button2Props && (
                  <Button {...button2Props}>
                    {icon4 && icon4Props && <Icon {...icon4Props} />}
                    {textLabel2 && textLabel2Props && (
                      <TextLabel {...textLabel2Props} />
                    )}
                  </Button>
                )}
                {button3 && button3Props && (
                  <Button {...button3Props}>
                    {icon5 && icon5Props && <Icon {...icon5Props} />}
                    {textLabel3 && textLabel3Props && (
                      <TextLabel {...textLabel3Props} />
                    )}
                  </Button>
                )}
              </Frame>
              <Frame {...frame3Props}>
                {button4 && button4Props && (
                  <Button {...button4Props}>
                    {icon6 && icon6Props && <Icon {...icon6Props} />}
                    {textLabel4 && textLabel4Props && (
                      <TextLabel {...textLabel4Props} />
                    )}
                  </Button>
                )}
                {button5 && button5Props && (
                  <Button {...button5Props}>
                    {icon7 && icon7Props && <Icon {...icon7Props} />}
                    {textLabel5 && textLabel5Props && (
                      <TextLabel {...textLabel5Props} />
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
const sdn: DialogProps = {
  "aria-hidden": "false",
  className: "sdn-dialog",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--zhvk",
  },
  textTitle: {
    children: "Dialog",
    htmlElement: "h4",
    "aria-hidden": "false",
    className: "sdn-text-title sdn-text-title--eodu",
  },
  comboboxFieldSearch: {
    "aria-hidden": "false",
    className: "sdn-combobox-field-search sdn-combobox-field-search--9jd5",
  },
  icon: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Search for...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--rbpu",
  },
  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--ymyq",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel: {
    children: "Button",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--ls8f",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel2: {
    children: "Button",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button3: {
    className: "sdn-button sdn-button--ls8f",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel3: {
    children: "Button",
    htmlElement: "label",
    "aria-hidden": "false",
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
  icon6: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    children: "Cancel",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button5: {
    className: "sdn-button sdn-button--upjl",
  },
  icon7: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    children: "OK",
    htmlElement: "label",
    "aria-hidden": "false",
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}
