/*****
 *
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 *
 *****/
import { HTMLAttributes } from "react"
import { Button, ButtonProps } from "../elements/Button"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { BarStatus, BarStatusProps } from "../parts/BarStatus"
import { BarTabsProject, BarTabsProjectProps } from "../parts/BarTabsProject"
import { Icon, IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"
import { Text, TextProps } from "../primitives/Text"
import { combineClassNames } from "../utils/class-name"

export interface PanelSidebarObjectsProps extends HTMLAttributes<HTMLElement> {
  className?: string
  barTabsProject?: BarTabsProjectProps
  button?: ButtonProps
  icon?: IconProps
  label?: LabelProps
  text?: TextProps
  button2?: ButtonProps
  icon2?: IconProps
  label2?: LabelProps
  button3?: ButtonProps
  icon3?: IconProps
  label3?: LabelProps
  frame?: FrameProps
  barStatus?: BarStatusProps
  text2?: TextProps
  text3?: TextProps
  text4?: TextProps
}

/*****
 * Sidebar: PanelSidebarObjects
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <PanelSidebarObjects
 *   barTabsProject="{}"
 *   button={() => {}}
 *   icon="material-star"
 *   label="Button Label"
 *   text="{}"
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame="{}"
 *   barStatus="{}"
 *   text2="{}"
 *   text3="{}"
 * />
 * ```
 *****/
export function PanelSidebarObjects({
  className = "",
  barTabsProject = sdn.barTabsProject,
  button = sdn.button,
  icon = sdn.icon,
  label = sdn.label,
  text = sdn.text,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  label2 = sdn.label2,
  button3,
  icon3,
  label3,
  frame = sdn.frame,
  barStatus = sdn.barStatus,
  text2 = sdn.text2,
  text3 = sdn.text3,
  text4 = sdn.text4,
  ...props
}: PanelSidebarObjectsProps) {
  const panelSidebarObjectsClassName = combineClassNames(
    "sdn-panel-sidebar-objects",
    className,
  )
  const barTabsProjectProps = {
    ...sdn.barTabsProject,
    ...barTabsProject,
    className: combineClassNames(
      sdn.barTabsProject?.className,
      barTabsProject?.className,
    ),
  }
  const buttonProps = {
    ...sdn.button,
    ...button,
    className: combineClassNames(sdn.button?.className, button?.className),
  }
  const iconProps = {
    ...sdn.icon,
    ...icon,
    className: combineClassNames(sdn.icon?.className, icon?.className),
  }
  const labelProps = {
    ...sdn.label,
    ...label,
    className: combineClassNames(sdn.label?.className, label?.className),
  }
  const textProps = {
    ...sdn.text,
    ...text,
    className: combineClassNames(sdn.text?.className, text?.className),
  }
  const button2Props = {
    ...sdn.button2,
    ...button2,
    className: combineClassNames(sdn.button2?.className, button2?.className),
  }
  const icon2Props = {
    ...sdn.icon2,
    ...icon2,
    className: combineClassNames(sdn.icon2?.className, icon2?.className),
  }
  const label2Props = {
    ...sdn.label2,
    ...label2,
    className: combineClassNames(sdn.label2?.className, label2?.className),
  }
  const button3Props = button3
    ? {
        ...button3,
        className: combineClassNames(
          "sdn-button sdn-button--9f85",
          button3.className,
        ),
      }
    : undefined
  const icon3Props = button3
    ? {
        ...icon3,
        className: combineClassNames(
          "sdn-icon sdn-icon--fvvj",
          icon3?.className,
        ),
      }
    : undefined
  const label3Props = button3
    ? {
        htmlElement: "label" as const,
        ...label3,
        className: combineClassNames(
          "sdn-label sdn-label--3dyv",
          label3?.className,
        ),
      }
    : undefined
  const frameProps = {
    ...sdn.frame,
    ...frame,
    className: combineClassNames(sdn.frame?.className, frame?.className),
  }
  const barStatusProps = {
    ...sdn.barStatus,
    ...barStatus,
    className: combineClassNames(
      sdn.barStatus?.className,
      barStatus?.className,
    ),
  }
  const text2Props = {
    ...sdn.text2,
    ...text2,
    className: combineClassNames(sdn.text2?.className, text2?.className),
  }
  const text3Props = {
    ...sdn.text3,
    ...text3,
    className: combineClassNames(sdn.text3?.className, text3?.className),
  }
  const text4Props = {
    ...sdn.text4,
    ...text4,
    className: combineClassNames(sdn.text4?.className, text4?.className),
  }

  return (
    <HTMLDiv className={panelSidebarObjectsClassName} {...props}>
      {barTabsProject && (
        <BarTabsProject {...barTabsProjectProps}>
          {button && (
            <Button {...buttonProps}>
              {icon && <Icon {...iconProps} />}
              {label && <Label {...labelProps} />}
            </Button>
          )}
          {text && <Text {...textProps} />}
          {button2 && (
            <Button {...button2Props}>
              {icon2 && <Icon {...icon2Props} />}
              {label2 && <Label {...label2Props} />}
            </Button>
          )}
          {button3 && (
            <Button {...button3Props}>
              {icon3 && <Icon {...icon3Props} />}
              {label3 && <Label {...label3Props} />}
            </Button>
          )}
        </BarTabsProject>
      )}
      <Frame {...frameProps}></Frame>
      {barStatus && (
        <BarStatus {...barStatusProps}>
          {text2 && <Text {...text2Props} />}
          {text3 && <Text {...text3Props} />}
          {text4 && <Text {...text4Props} />}
        </BarStatus>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: PanelSidebarObjectsProps = {
  button: {
    className: "sdn-button sdn-button--9f85",
  },
  icon: {
    icon: "material-chevronDoubleLeft",
    className: "sdn-icon sdn-icon--fvvj",
  },
  label: {
    children: "Projects",
    htmlElement: "label",
    className: "sdn-label sdn-label--3dyv",
  },
  text: {
    children: "Project Name",
    htmlElement: "p",
    className: "sdn-text sdn-text--ml0i",
  },
  button2: {
    className: "sdn-button sdn-button--9f85",
  },
  icon2: {
    icon: "seldon-component",
    className: "sdn-icon sdn-icon--fvvj",
  },
  label2: {
    children: "Add",
    htmlElement: "label",
    className: "sdn-label sdn-label--3dyv",
  },
  frame: {
    className: "sdn-frame sdn-frame--b7dc",
  },
  text2: {
    children: "Left status",
    htmlElement: "p",
    className: "sdn-text sdn-text--bx7i",
  },
  text3: {
    children: "Middle status",
    htmlElement: "p",
    className: "sdn-text sdn-text--anr7",
  },
  text4: {
    children: "Right status",
    htmlElement: "p",
    className: "sdn-text sdn-text--e2dx",
  },
}
