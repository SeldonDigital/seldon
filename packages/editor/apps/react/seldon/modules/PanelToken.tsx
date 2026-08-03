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

import { ButtonIconicProps } from "../elements/ButtonIconic"
import { ChipAssist, ChipAssistProps } from "../elements/ChipAssist"
import { ComboboxFieldProps } from "../elements/ComboboxField"
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { Frame, FrameProps } from "../frames/Frame"
import { TokenControls, TokenControlsProps } from "../frames/TokenControls"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface PanelTokenProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  chipAssist?: ChipAssistProps | null
  textLabel?: TextLabelProps | null
  icon?: IconProps | null

  frame?: FrameProps | null
  tokenControls?: TokenControlsProps | null
  formControlCombobox?: FormControlComboboxProps | null
  comboboxField?: ComboboxFieldProps | null
  icon2?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon3?: IconProps | null
}

//
// Default property values
//
const sdn: PanelTokenProps = {
  role: "dialog",
  "aria-hidden": "false",
  chipAssist: {
    className: "sdn-chip sdn-chip-assist--1bvt",
  },
  textLabel: {
    children: "TokenName",
    className: "sdn-text-label sdn-text-label--299x",
  },
  icon: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--gh8m",
  },

  frame: {
    wrapperElement: "div",
    role: "dialog",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--tnni",
  },
  tokenControls: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-token-controls sdn-token-controls--jakc",
  },
  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon2: {
    icon: "seldon-positionTopLeft",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iocq",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },
}

/**
 * Panel: PanelToken
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * Structure:
 *   ChipAssist               chipAssist
 *     TextLabel              textLabel
 *     Icon                   icon
 *   Frame                    frame
 *     TokenControls          tokenControls
 *       FormControlCombobox  formControlCombobox
 *         ComboboxField      comboboxField
 *           Icon             icon2
 *           Input            input
 *           ButtonIconic     buttonIconic
 *             Icon           icon3
 *
 * @example
 * ```tsx
 * <PanelToken
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 */
export function PanelToken({
  className = "",
  chipAssist,
  textLabel,
  icon,

  frame,
  tokenControls,
  formControlCombobox,
  comboboxField,
  icon2,
  input,
  buttonIconic,
  icon3,

  children,
  seldonRefs,
  ...props
}: PanelTokenProps) {
  const panelTokenClassName = combineClassNames("sdn-panel-token", className)

  const chipAssistProps = mergeOptionalSlot(sdn.chipAssist, chipAssist, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const tokenControlsProps = mergeSlot(sdn.tokenControls, tokenControls, seldonRefs)
  const formControlComboboxProps = mergeOptionalSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  return (
    <HTMLDiv
      className={panelTokenClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {chipAssistProps !== null && (
            <ChipAssist {...chipAssistProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
              {iconProps !== null && <Icon {...iconProps} />}
            </ChipAssist>
          )}
          <Frame {...frameProps}>
            <Frame {...tokenControlsProps}>
              {formControlComboboxProps !== null && (
                <FormControlCombobox
                  {...formControlComboboxProps}
                  comboboxField={comboboxFieldProps}
                  icon={icon2Props}
                  input={inputProps}
                  buttonIconic={buttonIconicProps}
                  icon2={icon3Props}
                  textLabel={null}
                />
              )}
            </Frame>
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
