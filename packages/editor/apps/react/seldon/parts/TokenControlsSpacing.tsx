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
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface TokenControlsSpacingProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  formControlCombobox?: FormControlComboboxProps | null
  comboboxField?: ComboboxFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null

  formControlCombobox2?: FormControlComboboxProps | null
  comboboxField2?: ComboboxFieldProps | null
  icon3?: IconProps | null
  input2?: InputProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon4?: IconProps | null

  formControlCombobox3?: FormControlComboboxProps | null
  comboboxField3?: ComboboxFieldProps | null
  icon5?: IconProps | null
  input3?: InputProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon6?: IconProps | null
}

//
// Default property values
//
const sdn: TokenControlsSpacingProps = {
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
    icon: "material-padding",
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

  formControlCombobox2: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField2: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon3: {
    icon: "seldon-gap",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  input2: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iocq",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },

  formControlCombobox3: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--ujby",
  },
  comboboxField3: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--2lb1",
  },
  icon5: {
    icon: "material-margin",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rdh1",
  },
  input3: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iocq",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon6: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--qwbk",
  },
}

/**
 * Part: TokenControlsSpacing
 * Level: Part
 * Intent: HUD like controls for adjusting related properties directly on the canvas
 * Tags:
 * Type: Custom
 *
 * Structure:
 *   FormControlCombobox  formControlCombobox
 *     ComboboxField      comboboxField
 *       Icon             icon
 *       Input            input
 *       ButtonIconic     buttonIconic
 *         Icon           icon2
 *   FormControlCombobox  formControlCombobox2
 *     ComboboxField      comboboxField2
 *       Icon             icon3
 *       Input            input2
 *       ButtonIconic     buttonIconic2
 *         Icon           icon4
 *   FormControlCombobox  formControlCombobox3
 *     ComboboxField      comboboxField3
 *       Icon             icon5
 *       Input            input3
 *       ButtonIconic     buttonIconic3
 *         Icon           icon6
 *
 * @example
 * ```tsx
 * <TokenControlsSpacing
 *   aria-hidden="false"
 *   formControlCombobox="{}"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   formControlCombobox2="{}"
 *   formControlCombobox3="{}"
 * />
 * ```
 */
export function TokenControlsSpacing({
  className = "",
  formControlCombobox,
  comboboxField,
  icon,
  input,
  buttonIconic,
  icon2,

  formControlCombobox2,
  comboboxField2,
  icon3,
  input2,
  buttonIconic2,
  icon4,

  formControlCombobox3,
  comboboxField3,
  icon5,
  input3,
  buttonIconic3,
  icon6,

  children,
  seldonRefs,
  ...props
}: TokenControlsSpacingProps) {
  const tokenControlsSpacingClassName = combineClassNames("sdn-token-controls", className)

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

  const formControlCombobox2Props = mergeSlot(
    sdn.formControlCombobox2,
    formControlCombobox2,
    seldonRefs,
  )
  const comboboxField2Props = mergeSlot(sdn.comboboxField2, comboboxField2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const input2Props = mergeSlot(sdn.input2, input2, seldonRefs)
  const buttonIconic2Props = mergeSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  const formControlCombobox3Props = mergeSlot(
    sdn.formControlCombobox3,
    formControlCombobox3,
    seldonRefs,
  )
  const comboboxField3Props = mergeSlot(sdn.comboboxField3, comboboxField3, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const input3Props = mergeSlot(sdn.input3, input3, seldonRefs)
  const buttonIconic3Props = mergeSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)

  return (
    <HTMLDiv className={tokenControlsSpacingClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
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
          {formControlCombobox2Props !== null && (
            <FormControlCombobox
              {...formControlCombobox2Props}
              comboboxField={comboboxField2Props}
              icon={icon3Props}
              input={input2Props}
              buttonIconic={buttonIconic2Props}
              icon2={icon4Props}
              textLabel={null}
            />
          )}
          {formControlCombobox3Props !== null && (
            <FormControlCombobox
              {...formControlCombobox3Props}
              comboboxField={comboboxField3Props}
              icon={icon5Props}
              input={input3Props}
              buttonIconic={buttonIconic3Props}
              icon2={icon6Props}
              textLabel={null}
            />
          )}
        </>
      )}
    </HTMLDiv>
  )
}
