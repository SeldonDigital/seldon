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
import { LiHTMLAttributes } from "react"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { ComboboxField, ComboboxFieldProps } from "../elements/ComboboxField"
import {
  FormControlCombobox,
  FormControlComboboxProps,
} from "../elements/FormControlCombobox"
import { HTMLLi } from "../native-react/HTML.Li"
import { IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ItemPropertyProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  formControlCombobox?: FormControlComboboxProps | null
  input?: InputProps | null
  comboboxField?: ComboboxFieldProps | null
  icon2?: IconProps | null
  input2?: InputProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon4?: IconProps | null
}

/*****
 * Item: ItemProperty
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ItemProperty
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   input="{}"
 *   comboboxField="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 *****/
export function ItemProperty({
  className = "",
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  formControlCombobox = sdn.formControlCombobox,
  input,
  comboboxField = sdn.comboboxField,
  icon2 = sdn.icon2,
  input2 = sdn.input2,
  buttonIconic2 = sdn.buttonIconic2,
  icon3 = sdn.icon3,
  buttonIconic3 = sdn.buttonIconic3,
  icon4 = sdn.icon4,
  children,
  seldonRefs,
  ...props
}: ItemPropertyProps) {
  const itemPropertyClassName = combineClassNames(
    "sdn-item-property",
    className,
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
  const formControlComboboxProps = applyRef(
    seldonRefs,
    formControlCombobox === null
      ? null
      : {
          ...sdn.formControlCombobox,
          ...formControlCombobox,
          className: combineClassNames(
            sdn.formControlCombobox?.className,
            formControlCombobox?.className,
          ),
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
  const comboboxFieldProps = applyRef(
    seldonRefs,
    comboboxField === null
      ? null
      : {
          ...sdn.comboboxField,
          ...comboboxField,
          className: combineClassNames(
            sdn.comboboxField?.className,
            comboboxField?.className,
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
  const input2Props = applyRef(
    seldonRefs,
    input2 === null
      ? null
      : {
          ...sdn.input2,
          ...input2,
          className: combineClassNames(
            sdn.input2?.className,
            input2?.className,
          ),
        },
  )
  const buttonIconic2Props = applyRef(
    seldonRefs,
    buttonIconic2 === null
      ? null
      : {
          ...sdn.buttonIconic2,
          ...buttonIconic2,
          className: combineClassNames(
            sdn.buttonIconic2?.className,
            buttonIconic2?.className,
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
  const buttonIconic3Props = applyRef(
    seldonRefs,
    buttonIconic3 === null
      ? null
      : {
          ...sdn.buttonIconic3,
          ...buttonIconic3,
          className: combineClassNames(
            sdn.buttonIconic3?.className,
            buttonIconic3?.className,
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

  return (
    <HTMLLi
      className={itemPropertyClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && (
            <ButtonIconic {...buttonIconicProps} icon={iconProps} />
          )}
          {formControlComboboxProps !== null && (
            <FormControlCombobox {...formControlComboboxProps}>
              {input && inputProps && <Input {...inputProps} />}
              {comboboxField && comboboxFieldProps && (
                <ComboboxField
                  {...comboboxFieldProps}
                  icon={icon2Props}
                  input={input2Props}
                  buttonIconic={buttonIconic2Props}
                  icon2={icon3Props}
                />
              )}
            </FormControlCombobox>
          )}
          {buttonIconic3Props !== null && (
            <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemPropertyProps = {
  "aria-hidden": "false",
  className: "sdn-item-property sdn-item",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyToggle",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "propertyToggleIcon",
  },
  formControlCombobox: {
    "aria-hidden": "false",
    className: "sdn-form-control sdn-form-control-combobox--qmop",
  },
  input: {
    className: "sdn-input sdn-input--jvsw",
    "data-seldon-ref": "propertyLabel",
  },
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--j44i",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "valueIcon",
  },
  input2: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--iegt",
    "data-seldon-ref": "valueLabel",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "valueOptionsMenu",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyActions",
  },
  icon4: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}
