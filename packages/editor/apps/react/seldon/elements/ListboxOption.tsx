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

import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ListboxOptionProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

  icon?: IconProps | null

  textLabel?: TextLabelProps | null

  textLabel2?: TextLabelProps | null
}

//
// Default property values
//
const sdn: ListboxOptionProps = {
  role: "option",
  "aria-hidden": "false",
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "optionIcon",
  },

  textLabel: {
    children: "Option",
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "optionLabel",
  },

  textLabel2: {
    children: "Annotation",
    className: "sdn-text-label sdn-text-label--lqmh",
    "data-seldon-ref": "optionAnnotation",
  },
}

/**
 * List: boxOption
 * Level: Element
 * Intent: Single selectable row inside a listbox.
 * Tags: listbox, option, select, row, element, UI
 * Type: Default
 *
 * Structure:
 *   Icon       icon        -> optionIcon
 *   TextLabel  textLabel   -> optionLabel
 *   TextLabel  textLabel2  -> optionAnnotation
 *
 * @example
 * ```tsx
 * <ListboxOption
 *   role="option"
 *   aria-hidden="false"
 * />
 * ```
 */
export function ListboxOption({
  className = "",
  icon,

  textLabel,

  textLabel2,

  children,
  seldonRefs,
  ...props
}: ListboxOptionProps) {
  const listboxOptionClassName = combineClassNames("sdn-listbox-option", className)

  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)

  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)

  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)

  return (
    <Frame
      className={listboxOptionClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {iconProps !== null && <Icon {...iconProps} />}
          {textLabelProps !== null && <TextLabel {...textLabelProps} />}
          {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
        </>
      )}
    </Frame>
  )
}
