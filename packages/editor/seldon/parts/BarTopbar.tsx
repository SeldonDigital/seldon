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
import { ButtonMenu, ButtonMenuProps } from "../elements/ButtonMenu"
import { ButtonSimple, ButtonSimpleProps } from "../elements/ButtonSimple"
import { Frame, FrameProps } from "../frames/Frame"
import { Icon, IconProps } from "../primitives/Icon"
import { Image, ImageProps } from "../primitives/Image"
import { TextLabel, TextLabelProps } from "../primitives/TextLabel"
import { applyRef } from "../utils/apply-ref"
import { combineClassNames } from "../utils/class-name"

export interface BarTopbarProps extends HTMLAttributes<HTMLElement> {
  className?: string
  "data-seldon-ref"?: string
  seldonRefs?: Record<string, Record<string, unknown>>
  frame?: FrameProps | null
  frame2?: FrameProps | null
  image?: ImageProps | null
  image2?: ImageProps | null
  frame3?: FrameProps | null
  buttonSimple?: ButtonSimpleProps | null
  textLabel?: TextLabelProps | null
  buttonSimple2?: ButtonSimpleProps | null
  textLabel2?: TextLabelProps | null
  buttonSimple3?: ButtonSimpleProps | null
  textLabel3?: TextLabelProps | null
  buttonSimple4?: ButtonSimpleProps | null
  textLabel4?: TextLabelProps | null
  buttonSimple5?: ButtonSimpleProps | null
  textLabel5?: TextLabelProps | null
  frame4?: FrameProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel6?: TextLabelProps | null
  icon?: IconProps | null
  buttonMenu2?: ButtonMenuProps | null
  textLabel7?: TextLabelProps | null
  icon2?: IconProps | null
}

/*****
 * Bar: BarTopbar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * @example
 * ```tsx
 * <BarTopbar
 *   role="menubar"
 *   aria-hidden="false"
 * />
 * ```
 *****/
