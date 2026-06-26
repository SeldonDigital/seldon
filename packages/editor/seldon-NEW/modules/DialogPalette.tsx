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
import { Frame, FrameProps } from "../frames/Frame"
import { HTMLDiv } from "../native-react/HTML.Div"
import { Bar, BarProps } from "../parts/Bar"
import { IconProps } from "../primitives/Icon"
import { TextTitle, TextTitleProps } from "../primitives/TextTitle"
import { combineClassNames } from "../utils/class-name"

export interface DialogPaletteProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  bar?: BarProps | null
  textTitle?: TextTitleProps | null
  buttonIconic?: ButtonIconicProps | null
  icon?: IconProps | null
  frame?: FrameProps | null
}

/*****
 * Dialog: DialogPalette
 * Level: Module
 * Intent: Schema for modal-style dialog panels with overlay behavior, used for alerts, confirmations, or embedded interactive content.
 * Tags: panel, dialog, modal, ui, overlay, popup, interaction, alert
 * Type: Inline
 *
 * @example
 * ```tsx
 * <DialogPalette
 *   role="dialog"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function DialogPalette({
  className = "",
  bar = sdn.bar,
  textTitle,
  buttonIconic = sdn.buttonIconic,
  icon = sdn.icon,
  frame = sdn.frame,
  children,
  ...props
}: DialogPaletteProps) {
  const dialogPaletteClassName = combineClassNames("sdn-dialog", className)
  const barProps =
    bar === null
      ? null
      : {
          ...sdn.bar,
          ...bar,
          className: combineClassNames(sdn.bar?.className, bar?.className),
        }
  const textTitleProps =
    textTitle === null
      ? null
      : {
          ...sdn.textTitle,
          ...textTitle,
          className: combineClassNames(
            sdn.textTitle?.className,
            textTitle?.className,
          ),
        }
  const buttonIconicProps =
    buttonIconic === null
      ? null
      : {
          ...sdn.buttonIconic,
          ...buttonIconic,
          className: combineClassNames(
            sdn.buttonIconic?.className,
            buttonIconic?.className,
          ),
        }
  const iconProps =
    icon === null
      ? null
      : {
          ...sdn.icon,
          ...icon,
          className: combineClassNames(sdn.icon?.className, icon?.className),
        }
  const frameProps =
    frame === null
      ? null
      : {
          ...sdn.frame,
          ...frame,
          className: combineClassNames(sdn.frame?.className, frame?.className),
        }

  return (
    <HTMLDiv
      className={dialogPaletteClassName}
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
        </>
      )}
    </HTMLDiv>
  )
}

//
// Default property values
//
const sdn: DialogPaletteProps = {
  role: "dialog",
  "aria-hidden": "false",
  className: "sdn-dialog sdn-dialog",
  bar: {
    "aria-hidden": "false",
    className: "sdn-bar sdn-bar--9xs7",
  },
  textTitle: {
    className: "sdn-text-title sdn-text-title--ulid",
  },
  buttonIconic: {
    className: "sdn-button-iconic sdn-button-iconic--pgsr",
  },
  icon: {
    icon: "seldon-component",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--umgs",
  },
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--88jo",
  },
}
