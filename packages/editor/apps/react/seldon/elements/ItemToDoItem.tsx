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

import { Chip, ChipProps } from "../elements/Chip"
import { HTMLLi } from "../native-react/HTML.Li"
import { Icon, IconProps } from "../primitives/Icon"
import { InputCheckbox, InputCheckboxProps } from "../primitives/InputCheckbox"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemToDoItemProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  inputCheckbox?: InputCheckboxProps | null

  textLabel?: TextLabelProps | null

  chip?: ChipProps | null
  icon?: IconProps | null
  textLabel2?: TextLabelProps | null

  chip2?: ChipProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null

  chip3?: ChipProps | null
  textLabel4?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ItemToDoItemProps = {
  "aria-hidden": "false",
  inputCheckbox: {
    placeholder: "Placeholder text",
    className: "sdn-input-checkbox sdn-input-checkbox--vajr",
  },

  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text--s4kj",
  },

  chip: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--jsvs",
  },
  icon: {
    icon: "seldon-plus",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel2: {
    children: "Add",
    className: "sdn-text-label sdn-text-label--lug5",
  },

  chip2: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--jsvs",
  },
  icon2: {
    icon: "seldon-minus",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel3: {
    children: "Remove",
    className: "sdn-text-label sdn-text-label--lug5",
  },

  chip3: {
    "aria-hidden": "false",
    className: "sdn-chip sdn-chip--jsvs",
  },
  textLabel4: {
    children: "999",
    className: "sdn-text-label sdn-text-label--lug5",
  },
}

/**
 * Item: ItemToDoItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   InputCheckbox  inputCheckbox
 *   TextLabel      textLabel
 *   Chip           chip
 *     Icon         icon
 *     TextLabel    textLabel2
 *   Chip           chip2
 *     Icon         icon2
 *     TextLabel    textLabel3
 *   Chip           chip3
 *     TextLabel    textLabel4
 *
 * @example
 * ```tsx
 * <ItemToDoItem
 *   aria-hidden="false"
 *   inputCheckbox="{}"
 *   textLabel="{}"
 *   chip="{}"
 *   icon="material-star"
 *   chip2="{}"
 *   chip3="{}"
 * />
 * ```
 */
export function ItemToDoItem({
  className = "",
  inputCheckbox,

  textLabel,

  chip,
  icon,
  textLabel2,

  chip2,
  icon2,
  textLabel3,

  chip3,
  textLabel4,

  children,
  seldonRefs,
  ...props
}: ItemToDoItemProps) {
  const itemToDoItemClassName = combineClassNames("sdn-item", className)

  const inputCheckboxProps = mergeOptionalSlot(sdn.inputCheckbox, inputCheckbox, seldonRefs)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const chipProps = mergeSlot(sdn.chip, chip, seldonRefs)
  const iconProps = mergeOptionalSlot(sdn.icon, icon, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  const chip2Props = mergeSlot(sdn.chip2, chip2, seldonRefs)
  const icon2Props = mergeOptionalSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  const chip3Props = mergeSlot(sdn.chip3, chip3, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)

  return (
    <HTMLLi className={itemToDoItemClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {inputCheckboxProps !== null && <InputCheckbox {...inputCheckboxProps} />}
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          {chipProps !== null && (
            <Chip {...chipProps}>
              {iconProps !== null && <Icon {...iconProps} />}
              {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
            </Chip>
          )}
          {chip2Props !== null && (
            <Chip {...chip2Props}>
              {icon2Props !== null && <Icon {...icon2Props} />}
              {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
            </Chip>
          )}
          {chip3Props !== null && (
            <Chip {...chip3Props}>
              {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            </Chip>
          )}
        </>
      )}
    </HTMLLi>
  )
}
