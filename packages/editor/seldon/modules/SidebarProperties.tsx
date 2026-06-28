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
import { ButtonIconicProps } from "../elements/ButtonIconic"
import {
  ComboboxFieldFilterField,
  ComboboxFieldFilterFieldProps,
} from "../elements/ComboboxFieldFilterField"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SidebarPropertiesProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  comboboxFieldFilterField?: ComboboxFieldFilterFieldProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
  frame?: FrameProps | null
}

/*****
 * Sidebar: SidebarProperties
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <SidebarProperties
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function SidebarProperties({
  className = "",
  comboboxFieldFilterField,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  frame = sdn.frame,
  children,
  seldonRefs,
  ...props
}: SidebarPropertiesProps) {
  const sidebarPropertiesClassName = combineClassNames(
    "sdn-sidebar-objects",
    className,
  )
  const comboboxFieldFilterFieldProps = applyRef(
    seldonRefs,
    comboboxFieldFilterField === null
      ? null
      : {
          ...sdn.comboboxFieldFilterField,
          ...comboboxFieldFilterField,
          className: combineClassNames(
            sdn.comboboxFieldFilterField?.className,
            comboboxFieldFilterField?.className,
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
  const inputProps = applyRef(
    seldonRefs,
    input === null
      ? null
      : {
          ...sdn.input,
          ...input,
          className: combineClassNames(sdn.input?.className, input?.className),
        },
  )
  const buttonIconicProps = applyRef(
    seldonRefs,
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
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

  return (
    <HTMLDiv
      className={sidebarPropertiesClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {comboboxFieldFilterField && comboboxFieldFilterFieldProps && (
            <ComboboxFieldFilterField
              {...comboboxFieldFilterFieldProps}
              icon={iconProps}
              input={inputProps}
              buttonIconic={buttonIconicProps}
              icon2={icon2Props}
            />
          )}
          <Frame {...frameProps}></Frame>
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: SidebarPropertiesProps = {
  role: "complementary",
  "aria-hidden": "false",
  className: "sdn-sidebar-objects sdn-sidebar",
  comboboxFieldFilterField: {
    className:
      "sdn-combobox-field-filter-field sdn-combobox-field-filter-field--lsiw",
  },
  icon: {
    icon: "material-filterList",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon2: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--enpy",
    "data-seldon-ref": "propertiesContainer",
  },
}