export function BarTopbar({
  className = "",
  frame = sdn.frame,
  frame2 = sdn.frame2,
  image,
  image2,
  frame3 = sdn.frame3,
  buttonSimple,
  textLabel,
  buttonSimple2,
  textLabel2,
  buttonSimple3,
  textLabel3,
  buttonSimple4,
  textLabel4,
  buttonSimple5,
  textLabel5,
  frame4 = sdn.frame4,
  buttonMenu,
  textLabel6,
  icon = sdn.icon,
  buttonMenu2,
  textLabel7,
  icon2 = sdn.icon2,
  children,
  seldonRefs,
  ...props
}: BarTopbarProps) {
  const barTopbarClassName = combineClassNames("sdn-bar-topbar", className)
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
  const imageProps = applyRef(
    seldonRefs,
    image === null
      ? null
      : {
          ...sdn.image,
          ...image,
          className: combineClassNames(sdn.image?.className, image?.className),
        },
  )
  const image2Props = applyRef(
    seldonRefs,
    image2 === null
      ? null
      : {
          ...sdn.image2,
          ...image2,
          className: combineClassNames(
            sdn.image2?.className,
            image2?.className,
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
  const buttonSimpleProps = applyRef(
    seldonRefs,
    buttonSimple === null
      ? null
      : {
          ...sdn.buttonSimple,
          ...buttonSimple,
          className: combineClassNames(
            sdn.buttonSimple?.className,
            buttonSimple?.className,
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
  const buttonSimple2Props = applyRef(
    seldonRefs,
    buttonSimple2 === null
      ? null
      : {
          ...sdn.buttonSimple2,
          ...buttonSimple2,
          className: combineClassNames(
            sdn.buttonSimple2?.className,
            buttonSimple2?.className,
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
  const buttonSimple3Props = applyRef(
    seldonRefs,
    buttonSimple3 === null
      ? null
      : {
          ...sdn.buttonSimple3,
          ...buttonSimple3,
          className: combineClassNames(
            sdn.buttonSimple3?.className,
            buttonSimple3?.className,
          ),
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
  const buttonSimple4Props = applyRef(
    seldonRefs,
    buttonSimple4 === null
      ? null
      : {
          ...sdn.buttonSimple4,
          ...buttonSimple4,
          className: combineClassNames(
            sdn.buttonSimple4?.className,
            buttonSimple4?.className,
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
  const buttonSimple5Props = applyRef(
    seldonRefs,
    buttonSimple5 === null
      ? null
      : {
          ...sdn.buttonSimple5,
          ...buttonSimple5,
          className: combineClassNames(
            sdn.buttonSimple5?.className,
            buttonSimple5?.className,
          ),
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
  const textLabel7Props = applyRef(
    seldonRefs,
    textLabel7 === null
      ? null
      : {
          ...sdn.textLabel7,
          ...textLabel7,
          className: combineClassNames(
            sdn.textLabel7?.className,
            textLabel7?.className,
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

  return (
    <Frame
      className={barTopbarClassName}
      role={sdn["role"]}
      aria-hidden={sdn["aria-hidden"]}
      {...props}
    >
      {children !== undefined ? (
        children
      ) : (
        <>
          <Frame {...frameProps}>
            <Frame {...frame2Props}>
              {image && imageProps && <Image {...imageProps} />}
              {image2 && image2Props && <Image {...image2Props} />}
            </Frame>
            <Frame {...frame3Props}>
              {buttonSimple && buttonSimpleProps && (
                <ButtonSimple {...buttonSimpleProps}>
                  {textLabel && textLabelProps && (
                    <TextLabel {...textLabelProps} />
                  )}
                </ButtonSimple>
              )}
              {buttonSimple2 && buttonSimple2Props && (
                <ButtonSimple {...buttonSimple2Props}>
                  {textLabel2 && textLabel2Props && (
                    <TextLabel {...textLabel2Props} />
                  )}
                </ButtonSimple>
              )}
              {buttonSimple3 && buttonSimple3Props && (
                <ButtonSimple {...buttonSimple3Props}>
                  {textLabel3 && textLabel3Props && (
                    <TextLabel {...textLabel3Props} />
                  )}
                </ButtonSimple>
              )}
              {buttonSimple4 && buttonSimple4Props && (
                <ButtonSimple {...buttonSimple4Props}>
                  {textLabel4 && textLabel4Props && (
                    <TextLabel {...textLabel4Props} />
                  )}
                </ButtonSimple>
              )}
              {buttonSimple5 && buttonSimple5Props && (
                <ButtonSimple {...buttonSimple5Props}>
                  {textLabel5 && textLabel5Props && (
                    <TextLabel {...textLabel5Props} />
                  )}
                </ButtonSimple>
              )}
            </Frame>
          </Frame>
          <Frame {...frame4Props}>
            {buttonMenu && buttonMenuProps && (
              <ButtonMenu {...buttonMenuProps}>
                {textLabel6 && textLabel6Props && (
                  <TextLabel {...textLabel6Props} />
                )}
                {icon && iconProps && <Icon {...iconProps} />}
              </ButtonMenu>
            )}
            {buttonMenu2 && buttonMenu2Props && (
              <ButtonMenu {...buttonMenu2Props}>
                {textLabel7 && textLabel7Props && (
                  <TextLabel {...textLabel7Props} />
                )}
                {icon2 && icon2Props && <Icon {...icon2Props} />}
              </ButtonMenu>
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
const sdn: BarTopbarProps = {
  role: "menubar",
  "aria-hidden": "false",
  className: "sdn-bar-topbar sdn-bar",
  frame: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--33uo",
  },
  frame2: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--ajnq",
    "data-seldon-ref": "logo",
  },
  image: {
    className: "sdn-image sdn-image--33xp",
  },
  image2: {
    className: "sdn-image sdn-image--dnok",
  },
  frame3: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--drsa",
    "data-seldon-ref": "menus",
  },
  buttonSimple: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuFile",
  },
  textLabel: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  buttonSimple2: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuEdit",
  },
  textLabel2: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  buttonSimple3: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuComponent",
  },
  textLabel3: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  buttonSimple4: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuView",
  },
  textLabel4: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  buttonSimple5: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuDev",
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  frame4: {
    wrapperElement: "div",
    "aria-hidden": "false",
    className: "sdn-frame sdn-frame--nzij",
  },
  buttonMenu: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "menuTheme",
  },
  textLabel6: {
    className: "sdn-text-label sdn-text-label--zw0q",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--iqmk",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "menuMode",
  },
  textLabel7: {
    className: "sdn-text-label sdn-text-label--zw0q",
  },
  icon2: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--iqmk",
  },
}
