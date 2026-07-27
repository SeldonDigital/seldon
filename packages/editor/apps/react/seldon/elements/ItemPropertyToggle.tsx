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
import {
  FormControlCombobox,
  FormControlComboboxProps,
} from "../elements/FormControlCombobox"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { ToggleSwitch, ToggleSwitchProps } from "../primitives/ToggleSwitch"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ItemPropertyToggleProps extends LiHTMLAttributes<HTMLLIElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  formControlCombobox?: FormControlComboboxProps | null
  input?: InputProps | null
  frame?: FrameProps | null
  icon2?: IconProps | null
  toggleSwitch?: ToggleSwitchProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null
}

/*****
 * Item: ItemPropertyToggle
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ItemPropertyToggle
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   input="{}"
 *   frame="{}"
 *   toggleSwitch="{}"
 *   buttonIconic2={() => {}}
 * />
 * ```
 *****/
export function ItemPropertyToggle({
  className = "",
  buttonIconic,
  icon = sdn.icon,
  formControlCombobox,
  input,
  frame = sdn.frame,
  icon2,
  toggleSwitch,
  buttonIconic2,
  icon3 = sdn.icon3,
  children,
  seldonRefs,
  ...props
}: ItemPropertyToggleProps) {
  const itemPropertyToggleClassName = combineClassNames(
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
  const toggleSwitchProps = applyRef(
    seldonRefs,
    toggleSwitch === null
      ? null
      : {
          ...sdn.toggleSwitch,
          ...toggleSwitch,
          className: combineClassNames(
            sdn.toggleSwitch?.className,
            toggleSwitch?.className,
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

  return (
    <HTMLLi
      className={itemPropertyToggleClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconic && buttonIconicProps && (
            <ButtonIconic {...buttonIconicProps} icon={iconProps} />
          )}
          {formControlCombobox && formControlComboboxProps && (
            <FormControlCombobox {...formControlComboboxProps}>
              {input && inputProps && <Input {...inputProps} />}
              <Frame {...frameProps}>
                {icon2 && icon2Props && <Icon {...icon2Props} />}
                {toggleSwitch && toggleSwitchProps && (
                  <ToggleSwitch {...toggleSwitchProps} />
                )}
              </Frame>
            </FormControlCombobox>
          )}
          {buttonIconic2 && buttonIconic2Props && (
            <ButtonIconic {...buttonIconic2Props} icon={icon3Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}

//
// Default property values
//
const sdn: ItemPropertyToggleProps = {
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
    className: "sdn-form-control sdn-form-control-combobox--qmop",
  },
  input: {
    className: "sdn-input sdn-input--jvsw",
    "data-seldon-ref": "propertyLabel",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--inf3",
  },
  icon2: {
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "toggleIcon",
  },
  toggleSwitch: {
    className: "sdn-toggle-switch sdn-toggle-switch--pelh",
    "data-seldon-ref": "toggleValue",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "propertyActions",
  },
  icon3: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
}
