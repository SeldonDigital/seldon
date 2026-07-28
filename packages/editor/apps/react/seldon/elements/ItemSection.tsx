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
import { FormControlCombobox, FormControlComboboxProps } from "../elements/FormControlCombobox"
import { HTMLLi } from "../native-react/HTML.Li"
import { IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ItemSectionProps extends LiHTMLAttributes<HTMLLIElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null

  formControlCombobox?: FormControlComboboxProps | null
  textLabel?: TextLabelProps | null

  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null

  buttonIconic3?: ButtonIconicProps | null
  icon3?: IconProps | null
}

//
// Default property values
//
const sdn: ItemSectionProps = {
  "aria-hidden": "false",
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionDisclosure",
  },
  icon: {
    icon: "material-unfoldMore",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
    "data-seldon-ref": "sectionDisclosureIcon",
  },

  formControlCombobox: {
    className: "sdn-form-control sdn-form-control-combobox--gqrl",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--z34z",
    "data-seldon-ref": "sectionLabel",
  },

  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--sdjv",
    "data-seldon-ref": "sectionAdd",
  },
  icon2: {
    icon: "material-add",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--0qvc",
  },

  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "sectionActions",
  },
  icon3: {
    icon: "seldon-more",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--0qvc",
  },
}

/**
 * Item: ItemSection
 * Level: Element
 * Intent: Default list item used for general content with flexible layout.
 * Tags: list, item, standard, default, row, UI, layout, general
 * Type: Custom
 *
 * Structure:
 *   ButtonIconic         buttonIconic         -> sectionDisclosure
 *     Icon               icon                 -> sectionDisclosureIcon
 *   FormControlCombobox  formControlCombobox
 *     TextLabel          textLabel            -> sectionLabel
 *   ButtonIconic         buttonIconic2        -> sectionAdd
 *     Icon               icon2
 *   ButtonIconic         buttonIconic3        -> sectionActions
 *     Icon               icon3
 *
 * @example
 * ```tsx
 * <ItemSection
 *   aria-hidden="false"
 *   buttonIconic={() => {}}
 *   icon="material-star"
 *   formControlCombobox="{}"
 *   textLabel="{}"
 *   buttonIconic2={() => {}}
 *   buttonIconic3={() => {}}
 * />
 * ```
 */
export function ItemSection({
  className = "",
  buttonIconic,
  icon,

  formControlCombobox,
  textLabel,

  buttonIconic2,
  icon2,

  buttonIconic3,
  icon3,

  children,
  seldonRefs,
  ...props
}: ItemSectionProps) {
  const itemSectionClassName = combineClassNames("sdn-item-section", className)

  const buttonIconicProps = mergeOptionalSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const formControlComboboxProps = mergeOptionalSlot(
    sdn.formControlCombobox,
    formControlCombobox,
    seldonRefs,
  )
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const buttonIconic2Props = mergeOptionalSlot(sdn.buttonIconic2, buttonIconic2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  const buttonIconic3Props = mergeOptionalSlot(sdn.buttonIconic3, buttonIconic3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)

  return (
    <HTMLLi className={itemSectionClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={iconProps} />}
          {formControlComboboxProps !== null && (
            <FormControlCombobox {...formControlComboboxProps}>
              {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            </FormControlCombobox>
          )}
          {buttonIconic2Props !== null && (
            <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
          )}
          {buttonIconic3Props !== null && (
            <ButtonIconic {...buttonIconic3Props} icon={icon3Props} />
          )}
        </>
      )}
    </HTMLLi>
  )
}
