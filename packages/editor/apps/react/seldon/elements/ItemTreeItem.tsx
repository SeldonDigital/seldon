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
import { HTMLLi } from "../native-react/HTML.Li"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface ItemTreeItemProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  comboboxField?: ComboboxFieldProps | null
  icon2?: IconProps | null
  input?: InputProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon3?: IconProps | null

  buttonIconic3?: ButtonIconicProps | null
  icon4?: IconProps | null

  buttonIconic4?: ButtonIconicProps | null
  icon5?: IconProps | null
}

//
// Default property values
//
const sdn: ItemTreeItemProps = {
  role: "treeitem",
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },

  comboboxField: {
    "aria-hidden": "false",
    className: "sdn-combobox-field sdn-combobox-field--j44i",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Placeholder text",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--n6aw",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },

  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },

  buttonIconic4: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon5: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}

/**
 * Item: ItemTreeItem
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic    buttonIconic
 *     Icon          icon
 *   ComboboxField   comboboxField
 *     Icon          icon2
 *     Input         input
 *     ButtonIconic  buttonIconic2
 *       Icon        icon3
 *   ButtonIconic    buttonIconic3
 *     Icon          icon4
 *   ButtonIconic    buttonIconic4
 *     Icon          icon5
 *
 * @example
 * ```tsx
 * <ItemTreeItem
 *   role="treeitem"
 *   aria-hidden="false"
 * />
 * ```
 */
export function ItemTreeItem({
  className = "",
  buttonIconic,
  icon,

  comboboxField,
  icon2,
  input,
  buttonIconic2,
  icon3,

  buttonIconic3,
  icon4,

  buttonIconic4,
  icon5,

  children,
  seldonRefs,
  ...props
}: ItemTreeItemProps) {
  const itemTreeItemClassName = combineClassNames("sdn-item-tree-item", className)

  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const comboboxFieldProps = mergeSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconic2Props = mergeSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  const buttonIconic3Props = mergeSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  const buttonIconic4Props = mergeSlot(sdn.buttonIconic4, buttonIconic4, seldonRefs)
  const icon5Props = mergeSlot(sdn.icon5, icon5, seldonRefs)

  return (
    <HTMLLi
      className={itemTreeItemClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
          {comboboxFieldProps !== null && (
            <ComboboxField
              {...comboboxFieldProps}
              icon={icon2Props}
              input={inputProps}
              buttonIconic={buttonIconic2Props}
              icon2={icon3Props}
            />
          )}
          {buttonIconic3Props !== null && (
            <ButtonIconic {...buttonIconic3Props} icon={icon4Props} />
          )}
          {buttonIconic4Props !== null && (
            <ButtonIconic {...buttonIconic4Props} icon={icon5Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}
