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
import { ButtonIconic, ButtonIconicProps } from "../elements/ButtonIconic"
import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import { ButtonToggle, ButtonToggleProps } from "../elements/ButtonToggle"
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
  frame?: FrameProps | null
  buttonToggle?: ButtonToggleProps | null
  icon?: IconProps | null
  buttonToggle2?: ButtonToggleProps | null
  icon2?: IconProps | null
  buttonToggle3?: ButtonToggleProps | null
  icon3?: IconProps | null
  buttonIconic?: ButtonIconicProps | null
  icon4?: IconProps | null
  buttonIconic2?: ButtonIconicProps | null
  icon5?: IconProps | null
  frame2?: FrameProps | null
  frame3?: FrameProps | null
  textarea?: TextareaProps | null
  frame4?: FrameProps | null
  frame5?: FrameProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel?: TextLabelProps | null
  icon6?: IconProps | null
  buttonMenu2?: ButtonMenuProps | null
  textLabel2?: TextLabelProps | null
  icon7?: IconProps | null
  chip?: ChipProps | null
  textLabel3?: TextLabelProps | null
  buttonIconic3?: ButtonIconicProps | null
  icon8?: IconProps | null
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
  frame = sdn.frame,
  buttonToggle,
  icon = sdn.icon,
  buttonToggle2,
  icon2 = sdn.icon2,
  buttonToggle3,
  icon3 = sdn.icon3,
  buttonIconic = sdn.buttonIconic,
  icon4 = sdn.icon4,
  buttonIconic2,
  icon5 = sdn.icon5,
  frame2 = sdn.frame2,
  frame3 = sdn.frame3,
  textarea,
  frame4 = sdn.frame4,
  frame5 = sdn.frame5,
  buttonMenu,
  textLabel,
  icon6 = sdn.icon6,
  buttonMenu2,
  textLabel2,
  icon7 = sdn.icon7,
  chip,
  textLabel3,
  buttonIconic3,
  icon8 = sdn.icon8,
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
  const buttonToggle3Props = applyRef(
    seldonRefs,
    buttonToggle3 === null
      ? null
      : {
          ...sdn.buttonToggle3,
          ...buttonToggle3,
          className: combineClassNames(
            sdn.buttonToggle3?.className,
            buttonToggle3?.className,
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
  const frame5Props = applyRef(
    seldonRefs,
    frame5 === null
      ? null
      : {
          ...sdn.frame5,
          ...frame5,
          className: combineClassNames(
            sdn.frame5?.className,
            frame5?.className,
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
  const icon6Props = applyRef(
    seldonRefs,
    icon6 === null
      ? null
      : {
          ...sdn.icon6,
          ...icon6,
          className: combineClassNames(sdn.icon6?.className, icon6?.className),
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
  const icon7Props = applyRef(
    seldonRefs,
    icon7 === null
      ? null
      : {
          ...sdn.icon7,
          ...icon7,
          className: combineClassNames(sdn.icon7?.className, icon7?.className),
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
  const buttonIconic3Props = applyRef(
    seldonRefs,
    buttonIconic3 === null
      ? null
      : {
          ...sdn.buttonIconic3,
          ...buttonIconic3,
          className: combineClassNames(
            sdn.buttonIconic3?.className,
            buttonIconic3?.className,
          ),
        },
  )
  const icon8Props = applyRef(
    seldonRefs,
    icon8 === null
      ? null
      : {
          ...sdn.icon8,
          ...icon8,
          className: combineClassNames(sdn.icon8?.className, icon8?.className),
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
              <Frame {...frameProps}>
                {buttonToggle && buttonToggleProps && (
                  <ButtonToggle {...buttonToggleProps} icon={iconProps} />
                )}
                {buttonToggle2 && buttonToggle2Props && (
                  <ButtonToggle {...buttonToggle2Props} icon={icon2Props} />
                )}
                {buttonToggle3 && buttonToggle3Props && (
                  <ButtonToggle {...buttonToggle3Props} icon={icon3Props} />
                )}
              </Frame>
              {buttonIconic && buttonIconicProps && (
                <ButtonIconic {...buttonIconicProps} icon={icon4Props} />
              )}
              {buttonIconic2 && buttonIconic2Props && (
                <ButtonIconic {...buttonIconic2Props} icon={icon5Props} />
              )}
            </Bar>
          )}
          <Frame {...frame2Props}></Frame>
          <Frame {...frame3Props}>
            {textarea && textareaProps && <Textarea {...textareaProps} />}
          </Frame>
          <Frame {...frame4Props}>
            <Frame {...frame5Props}>
              {buttonMenu && buttonMenuProps && (
                <ButtonMenu {...buttonMenuProps}>
                  {textLabel && textLabelProps && (
                    <TextLabel {...textLabelProps} />
                  )}
                  {icon6 && icon6Props && <Icon {...icon6Props} />}
                </ButtonMenu>
              )}
              {buttonMenu2 && buttonMenu2Props && (
                <ButtonMenu {...buttonMenu2Props}>
                  {textLabel2 && textLabel2Props && (
                    <TextLabel {...textLabel2Props} />
                  )}
                  {icon7 && icon7Props && <Icon {...icon7Props} />}
                </ButtonMenu>
              )}
              {chip && chipProps && (
                <Chip {...chipProps}>
                  {textLabel3 && textLabel3Props && (
                    <TextLabel {...textLabel3Props} />
                  )}
                </Chip>
              )}
              {buttonIconic3 && buttonIconic3Props && (
                <ButtonIconic {...buttonIconic3Props} icon={icon8Props} />
              )}
            </Frame>
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
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--i5kj",
  },
  buttonToggle: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariOutcome",
  },
  icon: {
    icon: "material-outputCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle2: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariTools",
  },
  icon2: {
    icon: "material-buildCircle",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonToggle3: {
    className: "sdn-button-toggle sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClamp",
  },
  icon3: {
    icon: "material-neurology",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--vsau",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon4: {
    icon: "seldon-reset",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
  buttonIconic2: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
    "data-seldon-ref": "hariClose",
  },
  icon5: {
    icon: "material-close",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--rezm",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--vorn",
    "data-seldon-ref": "turns",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--jhsq",
  },
  textarea: {
    className: "sdn-textarea sdn-textarea--2upw",
    "data-seldon-ref": "hariInput",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--meos",
  },
  frame5: {
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
  icon6: {
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
  icon7: {
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
  buttonIconic3: {
    className: "sdn-button-iconic sdn-button-iconic--wh0i",
    "data-seldon-ref": "hariSend",
  },
  icon8: {
    icon: "material-arrowUpward",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
}
