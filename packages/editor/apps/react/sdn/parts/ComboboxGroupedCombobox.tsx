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
import { ComboboxField, ComboboxFieldProps } from "../elements/ComboboxField"
import { Frame } from "../frames/Frame"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot } from "../utils/merge-slot"

export interface ComboboxGroupedComboboxProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  comboboxField?: ComboboxFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
}

//
// Default property values
//
const sdn: ComboboxGroupedComboboxProps = {
  "aria-hidden": "false",
  comboboxField: {
    className: "sdn-combobox-field sdn-combobox-field--z3a0",
  },
  icon: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Placeholder text",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--vsau",
  },
}

/**
 * Combobox: ComboboxGroupedCombobox
 * Level: Part
 * Intent: Editable field paired with a menu of options to choose from.
 * Tags: combobox, select, dropdown, input, part, UI
 * Type: Custom
 *
 * Structure:
 *   ComboboxField   comboboxField
 *     Icon          icon
 *     Input         input
 *     ButtonIconic  buttonIconic
 *       Icon        icon2
 *
 * @example
 * ```tsx
 * <ComboboxGroupedCombobox
 *   aria-hidden="false"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 */
export function ComboboxGroupedCombobox({
  className = "",
  comboboxField,
  icon,
  input,
  buttonIconic,
  icon2,

  children,
  seldonRefs,
  ...props
}: ComboboxGroupedComboboxProps) {
  const comboboxGroupedComboboxClassName = combineClassNames("sdn-combobox", className)

  const comboboxFieldProps = mergeOptionalSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeOptionalSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)

  return (
    <Frame className={comboboxGroupedComboboxClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {comboboxFieldProps !== null && (
            <ComboboxField
              {...comboboxFieldProps}
              icon={iconProps}
              input={inputProps}
              buttonIconic={buttonIconicProps}
              icon2={icon2Props}
            />
          )}
        </>
      )}
    </Frame>
  )
}
