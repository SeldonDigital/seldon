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
import { Frame, FrameProps } from "../frames/Frame"
import { ListboxGrouped, ListboxGroupedProps } from "../parts/ListboxGrouped"
import { HrProps } from "../primitives/Hr"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ComboboxGroupedProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  comboboxField?: ComboboxFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
  listboxGrouped?: ListboxGroupedProps | null
  frame?: FrameProps | null
  textLabel?: TextLabelProps | null
  listboxOption?: ListboxOptionProps | null
  icon3?: IconProps | null
  textLabel2?: TextLabelProps | null
  listboxOption2?: ListboxOptionProps | null
  icon4?: IconProps | null
  textLabel3?: TextLabelProps | null
  hr?: HrProps | null
  frame2?: FrameProps | null
  textLabel4?: TextLabelProps | null
  listboxOption3?: ListboxOptionProps | null
  icon5?: IconProps | null
  textLabel5?: TextLabelProps | null
  listboxOption4?: ListboxOptionProps | null
  icon6?: IconProps | null
  textLabel6?: TextLabelProps | null
}

/*****
 * Combobox: ComboboxGrouped
 * Level: Part
 * Intent: Editable field paired with a listbox of options to choose from.
 * Tags: combobox, select, dropdown, input, part, UI
 * Type: Custom
 *
 * @example
 * ```tsx
 * <ComboboxGrouped
 *   aria-hidden="false"
 *   comboboxField="{}"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 *   listboxGrouped="{}"
 *   frame="{}"
 *   textLabel="{}"
 *   listboxOption="{}"
 *   listboxOption2="{}"
 *   hr="{}"
 *   frame2="{}"
 * />
 * ```
 *****/
export function ComboboxGrouped({
  className = "",
  comboboxField = sdn.comboboxField,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  listboxGrouped = sdn.listboxGrouped,
  frame = sdn.frame,
  textLabel,
  listboxOption,
  icon3 = sdn.icon3,
  textLabel2,
  listboxOption2,
  icon4 = sdn.icon4,
  textLabel3,
  hr = sdn.hr,
  frame2 = sdn.frame2,
  textLabel4,
  listboxOption3,
  icon5 = sdn.icon5,
  textLabel5,
  listboxOption4,
  icon6 = sdn.icon6,
  textLabel6,
  children,
  seldonRefs,
  ...props
}: ComboboxGroupedProps) {
  const comboboxGroupedClassName = combineClassNames("sdn-combobox", className)
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
  const listboxGroupedProps = applyRef(
    seldonRefs,
    listboxGrouped === null
      ? null
      : {
          ...sdn.listboxGrouped,
          ...listboxGrouped,
          className: combineClassNames(
            sdn.listboxGrouped?.className,
            listboxGrouped?.className,
          ),
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
  const hrProps = applyRef(
    seldonRefs,
    hr === null
      ? null
      : {
          ...sdn.hr,
          ...hr,
          className: combineClassNames(sdn.hr?.className, hr?.className),
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
  const listboxOption4Props = applyRef(
    seldonRefs,
    listboxOption4 === null
      ? null
      : {
          ...sdn.listboxOption4,
          ...listboxOption4,
          className: combineClassNames(
            sdn.listboxOption4?.className,
            listboxOption4?.className,
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
  const textLabel6Props = applyRef(
    seldonRefs,
    textLabel6 === null
      ? null
      : {
          ...sdn.textLabel6,
          ...textLabel6,
          className: combineClassNames(
            sdn.textLabel6?.className,
            textLabel6?.className,
          ),
        },
  )

  return (
    <Frame
      className={comboboxGroupedClassName}
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
          {listboxGroupedProps !== null && (
            <ListboxGrouped
              {...listboxGroupedProps}
              frame={frameProps}
              hr={hrProps}
              frame2={frame2Props}
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
const sdn: ComboboxGroupedProps = {
  "aria-hidden": "false",
  className: "sdn-combobox sdn-combobox",
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
  listboxGrouped: {
    role: "listbox",
    "aria-hidden": "false",
    className: "sdn-listbox sdn-listbox--4wpg",
  },
  frame: {
    wrapperElement: "div",
    role: "group",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6o7x",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--oqkb",
  },
  listboxOption: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption2: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  hr: {
    "aria-hidden": "false",
    className: "sdn-hr sdn-hr--xtig",
  },
  frame2: {
    wrapperElement: "div",
    role: "group",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6o7x",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--ptvk",
  },
  listboxOption3: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption4: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon6: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
}
