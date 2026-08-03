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
import { ComboboxFieldProps } from "../elements/ComboboxField"
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { ToggleSwitch, ToggleSwitchProps } from "../primitives/ToggleSwitch"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface TokenControlsAlignmentProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  formControlCombobox?: FormControlComboboxProps | null
  comboboxField?: ComboboxFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null

  frame?: FrameProps | null
  icon3?: IconProps | null
  toggleSwitch?: ToggleSwitchProps | null

  frame2?: FrameProps | null
  icon4?: IconProps | null
  toggleSwitch2?: ToggleSwitchProps | null
}

//
// Default property values
//
const sdn: TokenControlsAlignmentProps = {
  "aria-hidden": "false",
  formControlCombobox: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon: {
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
  icon2: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8wkg",
  },
  icon3: {
    icon: "material-desktopLandscape",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  toggleSwitch: {
    role: "switch",
    "aria-checked": "false",
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
  },

  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--8wkg",
  },
  icon4: {
    icon: "material-wrapText",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  toggleSwitch2: {
    role: "switch",
    "aria-checked": "false",
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
  },
}

/**
 * Part: TokenControlsAlignment
 * Level: Part
 * Intent: HUD like controls for adjusting related properties directly on the canvas
 * Tags:
 * Type: Inline
 *
 * Structure:
 *   FormControlCombobox  formControlCombobox
 *     ComboboxField      comboboxField
 *       Icon             icon
 *       Input            input
 *       ButtonIconic     buttonIconic
 *         Icon           icon2
 *   Frame                frame
 *     Icon               icon3
 *     ToggleSwitch       toggleSwitch
 *   Frame                frame2
 *     Icon               icon4
 *     ToggleSwitch       toggleSwitch2
 *
 * @example
 * ```tsx
 * <TokenControlsAlignment
 *   aria-hidden="false"
 *   formControlCombobox="{}"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   frame="{}"
 *   toggleSwitch="{}"
 *   frame2="{}"
 * />
 * ```
 */
export function TokenControlsAlignment({
  className = "",
  formControlCombobox,
  comboboxField,
  icon,
  input,
  buttonIconic,
  icon2,

  frame,
  icon3,
  toggleSwitch,

  frame2,
  icon4,
  toggleSwitch2,

  children,
  seldonRefs,
  ...props
}: TokenControlsAlignmentProps) {
  const tokenControlsAlignmentClassName = combineClassNames("sdn-token-controls", className)

  const formControlComboboxProps = mergeSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const icon3Props = mergeOptionalSlot(sdn.icon3, icon3, seldonRefs)
  const toggleSwitchProps = mergeOptionalSlot(sdn.toggleSwitch, toggleSwitch, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const icon4Props = mergeOptionalSlot(sdn.icon4, icon4, seldonRefs)
  const toggleSwitch2Props = mergeOptionalSlot(sdn.toggleSwitch2, toggleSwitch2, seldonRefs)

  return (
    <HTMLDiv
      className={tokenControlsAlignmentClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {formControlComboboxProps !== null && (
            <FormControlCombobox
              {...formControlComboboxProps}
              comboboxField={comboboxFieldProps}
              icon={iconProps}
              input={inputProps}
              buttonIconic={buttonIconicProps}
              icon2={icon2Props}
              textLabel={null}
            />
          )}
          <Frame {...frameProps}>
            {icon3Props !== null && <Icon {...icon3Props} />}
            {toggleSwitchProps !== null && <ToggleSwitch {...toggleSwitchProps} />}
          </Frame>
          <Frame {...frame2Props}>
            {icon4Props !== null && <Icon {...icon4Props} />}
            {toggleSwitch2Props !== null && <ToggleSwitch {...toggleSwitch2Props} />}
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}
