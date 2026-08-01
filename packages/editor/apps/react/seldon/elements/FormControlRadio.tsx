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

import { MenuItemRadio, MenuItemRadioProps } from "../elements/MenuItemRadio"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface FormControlRadioProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  textLabel?: TextLabelProps | null

  frame?: FrameProps | null
  menuItemRadio?: MenuItemRadioProps | null
  icon?: IconProps | null
  textLabel2?: TextLabelProps | null
  menuItemRadio2?: MenuItemRadioProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null
}

//
// Default property values
//
const sdn: FormControlRadioProps = {
  "aria-hidden": "false",
  textLabel: {
    children: "Label",
    className: "sdn-text-label sdn-text-label--fwkw",
  },

  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--pgac",
  },
  menuItemRadio: {
    className: "sdn-menu-item sdn-menu-item-radio--mezf",
  },
  icon: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel2: {
    children: "Yes",
    className: "sdn-text-label sdn-text-label--jndm",
  },
  menuItemRadio2: {
    className: "sdn-menu-item sdn-menu-item-radio--mezf",
  },
  icon2: {
    icon: "material-radioButtonChecked",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  textLabel3: {
    children: "No",
    className: "sdn-text-label sdn-text-label--jndm",
  },
}

/**
 * Form Control: FormControlRadio
 * Level: Element
 * Intent: Captures plain text input from the user for forms or interactions.
 * Tags: UI, UI control, binary, boolean, checkbox, choice, control, decorated, dropdown, editable, exclusive, field, form, icon, input, menu, options, query, radio, search, select, single choice, text, toggle, user entry
 * Type: Inline
 *
 * Structure:
 *   TextLabel        textLabel
 *   Frame            frame
 *     MenuItemRadio  menuItemRadio
 *       Icon         icon
 *       TextLabel    textLabel2
 *     MenuItemRadio  menuItemRadio2
 *       Icon         icon2
 *       TextLabel    textLabel3
 *
 * @example
 * ```tsx
 * <FormControlRadio
 *   aria-hidden="false"
 *   textLabel="{}"
 *   frame="{}"
 *   menuItemRadio="{}"
 *   icon="material-star"
 *   menuItemRadio2="{}"
 * />
 * ```
 */
export function FormControlRadio({
  className = "",
  textLabel,

  frame,
  menuItemRadio,
  icon,
  textLabel2,
  menuItemRadio2,
  icon2,
  textLabel3,

  children,
  seldonRefs,
  ...props
}: FormControlRadioProps) {
  const formControlRadioClassName = combineClassNames("sdn-form-control", className)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const menuItemRadioProps = mergeOptionalSlot(sdn.menuItemRadio, menuItemRadio, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const menuItemRadio2Props = mergeOptionalSlot(sdn.menuItemRadio2, menuItemRadio2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  return (
    <Frame className={formControlRadioClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          <Frame {...frameProps}>
            {menuItemRadioProps !== null && (
              <MenuItemRadio {...menuItemRadioProps}>
                {iconProps !== null && <Icon {...iconProps} />}
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              </MenuItemRadio>
            )}
            {menuItemRadio2Props !== null && (
              <MenuItemRadio {...menuItemRadio2Props}>
                {icon2Props !== null && <Icon {...icon2Props} />}
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              </MenuItemRadio>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
