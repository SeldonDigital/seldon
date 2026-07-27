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
import { Frame, FrameProps } from "../frames/Frame"
import { Hr, HrProps } from "../primitives/Hr"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface ListboxGroupedProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  textLabel?: TextLabelProps | null
  listboxOption?: ListboxOptionProps | null
  icon?: IconProps | null
  textLabel2?: TextLabelProps | null
  listboxOption2?: ListboxOptionProps | null
  icon2?: IconProps | null
  textLabel3?: TextLabelProps | null
  hr?: HrProps | null
  frame2?: FrameProps | null
  textLabel4?: TextLabelProps | null
  listboxOption3?: ListboxOptionProps | null
  icon3?: IconProps | null
  textLabel5?: TextLabelProps | null
  listboxOption4?: ListboxOptionProps | null
  icon4?: IconProps | null
  textLabel6?: TextLabelProps | null
}

/*****
 * List: boxGrouped
 * Level: Part
 * Intent: Floating list of selectable options for a combobox or select.
 * Tags: listbox, options, select, combobox, part, overlay, UI
 * Type: Inline
 *
 * @example
 * ```tsx
 * <ListboxGrouped
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function ListboxGrouped({
  className = "",
  frame = sdn.frame,
  textLabel,
  listboxOption,
  icon = sdn.icon,
  textLabel2,
  listboxOption2,
  icon2 = sdn.icon2,
  textLabel3,
  hr = sdn.hr,
  frame2 = sdn.frame2,
  textLabel4,
  listboxOption3,
  icon3 = sdn.icon3,
  textLabel5,
  listboxOption4,
  icon4 = sdn.icon4,
  textLabel6,
  children,
  seldonRefs,
  ...props
}: ListboxGroupedProps) {
  const listboxGroupedClassName = combineClassNames("sdn-listbox", className)
  const frameProps = applyRef(
    seldonRefs,
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
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
  const hrProps = applyRef(
    seldonRefs,
    hr === null
      ? null
      : {
          ...sdn.hr,
          ...hr,
          className: combineClassNames(sdn.hr?.className, hr?.className),
        },
  )
  const frame2Props = applyRef(
    seldonRefs,
    frame2 === null
      ? null
      : {
          ...sdn.frame2,
          ...frame2,
          className: combineClassNames(
            sdn.frame2?.className,
            frame2?.className,
          ),
        },
  )
  const textLabel4Props = applyRef(
    seldonRefs,
    textLabel4 === null
      ? null
      : {
          ...sdn.textLabel4,
          ...textLabel4,
          className: combineClassNames(
            sdn.textLabel4?.className,
            textLabel4?.className,
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
  const textLabel5Props = applyRef(
    seldonRefs,
    textLabel5 === null
      ? null
      : {
          ...sdn.textLabel5,
          ...textLabel5,
          className: combineClassNames(
            sdn.textLabel5?.className,
            textLabel5?.className,
          ),
        },
  )
  const listboxOption4Props = applyRef(
    seldonRefs,
    listboxOption4 === null
      ? null
      : {
          ...sdn.listboxOption4,
          ...listboxOption4,
          className: combineClassNames(
            sdn.listboxOption4?.className,
            listboxOption4?.className,
          ),
        },
  )
  const icon4Props = applyRef(
    seldonRefs,
    icon4 === null
      ? null
      : {
          ...sdn.icon4,
          ...icon4,
          className: combineClassNames(sdn.icon4?.className, icon4?.className),
        },
  )
  const textLabel6Props = applyRef(
    seldonRefs,
    textLabel6 === null
      ? null
      : {
          ...sdn.textLabel6,
          ...textLabel6,
          className: combineClassNames(
            sdn.textLabel6?.className,
            textLabel6?.className,
          ),
        },
  )

  return (
    <Frame
      className={listboxGroupedClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {textLabel && textLabelProps && <TextLabel {...textLabelProps} />}
            {listboxOption && listboxOptionProps && (
              <ListboxOption {...listboxOptionProps}>
                {icon && iconProps && <Icon {...iconProps} />}
                {textLabel2 && textLabel2Props && (
                  <TextLabel {...textLabel2Props} />
                )}
              </ListboxOption>
            )}
            {listboxOption2 && listboxOption2Props && (
              <ListboxOption {...listboxOption2Props}>
                {icon2 && icon2Props && <Icon {...icon2Props} />}
                {textLabel3 && textLabel3Props && (
                  <TextLabel {...textLabel3Props} />
                )}
              </ListboxOption>
            )}
          </Frame>
          {hrProps !== null && <Hr {...hrProps} />}
          <Frame {...frame2Props}>
            {textLabel4 && textLabel4Props && (
              <TextLabel {...textLabel4Props} />
            )}
            {listboxOption3 && listboxOption3Props && (
              <ListboxOption {...listboxOption3Props}>
                {icon3 && icon3Props && <Icon {...icon3Props} />}
                {textLabel5 && textLabel5Props && (
                  <TextLabel {...textLabel5Props} />
                )}
              </ListboxOption>
            )}
            {listboxOption4 && listboxOption4Props && (
              <ListboxOption {...listboxOption4Props}>
                {icon4 && icon4Props && <Icon {...icon4Props} />}
                {textLabel6 && textLabel6Props && (
                  <TextLabel {...textLabel6Props} />
                )}
              </ListboxOption>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}

//
// Default property values
//
const sdn: ListboxGroupedProps = {
  role: "listbox",
  "aria-hidden": "false",
  className: "sdn-listbox",
  frame: {
    wrapperElement: "div",
    role: "group",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--6o7x",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--oqkb",
  },
  listboxOption: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption2: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon2: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel3: {
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
    className: "sdn-text-label sdn-text-label--ptvk",
  },
  listboxOption3: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
  listboxOption4: {
    className: "sdn-listbox-option sdn-listbox-option--6dxl",
  },
  icon4: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--3qou",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--xohb",
  },
}
