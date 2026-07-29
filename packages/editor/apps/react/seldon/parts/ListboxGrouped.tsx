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
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface ListboxGroupedProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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

//
// Default property values
//
const sdn: ListboxGroupedProps = {
  role: "listbox",
  "aria-hidden": "false",
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

/**
 * List: boxGrouped
 * Level: Part
 * Intent: Floating list of selectable options for a combobox or select.
 * Tags: listbox, options, select, combobox, part, overlay, UI
 * Type: Inline
 *
 * Structure:
 *   Frame            frame
 *     TextLabel      textLabel
 *     ListboxOption  listboxOption
 *       Icon         icon
 *       TextLabel    textLabel2
 *     ListboxOption  listboxOption2
 *       Icon         icon2
 *       TextLabel    textLabel3
 *   Hr               hr
 *   Frame            frame2
 *     TextLabel      textLabel4
 *     ListboxOption  listboxOption3
 *       Icon         icon3
 *       TextLabel    textLabel5
 *     ListboxOption  listboxOption4
 *       Icon         icon4
 *       TextLabel    textLabel6
 *
 * @example
 * ```tsx
 * <ListboxGrouped
 *   role="listbox"
 *   aria-hidden="false"
 * />
 * ```
 */
export function ListboxGrouped({
  className = "",
  frame,
  textLabel,
  listboxOption,
  icon,
  textLabel2,
  listboxOption2,
  icon2,
  textLabel3,

  hr,

  frame2,
  textLabel4,
  listboxOption3,
  icon3,
  textLabel5,
  listboxOption4,
  icon4,
  textLabel6,

  children,
  seldonRefs,
  ...props
}: ListboxGroupedProps) {
  const listboxGroupedClassName = combineClassNames("sdn-listbox", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const listboxOptionProps = mergeOptionalSlot(sdn.listboxOption, listboxOption, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const listboxOption2Props = mergeOptionalSlot(sdn.listboxOption2, listboxOption2, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)

  const hrProps = mergeSlot(sdn.hr, hr, seldonRefs)

  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const listboxOption3Props = mergeOptionalSlot(sdn.listboxOption3, listboxOption3, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const listboxOption4Props = mergeOptionalSlot(sdn.listboxOption4, listboxOption4, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

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
            {textLabelProps !== null && <TextLabel {...textLabelProps} />}
            {listboxOptionProps !== null && (
              <ListboxOption {...listboxOptionProps}>
                {iconProps !== null && <Icon {...iconProps} />}
                {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
              </ListboxOption>
            )}
            {listboxOption2Props !== null && (
              <ListboxOption {...listboxOption2Props}>
                {icon2Props !== null && <Icon {...icon2Props} />}
                {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
              </ListboxOption>
            )}
          </Frame>
          {hrProps !== null && <Hr {...hrProps} />}
          <Frame {...frame2Props}>
            {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
            {listboxOption3Props !== null && (
              <ListboxOption {...listboxOption3Props}>
                {icon3Props !== null && <Icon {...icon3Props} />}
                {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
              </ListboxOption>
            )}
            {listboxOption4Props !== null && (
              <ListboxOption {...listboxOption4Props}>
                {icon4Props !== null && <Icon {...icon4Props} />}
                {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
              </ListboxOption>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
