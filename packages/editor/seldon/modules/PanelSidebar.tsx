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
import { BarTabs, BarTabsProps } from "../parts/BarTabs"
import { Icon, IconProps } from "../primitives/Icon"
import { Label, LabelProps } from "../primitives/Label"
import { Text, TextProps } from "../primitives/Text"
import { combineClassNames } from "../utils/class-name"

export interface PanelSidebarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  barTabs?: BarTabsProps
  button?: ButtonProps
  icon?: IconProps
  label?: LabelProps
  button2?: ButtonProps
  icon2?: IconProps
  label2?: LabelProps
  button3?: ButtonProps
  icon3?: IconProps
  label3?: LabelProps
  frame?: FrameProps
  barStatus?: BarStatusProps
  text?: TextProps
  text2?: TextProps
  text3?: TextProps
}

/*****
 * Sidebar: PanelSidebar
 * Level: Module
 * Intent: Provides a structured sidebar panel with tabbed navigation, content area, and status footer for application interfaces.
 * Tags: sidebar, panel, module, ui, layout, navigation, tabs, structured
 * Type: Inline
 *
 * @example
 * ```tsx
 * <PanelSidebar
 *   barTabs="{}"
 *   button={() => {}}
 *   icon="material-star"
 *   label="Button Label"
 *   button2={() => {}}
 *   button3={() => {}}
 *   frame="{}"
 *   barStatus="{}"
 *   text="{}"
 *   text2="{}"
 *   text3="{}"
 * />
 * ```
 *****/
export function PanelSidebar({
  className = "",
  barTabs = sdn.barTabs,
  button = sdn.button,
  icon = sdn.icon,
  label = sdn.label,
  button2 = sdn.button2,
  icon2 = sdn.icon2,
  label2 = sdn.label2,
  button3 = sdn.button3,
  icon3 = sdn.icon3,
  label3 = sdn.label3,
  frame = sdn.frame,
  barStatus = sdn.barStatus,
  text = sdn.text,
  text2 = sdn.text2,
  text3 = sdn.text3,
  ...props
}: PanelSidebarProps) {
  const panelSidebarClassName = combineClassNames(
    "sdn-panel-sidebar",
    className,
  )
  const barTabsProps = {
    ...sdn.barTabs,
    ...barTabs,
    className: combineClassNames(sdn.barTabs?.className, barTabs?.className),
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
  const button3Props = {
    ...sdn.button3,
    ...button3,
    className: combineClassNames(sdn.button3?.className, button3?.className),
  }
  const icon3Props = {
    ...sdn.icon3,
    ...icon3,
    className: combineClassNames(sdn.icon3?.className, icon3?.className),
  }
  const label3Props = {
    ...sdn.label3,
    ...label3,
    className: combineClassNames(sdn.label3?.className, label3?.className),
  }
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
  const textProps = {
    ...sdn.text,
    ...text,
    className: combineClassNames(sdn.text?.className, text?.className),
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

  return (
    <HTMLDiv className={panelSidebarClassName} {...props}>
      {barTabs && (
        <BarTabs {...barTabsProps}>
          {button && (
            <Button {...buttonProps}>
              {icon && <Icon {...iconProps} />}
              {label && <Label {...labelProps} />}
            </Button>
          )}
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
        </BarTabs>
      )}
      <Frame {...frameProps}></Frame>
      {barStatus && (
        <BarStatus {...barStatusProps}>
          {text && <Text {...textProps} />}
          {text2 && <Text {...text2Props} />}
          {text3 && <Text {...text3Props} />}
        </BarStatus>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: PanelSidebarProps = {
  button: {
    className: "sdn-button sdn-button--dld2",
  },
  icon: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--2okc",
  },
  label: {
    children: "Tab 1",
    htmlElement: "label",
    className: "sdn-label sdn-label--m0gc",
  },
  button2: {
    className: "sdn-button sdn-button--dld2",
  },
  icon2: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--2okc",
  },
  label2: {
    children: "Tab 2",
    htmlElement: "label",
    className: "sdn-label sdn-label--m0gc",
  },
  button3: {
    className: "sdn-button sdn-button--dld2",
  },
  icon3: {
    icon: "__default__",
    className: "sdn-icon sdn-icon--2okc",
  },
  label3: {
    children: "Tab 3",
    htmlElement: "label",
    className: "sdn-label sdn-label--m0gc",
  },
  frame: {
    className: "sdn-frame sdn-frame--tjae",
  },
  text: {
    children: "Left status",
    htmlElement: "p",
    className: "sdn-text sdn-text--gfwp",
  },
  text2: {
    children: "Middle status",
    htmlElement: "p",
    className: "sdn-text sdn-text--v9vj",
  },
  text3: {
    children: "Right status",
    htmlElement: "p",
    className: "sdn-text sdn-text--omnx",
  },
}
