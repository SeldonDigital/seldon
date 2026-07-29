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

export interface PanelModalProps extends HTMLAttributes<HTMLElement> {
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
  frame3?: FrameProps | null
  button?: ButtonProps | null
  icon3?: IconProps | null
  textLabel?: TextLabelProps | null
  button2?: ButtonProps | null
  icon4?: IconProps | null
  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: PanelModalProps = {
  role: "dialog",
  "aria-hidden": "false",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--zhvk",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--eodu",
  },
  comboboxFieldSearch: {
    className: "sdn-combobox-field-search sdn-combobox-field-search--jaw4",
  },
  icon: {
    icon: "material-search",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ucf5",
  },
  input: {
    placeholder: "Search for...",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--icju",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--zjuk",
  },

  barButtons: {
    "aria-hidden": "false",
    className: "sdn-bar-buttons sdn-bar-buttons--0pge",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ysu5",
  },
  button: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon3: {
    icon: "seldon-none",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
  button2: {
    className: "sdn-button sdn-button--wjtm",
  },
  icon4: {
    icon: "material-check",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--wxqf",
  },
}

/**
 * Panel: PanelModal
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   Bar                    bar
 *     TextTitle            textTitle
 *     ComboboxFieldSearch  comboboxFieldSearch
 *       Icon               icon
 *       Input              input
 *       ButtonIconic       buttonIconic
 *         Icon             icon2
 *   Frame                  frame
 *   BarButtons             barButtons
 *     Frame                frame2
 *     Frame                frame3
 *     Button               button
 *       Icon               icon3
 *       TextLabel          textLabel
 *     Button               button2
 *       Icon               icon4
 *       TextLabel          textLabel2
 *
 * @example
 * ```tsx
 * <PanelModal
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelModal({
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
  frame3,
  button,
  icon3,
  textLabel,
  button2,
  icon4,
  textLabel2,

  children,
  seldonRefs,
  ...props
}: PanelModalProps) {
  const panelModalClassName = combineClassNames("sdn-panel-modal", className)

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
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const buttonProps = mergeSlot(sdn.button, button, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const button2Props = mergeSlot(sdn.button2, button2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <HTMLDiv
      className={panelModalClassName}
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
              <Frame {...frame2Props}></Frame>
              <Frame {...frame3Props}></Frame>
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
            </BarButtons>
          )}
        </>
      )}
    </HTMLDiv>
  )
}
