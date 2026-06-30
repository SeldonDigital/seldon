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
import { ListboxOptionProps } from "../elements/ListboxOption"
import { Frame } from "../frames/Frame"
import { Listbox, ListboxProps } from "../parts/Listbox"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ComboboxProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  comboboxField?: ComboboxFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
  listbox?: ListboxProps | null
  listboxOption?: ListboxOptionProps | null
  icon3?: IconProps | null
  textLabel?: TextLabelProps | null
  listboxOption2?: ListboxOptionProps | null
  icon4?: IconProps | null
  textLabel2?: TextLabelProps | null
  listboxOption3?: ListboxOptionProps | null
  icon5?: IconProps | null
  textLabel3?: TextLabelProps | null
}

/*****
 * Combobox: Combobox
 * Level: Part
 * Intent: Editable field paired with a listbox of options to choose from.
 * Tags: combobox, select, dropdown, input, part, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <Combobox
 *   aria-hidden="false"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   listbox="{}"
 *   listboxOption="{}"
 *   textLabel="{}"
 *   listboxOption2="{}"
 *   listboxOption3="{}"
 * />
 * ```
 *****/
export function Combobox({
  className = "",
  comboboxField = sdn.comboboxField,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  listbox = sdn.listbox,
  listboxOption = sdn.listboxOption,
  icon3 = sdn.icon3,
  textLabel,
  listboxOption2 = sdn.listboxOption2,
  icon4 = sdn.icon4,
  textLabel2,
  listboxOption3 = sdn.listboxOption3,
  icon5 = sdn.icon5,
  textLabel3,
  children,
  seldonRefs,
  ...props
}: ComboboxProps) {
  const comboboxClassName = combineClassNames("sdn-combobox", className)
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
  const listboxProps = applyRef(
    seldonRefs,
    listbox === null
      ? null
      : {
          ...sdn.listbox,
          ...listbox,
          className: combineClassNames(
            sdn.listbox?.className,
            listbox?.className,
          ),
        },
  )
  const listboxOptionProps = applyRef(
    seldonRefs,
    listboxOption === null
      ? null
      : {
          ...sdn.listboxOption,
          ...listboxOption,
          className: combineClassNames(
            sdn.listboxOption?.className,
            listboxOption?.className,
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
  const listboxOption2Props = applyRef(
    seldonRefs,
    listboxOption2 === null
      ? null
      : {
          ...sdn.listboxOption2,
          ...listboxOption2,
          className: combineClassNames(
            sdn.listboxOption2?.className,
            listboxOption2?.className,
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
  const listboxOption3Props = applyRef(
    seldonRefs,
    listboxOption3 === null
      ? null
      : {
          ...sdn.listboxOption3,
          ...listboxOption3,
          className: combineClassNames(
            sdn.listboxOption3?.className,
            listboxOption3?.className,
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

  return (
    <Frame
      className={comboboxClassName}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
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
          {listboxProps !== null && (
            <Listbox
              {...listboxProps}
              listboxOption={listboxOptionProps}
              listboxOption2={listboxOption2Props}
              listboxOption3={listboxOption3Props}
            />
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: ComboboxProps = {
  "aria-hidden": "false",
  className: "sdn-combobox",
  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--z3a0",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  listbox: {
    role: "listbox",
    "aria-hidden": "false",
    className: "sdn-listbox sdn-listbox--4wpg",
  },
  listboxOption: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption2: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption3: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
}
