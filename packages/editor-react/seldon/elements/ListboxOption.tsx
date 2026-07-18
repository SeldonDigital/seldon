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
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ListboxOptionProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
}

/*****
 * List: boxOption
 * Level: Element
 * Intent: Single selectable row inside a listbox.
 * Tags: listbox, option, select, row, element, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <ListboxOption
 *   role="option"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function ListboxOption({
  className = "",
  icon = sdn.icon,
  textLabel,
  children,
  seldonRefs,
  ...props
}: ListboxOptionProps) {
  const listboxOptionClassName = combineClassNames(
    "sdn-listbox-option",
    className,
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
          {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: ListboxOptionProps = {
  role: "option",
  "aria-hidden": "false",
  className: "sdn-listbox-option",
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
    "data-seldon-ref": "optionIcon",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--xohb",
    "data-seldon-ref": "optionLabel",
  },
}
