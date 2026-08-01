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

import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Input, InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeSlot } from "../utils/merge-slot"

export interface ComboboxFieldProjectProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  input?: InputProps | null

  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
}

//
// Default property values
//
const sdn: ComboboxFieldProjectProps = {
  "aria-hidden": "false",
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },

  input: {
    placeholder: "Project Name",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
  },

  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
}

/**
 * Combobox Field: ComboboxFieldProject
 * Level: Element
 * Intent: Field box that holds the combobox input and opens its listbox.
 * Tags: combobox, trigger, input, field, select, element, UI
 * Type: Custom
 *
 * Structure:
 *   Icon          icon
 *   Input         input
 *   ButtonIconic  buttonIconic
 *     Icon        icon2
 *
 * @example
 * ```tsx
 * <ComboboxFieldProject
 *   aria-hidden="false"
 *   icon="material-star"
 *   input="{}"
 *   buttonIconic={() => {}}
 * />
 * ```
 */
export function ComboboxFieldProject({
  className = "",
  icon,

  input,

  buttonIconic,
  icon2,

  children,
  seldonRefs,
  ...props
}: ComboboxFieldProjectProps) {
  const comboboxFieldProjectClassName = combineClassNames("sdn-combobox-field", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const inputProps = mergeSlot(sdn.input, input, seldonRefs)

  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

  return (
    <Frame className={comboboxFieldProjectClassName} aria-hidden={sdn["aria-hidden"]} {...props}>
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {inputProps !== null && <Input {...inputProps} />}
          {buttonIconicProps !== null && <ButtonIconic {...buttonIconicProps} icon={icon2Props} />}
        </>
      )}
    </Frame>
  )
}
