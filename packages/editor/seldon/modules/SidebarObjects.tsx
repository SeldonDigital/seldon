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
import { ButtonToggle, ButtonToggleProps } from "../elements/ButtonToggle"
import {
  ComboboxFieldProject,
  ComboboxFieldProjectProps,
} from "../elements/ComboboxFieldProject"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface SidebarObjectsProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  comboboxFieldProject?: ComboboxFieldProjectProps | null
  icon?: IconProps | null
  input?: InputProps | null
  buttonIconic?: ButtonIconicProps | null
  icon2?: IconProps | null
  frame2?: FrameProps | null
  buttonToggle?: ButtonToggleProps | null
  icon3?: IconProps | null
  buttonToggle2?: ButtonToggleProps | null
  icon4?: IconProps | null
  frame3?: FrameProps | null
}

/*****
 * Sidebar: SidebarObjects
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <SidebarObjects
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function SidebarObjects({
  className = "",
  frame = sdn.frame,
  comboboxFieldProject,
  icon = sdn.icon,
  input = sdn.input,
  buttonIconic = sdn.buttonIconic,
  icon2 = sdn.icon2,
  frame2 = sdn.frame2,
  buttonToggle,
  icon3 = sdn.icon3,
  buttonToggle2,
  icon4 = sdn.icon4,
  frame3 = sdn.frame3,
  children,
  seldonRefs,
  ...props
}: SidebarObjectsProps) {
  const sidebarObjectsClassName = combineClassNames(
    "sdn-sidebar-objects",
    className,
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
  const comboboxFieldProjectProps = applyRef(
    seldonRefs,
    comboboxFieldProject === null
      ? null
      : {
          ...sdn.comboboxFieldProject,
          ...comboboxFieldProject,
          className: combineClassNames(
            sdn.comboboxFieldProject?.className,
            comboboxFieldProject?.className,
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
  const buttonToggleProps = applyRef(
    seldonRefs,
    buttonToggle === null
      ? null
      : {
          ...sdn.buttonToggle,
          ...buttonToggle,
          className: combineClassNames(
            sdn.buttonToggle?.className,
            buttonToggle?.className,
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
  const buttonToggle2Props = applyRef(
    seldonRefs,
    buttonToggle2 === null
      ? null
      : {
          ...sdn.buttonToggle2,
          ...buttonToggle2,
          className: combineClassNames(
            sdn.buttonToggle2?.className,
            buttonToggle2?.className,
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
  const frame3Props = applyRef(
    seldonRefs,
    frame3 === null
      ? null
      : {
          ...sdn.frame3,
          ...frame3,
          className: combineClassNames(
            sdn.frame3?.className,
            frame3?.className,
          ),
        },
  )

  return (
    <HTMLDiv
      className={sidebarObjectsClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            {comboboxFieldProject && comboboxFieldProjectProps && (
              <ComboboxFieldProject
                {...comboboxFieldProjectProps}
                icon={iconProps}
                input={inputProps}
                buttonIconic={buttonIconicProps}
                icon2={icon2Props}
              />
            )}
            <Frame {...frame2Props}>
              {buttonToggle && buttonToggleProps && (
                <ButtonToggle {...buttonToggleProps} icon={icon3Props} />
              )}
              {buttonToggle2 && buttonToggle2Props && (
                <ButtonToggle {...buttonToggle2Props} icon={icon4Props} />
              )}
            </Frame>
          </Frame>
          <Frame {...frame3Props}></Frame>
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: SidebarObjectsProps = {
  role: "complementary",
  "aria-hidden": "false",
  className: "sdn-sidebar-objects sdn-sidebar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--p4y0",
  },
  comboboxFieldProject: {
    className: "sdn-combobox-field sdn-combobox-field-project--rzdy",
  },
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
  },
  input: {
    placeholder: "Workspace Name",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--twyx",
    "data-seldon-ref": "workspaceName",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "workspaceSave",
  },
  icon2: {
    icon: "material-save",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ma6i",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "sidebarComponents",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ovkd",
  },
  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "sidebarResources",
  },
  icon4: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--ovkd",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--enpy",
    "data-seldon-ref": "objectsContainer",
  },
}
