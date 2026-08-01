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
import { ComboboxFieldProject, ComboboxFieldProjectProps } from "../elements/ComboboxFieldProject"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { IconProps } from "../primitives/Icon"
import { InputProps } from "../primitives/Input"
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface SidebarObjectsProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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

//
// Default property values
//
const sdn: SidebarObjectsProps = {
  role: "complementary",
  "aria-hidden": "false",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--p4y0",
  },
  comboboxFieldProject: {
    className: "sdn-combobox-field sdn-combobox-field-project--rzdy",
    "data-seldon-ref": "workspaceField",
  },
  icon: {
    icon: "material-dataObject",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--xi68",
    "data-seldon-ref": "workspaceIcon",
  },
  input: {
    placeholder: "Workspace Name",
    type: "text",
    role: "combobox",
    "aria-haspopup": "listbox",
    className: "sdn-input sdn-input--yoqi",
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
    "data-seldon-ref": "workspaceSaveIcon",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ma6i",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "objectsViewComponents",
  },
  icon3: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "objectsViewResources",
  },
  icon4: {
    icon: "seldon-theme",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },

  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--enpy",
    "data-seldon-ref": "objectsTree",
  },
}

/**
 * Sidebar: SidebarObjects
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * Structure:
 *   Frame                   frame
 *     ComboboxFieldProject  comboboxFieldProject  -> workspaceField
 *       Icon                icon                  -> workspaceIcon
 *       Input               input                 -> workspaceName
 *       ButtonIconic        buttonIconic          -> workspaceSave
 *         Icon              icon2                 -> workspaceSaveIcon
 *     Frame                 frame2
 *       ButtonToggle        buttonToggle          -> objectsViewComponents
 *         Icon              icon3
 *       ButtonToggle        buttonToggle2         -> objectsViewResources
 *         Icon              icon4
 *   Frame                   frame3                -> objectsTree
 *
 * @example
 * ```tsx
 * <SidebarObjects
 *   role="complementary"
 *   aria-hidden="false"
 * />
 * ```
 */
export function SidebarObjects({
  className = "",
  frame,
  comboboxFieldProject,
  icon,
  input,
  buttonIconic,
  icon2,
  frame2,
  buttonToggle,
  icon3,
  buttonToggle2,
  icon4,

  frame3,

  children,
  seldonRefs,
  ...props
}: SidebarObjectsProps) {
  const sidebarObjectsClassName = combineClassNames("sdn-sidebar-objects", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const comboboxFieldProjectProps = mergeOptionalSlot(
    sdn.comboboxFieldProject,
    comboboxFieldProject,
    seldonRefs,
  )
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const inputProps = mergeSlot(sdn.input, input, seldonRefs)
  const buttonIconicProps = mergeSlot(sdn.buttonIconic, buttonIconic, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const buttonToggleProps = mergeOptionalSlot(sdn.buttonToggle, buttonToggle, seldonRefs)
  const icon3Props = mergeSlot(sdn.icon3, icon3, seldonRefs)
  const buttonToggle2Props = mergeOptionalSlot(sdn.buttonToggle2, buttonToggle2, seldonRefs)
  const icon4Props = mergeSlot(sdn.icon4, icon4, seldonRefs)

  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)

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
            {comboboxFieldProjectProps !== null && (
              <ComboboxFieldProject
                {...comboboxFieldProjectProps}
                icon={iconProps}
                input={inputProps}
                buttonIconic={buttonIconicProps}
                icon2={icon2Props}
              />
            )}
            <Frame {...frame2Props}>
              {buttonToggleProps !== null && (
                <ButtonToggle {...buttonToggleProps} icon={icon3Props} />
              )}
              {buttonToggle2Props !== null && (
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
