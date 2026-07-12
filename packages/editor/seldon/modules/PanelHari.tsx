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
import { Button, ButtonProps } from "../elements/Button"
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import { Chip, ChipProps } from "../elements/Chip"
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { Icon, IconProps } from "../primitives/Icon"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { Textarea, TextareaProps } from "../primitives/Textarea"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface PanelHariProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  frame?: FrameProps | null
  frame2?: FrameProps | null
  textarea?: TextareaProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon2?: IconProps | null
  frame3?: FrameProps | null
  frame4?: FrameProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon3?: IconProps | null
  buttonMenu2?: ButtonMenuProps | null
  textLabel2?: TextLabelProps | null
  icon4?: IconProps | null
  chip?: ChipProps | null
  textLabel3?: TextLabelProps | null
  button?: ButtonProps | null
  icon5?: IconProps | null
  textLabel4?: TextLabelProps | null
}

/*****
 * Panel: PanelHari
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * @example
 * ```tsx
 * <PanelHari
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function PanelHari({
  className = "",
  bar = sdn.bar,
  textTitle,
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  frame = sdn.frame,
  frame2 = sdn.frame2,
  textarea,
  buttonIconic2,
  icon2 = sdn.icon2,
  frame3 = sdn.frame3,
  frame4 = sdn.frame4,
  buttonMenu,
  textLabel,
  icon3 = sdn.icon3,
  buttonMenu2,
  textLabel2,
  icon4 = sdn.icon4,
  chip,
  textLabel3,
  button,
  icon5 = sdn.icon5,
  textLabel4,
  children,
  seldonRefs,
  ...props
}: PanelHariProps) {
  const panelHariClassName = combineClassNames("sdn-panel-hari", className)
  const barProps = applyRef(
    seldonRefs,
    bar === null
      ? null
      : {
          ...sdn.bar,
          ...bar,
          className: combineClassNames(sdn.bar?.className, bar?.className),
        },
  )
  const textTitleProps = applyRef(
    seldonRefs,
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
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
  const textareaProps = applyRef(
    seldonRefs,
    textarea === null
      ? null
      : {
          ...sdn.textarea,
          ...textarea,
          className: combineClassNames(
            sdn.textarea?.className,
            textarea?.className,
          ),
        },
  )
  const buttonIconic2Props = applyRef(
    seldonRefs,
    buttonIconic2 === null
      ? null
      : {
          ...sdn.buttonIconic2,
          ...buttonIconic2,
          className: combineClassNames(
            sdn.buttonIconic2?.className,
            buttonIconic2?.className,
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
  const frame4Props = applyRef(
    seldonRefs,
    frame4 === null
      ? null
      : {
          ...sdn.frame4,
          ...frame4,
          className: combineClassNames(
            sdn.frame4?.className,
            frame4?.className,
          ),
        },
  )
  const buttonMenuProps = applyRef(
    seldonRefs,
    buttonMenu === null
      ? null
      : {
          ...sdn.buttonMenu,
          ...buttonMenu,
          className: combineClassNames(
            sdn.buttonMenu?.className,
            buttonMenu?.className,
          ),
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
  const buttonMenu2Props = applyRef(
    seldonRefs,
    buttonMenu2 === null
      ? null
      : {
          ...sdn.buttonMenu2,
          ...buttonMenu2,
          className: combineClassNames(
            sdn.buttonMenu2?.className,
            buttonMenu2?.className,
          ),
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
  const chipProps = applyRef(
    seldonRefs,
    chip === null
      ? null
      : {
          ...sdn.chip,
          ...chip,
          className: combineClassNames(sdn.chip?.className, chip?.className),
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
  const buttonProps = applyRef(
    seldonRefs,
    button === null
      ? null
      : {
          ...sdn.button,
          ...button,
          className: combineClassNames(
            sdn.button?.className,
            button?.className,
          ),
        },
  )
  const icon5Props = applyRef(
    seldonRefs,
    icon5 === null
      ? null
      : {
          ...sdn.icon5,
          ...icon5,
          className: combineClassNames(sdn.icon5?.className, icon5?.className),
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

  return (
    <HTMLDiv
      className={panelHariClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          {barProps !== null && (
            <Bar {...barProps}>
              {textTitle && textTitleProps && <TextTitle {...textTitleProps} />}
              {buttonIconic && buttonIconicProps && (
                <ButtonIconic {...buttonIconicProps} icon={iconProps} />
              )}
            </Bar>
          )}
          <Frame {...frameProps}></Frame>
          <Frame {...frame2Props}>
            {textarea && textareaProps && <Textarea {...textareaProps} />}
            {buttonIconic2 && buttonIconic2Props && (
              <ButtonIconic {...buttonIconic2Props} icon={icon2Props} />
            )}
          </Frame>
          <Frame {...frame3Props}>
            <Frame {...frame4Props}>
              {buttonMenu && buttonMenuProps && (
                <ButtonMenu {...buttonMenuProps}>
                  {textLabel && textLabelProps && (
                    <TextLabel {...textLabelProps} />
                  )}
                  {icon3 && icon3Props && <Icon {...icon3Props} />}
                </ButtonMenu>
              )}
              {buttonMenu2 && buttonMenu2Props && (
                <ButtonMenu {...buttonMenu2Props}>
                  {textLabel2 && textLabel2Props && (
                    <TextLabel {...textLabel2Props} />
                  )}
                  {icon4 && icon4Props && <Icon {...icon4Props} />}
                </ButtonMenu>
              )}
              {chip && chipProps && (
                <Chip {...chipProps}>
                  {textLabel3 && textLabel3Props && (
                    <TextLabel {...textLabel3Props} />
                  )}
                </Chip>
              )}
            </Frame>
            {button && buttonProps && (
              <Button {...buttonProps}>
                {icon5 && icon5Props && <Icon {...icon5Props} />}
                {textLabel4 && textLabel4Props && (
                  <TextLabel {...textLabel4Props} />
                )}
              </Button>
            )}
          </Frame>
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: PanelHariProps = {
  role: "dialog",
  "aria-hidden": "false",
  className: "sdn-panel-hari sdn-panel",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--9xs7",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--ulid",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClose",
  },
  icon: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--2wwo",
    "data-seldon-ref": "turns",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jhsq",
  },
  textarea: {
    className: "sdn-textarea sdn-textarea--2upw",
    "data-seldon-ref": "hariInput",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--wh0i",
    "data-seldon-ref": "hariSend",
  },
  icon2: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--meos",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--a5w4",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariModel",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon3: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-menu--ipe0",
    "data-seldon-ref": "hariThinking",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon4: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  chip: {
    className: "sdn-chip sdn-chip--lo6k",
    "data-seldon-ref": "hariSelection",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--lug5",
  },
  button: {
    className: "sdn-button sdn-button--9yoo",
    "data-seldon-ref": "hariReset",
  },
  icon5: {
    icon: "material-clear",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--eyw9",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--vrf8",
  },
}
