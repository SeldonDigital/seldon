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
import { ComboboxFieldSearch, ComboboxFieldSearchProps } from "../elements/ComboboxFieldSearch"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { BarButtons, BarButtonsProps } from "../parts/BarButtons"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelDialogProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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

//
// Default property values
//
const sdn: PanelDialogProps = {
  role: "dialog",
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--zhvk",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--eodu",
    "data-seldon-ref": "dialogTitle",
  },
  comboboxFieldSearch: {
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
    className: "sdn-frame sdn-frame--2wwo",
    "data-seldon-ref": "dialogContent",
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
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel: {
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
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  button4: {
    className: "sdn-button sdn-button--wjtm",
    "data-seldon-ref": "dialogCancel",
  },
  icon6: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button5: {
    className: "sdn-button sdn-button--upjl",
    "data-seldon-ref": "dialogConfirm",
  },
  icon7: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Panel: PanelDialog
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar                    bar
 *     TextTitle            textTitle            -> dialogTitle
 *     ComboboxFieldSearch  comboboxFieldSearch
 *       Icon               icon
 *       Input              input
 *       ButtonIconic       buttonIconic
 *         Icon             icon2
 *   Frame                  frame                -> dialogContent
 *   BarButtons             barButtons
 *     Frame                frame2
 *       Button             button
 *         Icon             icon3
 *         TextLabel        textLabel
 *       Button             button2
 *         Icon             icon4
 *         TextLabel        textLabel2
 *       Button             button3
 *         Icon             icon5
 *         TextLabel        textLabel3
 *     Frame                frame3
 *       Button             button4              -> dialogCancel
 *         Icon             icon6
 *         TextLabel        textLabel4
 *       Button             button5              -> dialogConfirm
 *         Icon             icon7
 *         TextLabel        textLabel5
 *
 * @example
 * ```tsx
 * <PanelDialog
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelDialog({
  className = "",
  bar,
  textTitle,
  comboboxFieldSearch,
  icon,
  input,
  buttonIconic,
  icon2,

  frame,

  barButtons,
  frame2,
  button,
  icon3,
  textLabel,
  button2,
  icon4,
  textLabel2,
  button3,
  icon5,
  textLabel3,
  frame3,
  button4,
  icon6,
  textLabel4,
  button5,
  icon7,
  textLabel5,

  children,
  seldonRefs,
  ...props
}: PanelDialogProps) {
  const panelDialogClassName = combineClassNames("sdn-panel-dialog", className)

  const barProps = mergeSlot(sdn.bar, bar, seldonRefs)
  const textTitleProps = mergeOptionalSlot(sdn.textTitle, textTitle, seldonRefs)
  const comboboxFieldSearchProps = mergeOptionalSlot(
    sdn.comboboxFieldSearch,
    comboboxFieldSearch,
    seldonRefs,
  )
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)

  const barButtonsProps = mergeSlot(sdn.barButtons, barButtons, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonProps = mergeOptionalSlot(sdn.button, button, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const button2Props = mergeOptionalSlot(sdn.button2, button2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const button3Props = mergeOptionalSlot(sdn.button3, button3, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const button4Props = mergeOptionalSlot(sdn.button4, button4, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const button5Props = mergeOptionalSlot(sdn.button5, button5, seldonRefs)
  const icon7Props = mergeSlot(sdn.icon7, icon7, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)

  return (
    <HTMLDiv
      className={panelDialogClassName}
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
              {comboboxFieldSearchProps !== null && (
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
                {buttonProps !== null && (
                  <Button {...buttonProps}>
                    {icon3Props !== null && <Icon {...icon3Props} />}
                    {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                  </Button>
                )}
                {button2Props !== null && (
                  <Button {...button2Props}>
                    {icon4Props !== null && <Icon {...icon4Props} />}
                    {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                  </Button>
                )}
                {button3Props !== null && (
                  <Button {...button3Props}>
                    {icon5Props !== null && <Icon {...icon5Props} />}
                    {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                  </Button>
                )}
              </Frame>
              <Frame {...frame3Props}>
                {button4Props !== null && (
                  <Button {...button4Props}>
                    {icon6Props !== null && <Icon {...icon6Props} />}
                    {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                  </Button>
                )}
                {button5Props !== null && (
                  <Button {...button5Props}>
                    {icon7Props !== null && <Icon {...icon7Props} />}
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
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
