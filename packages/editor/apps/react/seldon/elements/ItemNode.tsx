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
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemNodeProps extends LiHTMLAttributes<HTMLLIElement> {
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
}

//
// Default property values
//
const sdn: ItemNodeProps = {
  role: "treeitem",
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "nodeDisclosure",
  },
  icon: {
    icon: "material-keyboardArrowDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
    "data-seldon-ref": "nodeDisclosureIcon",
  },

  comboboxField: {
    className: "sdn-combobox-field sdn-combobox-field--lmje",
    "data-seldon-ref": "nodeField",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "nodeIcon",
  },
  input: {
    placeholder: "Component Name",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--pzcf",
    "data-seldon-ref": "nodeLabel",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "nodeDisplay",
  },
  icon3: {
    icon: "seldon-display",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "nodeDisplayIcon",
  },

  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "nodeActions",
  },
  icon4: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
}

/**
 * Item: ItemNode
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic    buttonIconic   -> nodeDisclosure
 *     Icon          icon           -> nodeDisclosureIcon
 *   ComboboxField   comboboxField  -> nodeField
 *     Icon          icon2          -> nodeIcon
 *     Input         input          -> nodeLabel
 *     ButtonIconic  buttonIconic2  -> nodeDisplay
 *       Icon        icon3          -> nodeDisplayIcon
 *   ButtonIconic    buttonIconic3  -> nodeActions
 *     Icon          icon4
 *
 * @example
 * ```tsx
 * <ItemNode
 *   role="treeitem"
 *   aria-hidden="false"
 * />
 * ```
 */
export function ItemNode({
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

  children,
  seldonRefs,
  ...props
}: ItemNodeProps) {
  const itemNodeClassName = combineClassNames("sdn-item-node", className)

  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const comboboxFieldProps = mergeOptionalSlot(sdn.comboboxField, comboboxField, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconic2Props = mergeSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  const buttonIconic3Props = mergeOptionalSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  return (
    <HTMLLi
      className={itemNodeClassName}
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
        </>
      )}
    </HTMLLi>
  )
}
