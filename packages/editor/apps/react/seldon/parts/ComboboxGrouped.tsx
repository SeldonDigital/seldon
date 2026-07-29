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
import { ListboxOption, ListboxOptionProps } from "../elements/ListboxOption"
import { Frame, FrameProps } from "../frames/Frame"
import { ListboxGrouped, ListboxGroupedProps } from "../parts/ListboxGrouped"
import { Hr, HrProps } from "../primitives/Hr"
import { Icon, IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ComboboxGroupedProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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

//
// Default property values
//
const sdn: ComboboxGroupedProps = {
  "aria-hidden": "false",
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
    placeholder: "Placeholder text",
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
    children: "Group A",
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
    children: "Option",
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
    children: "Option",
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
    children: "Group B",
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
    children: "Option",
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
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
  },
}

/**
 * Combobox: ComboboxGrouped
 * Level: Part
 * Intent: Editable field paired with a listbox of options to choose from.
 * Tags: combobox, select, dropdown, input, part, UI
 * Type: Custom
 *
 * Structure:
 *   ComboboxField      comboboxField
 *     Icon             icon
 *     Input            input
 *     ButtonIconic     buttonIconic
 *       Icon           icon2
 *   ListboxGrouped     listboxGrouped
 *     Frame            frame
 *       TextLabel      textLabel
 *       ListboxOption  listboxOption
 *         Icon         icon3
 *         TextLabel    textLabel2
 *       ListboxOption  listboxOption2
 *         Icon         icon4
 *         TextLabel    textLabel3
 *     Hr               hr
 *     Frame            frame2
 *       TextLabel      textLabel4
 *       ListboxOption  listboxOption3
 *         Icon         icon5
 *         TextLabel    textLabel5
 *       ListboxOption  listboxOption4
 *         Icon         icon6
 *         TextLabel    textLabel6
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
 */
export function ComboboxGrouped({
  className = "",
  comboboxField,
  icon,
  input,
  buttonIconic,
  icon2,

  listboxGrouped,
  frame,
  textLabel,
  listboxOption,
  icon3,
  textLabel2,
  listboxOption2,
  icon4,
  textLabel3,
  hr,
  frame2,
  textLabel4,
  listboxOption3,
  icon5,
  textLabel5,
  listboxOption4,
  icon6,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: ComboboxGroupedProps) {
  const comboboxGroupedClassName = combineClassNames("sdn-combobox", className)

  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const listboxGroupedProps = mergeSlot(sdn.listboxGrouped, listboxGrouped, seldonRefs)
  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const listboxOptionProps = mergeOptionalSlot(sdn.listboxOption, listboxOption, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const listboxOption2Props = mergeOptionalSlot(sdn.listboxOption2, listboxOption2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const hrProps = mergeSlot(sdn.hr, hr, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const listboxOption3Props = mergeOptionalSlot(sdn.listboxOption3, listboxOption3, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const listboxOption4Props = mergeOptionalSlot(sdn.listboxOption4, listboxOption4, seldonRefs)
  const icon6Props = mergeSlot(sdn.icon6, icon6, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

  return (
    <Frame className={comboboxGroupedClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
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
            <ListboxGrouped {...listboxGroupedProps}>
              <Frame {...frameProps}>
                {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                {listboxOptionProps !== null && (
                  <ListboxOption {...listboxOptionProps}>
                    {icon3Props !== null && <Icon {...icon3Props} />}
                    {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                  </ListboxOption>
                )}
                {listboxOption2Props !== null && (
                  <ListboxOption {...listboxOption2Props}>
                    {icon4Props !== null && <Icon {...icon4Props} />}
                    {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                  </ListboxOption>
                )}
              </Frame>
              {hrProps !== null && <Hr {...hrProps} />}
              <Frame {...frame2Props}>
                {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                {listboxOption3Props !== null && (
                  <ListboxOption {...listboxOption3Props}>
                    {icon5Props !== null && <Icon {...icon5Props} />}
                    {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                  </ListboxOption>
                )}
                {listboxOption4Props !== null && (
                  <ListboxOption {...listboxOption4Props}>
                    {icon6Props !== null && <Icon {...icon6Props} />}
                    {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                  </ListboxOption>
                )}
              </Frame>
            </ListboxGrouped>
          )}
        </>
      )}
    </Frame>
  )
}
