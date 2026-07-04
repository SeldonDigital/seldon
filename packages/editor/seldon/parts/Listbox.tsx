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
import { ListboxOption, ListboxOptionProps } from "../elements/ListboxOption"
import { Frame } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ListboxProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  listboxOption?: ListboxOptionProps | null
  icon?: IconProps | null
  textLabel?: TextLabelProps | null
  listboxOption2?: ListboxOptionProps | null
  icon2?: IconProps | null
  textLabel2?: TextLabelProps | null
  listboxOption3?: ListboxOptionProps | null
  icon3?: IconProps | null
  textLabel3?: TextLabelProps | null
}

/*****
 * List: box
 * Level: Part
 * Intent: Floating list of selectable options for a combobox or select.
 * Tags: listbox, options, select, combobox, part, overlay, UI
 * Type: Default
 *
 * @example
 * ```tsx
 * <Listbox
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function Listbox({
  className = "",
  listboxOption = sdn.listboxOption,
  icon = sdn.icon,
  textLabel,
  listboxOption2 = sdn.listboxOption2,
  icon2 = sdn.icon2,
  textLabel2,
  listboxOption3 = sdn.listboxOption3,
  icon3 = sdn.icon3,
  textLabel3,
  children,
  seldonRefs,
  ...props
}: ListboxProps) {
  const listboxClassName = combineClassNames("sdn-listbox", className)
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

  return (
    <Frame
      className={listboxClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {listboxOptionProps !== null && (
            <ListboxOption {...listboxOptionProps}>
              {icon && iconProps && <Icon {...iconProps} />}
              {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            </ListboxOption>
          )}
          {listboxOption2Props !== null && (
            <ListboxOption {...listboxOption2Props}>
              {icon2 && icon2Props && <Icon {...icon2Props} />}
              {textLabel2 && textLabel2Props && (
                <TextLabel {...textLabel2Props} />
              )}
            </ListboxOption>
          )}
          {listboxOption3Props !== null && (
            <ListboxOption {...listboxOption3Props}>
              {icon3 && icon3Props && <Icon {...icon3Props} />}
              {textLabel3 && textLabel3Props && (
                <TextLabel {...textLabel3Props} />
              )}
            </ListboxOption>
          )}
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: ListboxProps = {
  role: "listbox",
  "aria-hidden": "false",
  className: "sdn-listbox",
  listboxOption: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption2: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption3: {
    role: "option",
    "aria-hidden": "false",
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
}
