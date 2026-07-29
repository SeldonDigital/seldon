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
import { combineClassNames } from "../utils/class-name"
import { SeldonRefs, mergeOptionalSlot, mergeSlot } from "../utils/merge-slot"

export interface BarTopbarProps extends HTMLAttributes<HTMLElement> {
  "data-seldon-ref"?: string
  seldonRefs?: SeldonRefs

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
  buttonSimple6?: ButtonSimpleProps | null
  textLabel6?: TextLabelProps | null

  frame4?: FrameProps | null
  buttonMenu?: ButtonMenuProps | null
  textLabel7?: TextLabelProps | null
  icon?: IconProps | null
  buttonMenu2?: ButtonMenuProps | null
  textLabel8?: TextLabelProps | null
  icon2?: IconProps | null
}

//
// Default property values
//
const sdn: BarTopbarProps = {
  role: "menubar",
  "aria-hidden": "false",
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
  },
  textLabel5: {
    className: "sdn-text-label sdn-text-label--lbxv",
  },
  buttonSimple6: {
    className: "sdn-button-simple sdn-button-simple--dbgs",
    "data-seldon-ref": "menuDev",
  },
  textLabel6: {
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
  textLabel7: {
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
  buttonMenu2: {
    className: "sdn-button-menu sdn-button-iconic--pgsr",
    "data-seldon-ref": "menuMode",
  },
  textLabel8: {
    className: "sdn-text-label sdn-text-label--sa6t",
  },
  icon2: {
    icon: "material-chevronDown",
    "aria-hidden": "true",
    className: "sdn-icon sdn-icon--y2ct",
  },
}

/**
 * Bar: BarTopbar
 * Level: Part
 * Intent: Groups related controls in a horizontal bar with buttons, navigation, or tabs layouts.
 * Tags: bar, controls, buttons, navigation, tabs, UI, layout, group
 * Type: Inline
 *
 * Structure:
 *   Frame             frame
 *     Frame           frame2         -> logo
 *       Image         image
 *       Image         image2
 *     Frame           frame3         -> menus
 *       ButtonSimple  buttonSimple   -> menuFile
 *         TextLabel   textLabel
 *       ButtonSimple  buttonSimple2  -> menuEdit
 *         TextLabel   textLabel2
 *       ButtonSimple  buttonSimple3  -> menuComponent
 *         TextLabel   textLabel3
 *       ButtonSimple  buttonSimple4  -> menuView
 *         TextLabel   textLabel4
 *       ButtonSimple  buttonSimple5
 *         TextLabel   textLabel5
 *       ButtonSimple  buttonSimple6  -> menuDev
 *         TextLabel   textLabel6
 *   Frame             frame4
 *     ButtonMenu      buttonMenu     -> menuTheme
 *       TextLabel     textLabel7
 *       Icon          icon
 *     ButtonMenu      buttonMenu2    -> menuMode
 *       TextLabel     textLabel8
 *       Icon          icon2
 *
 * @example
 * ```tsx
 * <BarTopbar
 *   role="menubar"
 *   aria-hidden="false"
 * />
 * ```
 */
export function BarTopbar({
  className = "",
  frame,
  frame2,
  image,
  image2,
  frame3,
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
  buttonSimple6,
  textLabel6,

  frame4,
  buttonMenu,
  textLabel7,
  icon,
  buttonMenu2,
  textLabel8,
  icon2,

  children,
  seldonRefs,
  ...props
}: BarTopbarProps) {
  const barTopbarClassName = combineClassNames("sdn-bar-topbar", className)

  const frameProps = mergeSlot(sdn.frame, frame, seldonRefs)
  const frame2Props = mergeSlot(sdn.frame2, frame2, seldonRefs)
  const imageProps = mergeOptionalSlot(sdn.image, image, seldonRefs)
  const image2Props = mergeOptionalSlot(sdn.image2, image2, seldonRefs)
  const frame3Props = mergeSlot(sdn.frame3, frame3, seldonRefs)
  const buttonSimpleProps = mergeOptionalSlot(sdn.buttonSimple, buttonSimple, seldonRefs)
  const textLabelProps = mergeOptionalSlot(sdn.textLabel, textLabel, seldonRefs)
  const buttonSimple2Props = mergeOptionalSlot(sdn.buttonSimple2, buttonSimple2, seldonRefs)
  const textLabel2Props = mergeOptionalSlot(sdn.textLabel2, textLabel2, seldonRefs)
  const buttonSimple3Props = mergeOptionalSlot(sdn.buttonSimple3, buttonSimple3, seldonRefs)
  const textLabel3Props = mergeOptionalSlot(sdn.textLabel3, textLabel3, seldonRefs)
  const buttonSimple4Props = mergeOptionalSlot(sdn.buttonSimple4, buttonSimple4, seldonRefs)
  const textLabel4Props = mergeOptionalSlot(sdn.textLabel4, textLabel4, seldonRefs)
  const buttonSimple5Props = mergeOptionalSlot(sdn.buttonSimple5, buttonSimple5, seldonRefs)
  const textLabel5Props = mergeOptionalSlot(sdn.textLabel5, textLabel5, seldonRefs)
  const buttonSimple6Props = mergeOptionalSlot(sdn.buttonSimple6, buttonSimple6, seldonRefs)
  const textLabel6Props = mergeOptionalSlot(sdn.textLabel6, textLabel6, seldonRefs)

  const frame4Props = mergeSlot(sdn.frame4, frame4, seldonRefs)
  const buttonMenuProps = mergeOptionalSlot(sdn.buttonMenu, buttonMenu, seldonRefs)
  const textLabel7Props = mergeOptionalSlot(sdn.textLabel7, textLabel7, seldonRefs)
  const iconProps = mergeSlot(sdn.icon, icon, seldonRefs)
  const buttonMenu2Props = mergeOptionalSlot(sdn.buttonMenu2, buttonMenu2, seldonRefs)
  const textLabel8Props = mergeOptionalSlot(sdn.textLabel8, textLabel8, seldonRefs)
  const icon2Props = mergeSlot(sdn.icon2, icon2, seldonRefs)

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
              {imageProps !== null && <Image {...imageProps} />}
              {image2Props !== null && <Image {...image2Props} />}
            </Frame>
            <Frame {...frame3Props}>
              {buttonSimpleProps !== null && (
                <ButtonSimple {...buttonSimpleProps}>
                  {textLabelProps !== null && <TextLabel {...textLabelProps} />}
                </ButtonSimple>
              )}
              {buttonSimple2Props !== null && (
                <ButtonSimple {...buttonSimple2Props}>
                  {textLabel2Props !== null && <TextLabel {...textLabel2Props} />}
                </ButtonSimple>
              )}
              {buttonSimple3Props !== null && (
                <ButtonSimple {...buttonSimple3Props}>
                  {textLabel3Props !== null && <TextLabel {...textLabel3Props} />}
                </ButtonSimple>
              )}
              {buttonSimple4Props !== null && (
                <ButtonSimple {...buttonSimple4Props}>
                  {textLabel4Props !== null && <TextLabel {...textLabel4Props} />}
                </ButtonSimple>
              )}
              {buttonSimple5Props !== null && (
                <ButtonSimple {...buttonSimple5Props}>
                  {textLabel5Props !== null && <TextLabel {...textLabel5Props} />}
                </ButtonSimple>
              )}
              {buttonSimple6Props !== null && (
                <ButtonSimple {...buttonSimple6Props}>
                  {textLabel6Props !== null && <TextLabel {...textLabel6Props} />}
                </ButtonSimple>
              )}
            </Frame>
          </Frame>
          <Frame {...frame4Props}>
            {buttonMenuProps !== null && (
              <ButtonMenu {...buttonMenuProps}>
                {textLabel7Props !== null && <TextLabel {...textLabel7Props} />}
                {iconProps !== null && <Icon {...iconProps} />}
              </ButtonMenu>
            )}
            {buttonMenu2Props !== null && (
              <ButtonMenu {...buttonMenu2Props}>
                {textLabel8Props !== null && <TextLabel {...textLabel8Props} />}
                {icon2Props !== null && <Icon {...icon2Props} />}
              </ButtonMenu>
            )}
          </Frame>
        </>
      )}
    </Frame>
  )
}
