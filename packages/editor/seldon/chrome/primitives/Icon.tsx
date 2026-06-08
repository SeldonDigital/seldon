/*
 * This code was generated using Seldon (https://seldon.app)
 *
 * Licensed under the Terms of Use: https://seldon.digital/terms-of-service
 * Do not redistribute or sublicense without permission.
 *
 * You may not use this software, or any derivative works of it,
 * in whole or in part, for the purposes of training, fine-tuning,
 * or otherwise improving (directly or indirectly) any machine learning
 * or artificial intelligence system.
 */
import { SVGAttributes } from "react"
import { IconMaterialBlock } from "@seldon/core/icon-sets/catalog/material/system/security/IconMaterialBlock"
import { IconMaterialVisibilityOff } from "@seldon/core/icon-sets/catalog/material/user-interface/status/IconMaterialVisibilityOff"
import {
  IconDefault,
  IconMaterialAdd,
  IconMaterialBolt,
  IconMaterialChevronDoubleLeft,
  IconMaterialChevronRight,
  IconMaterialClose,
  IconMaterialDelete,
  IconMaterialRobot,
  IconMaterialSearch,
  IconMaterialThumbDown,
  IconMaterialThumbP,
  IconMaterialUnfoldLess,
  IconMaterialUnfoldMore,
  IconMaterialUpload,
  IconSeldonBackground,
  IconSeldonComponent,
  IconSeldonComponentDefault,
  IconSeldonComponentVariant,
  IconSeldonFrame,
  IconSeldonFrameColumns,
  IconSeldonFrameRows,
  IconSeldonIcon,
  IconSeldonImage,
  IconSeldonImageFit,
  IconSeldonInput,
  IconSeldonReset,
  IconSeldonScreen,
  IconSeldonStub,
  IconSeldonSwatch,
  IconSeldonText,
  IconSeldonTheme,
  IconSeldonToolArrow,
  IconSeldonToolComponent,
  IconSeldonToolSketch,
} from "../../icons"

export interface IconProps extends SVGAttributes<SVGElement> {
  className?: string
  icon?:
    | "__default__"
    | "material-add"
    | "material-block"
    | "material-bolt"
    | "material-chevronDoubleLeft"
    | "material-chevronRight"
    | "material-close"
    | "material-delete"
    | "material-robot"
    | "material-search"
    | "material-thumbDown"
    | "material-thumbP"
    | "material-unfoldLess"
    | "material-unfoldMore"
    | "material-upload"
    | "material-visibilityOff"
    | "seldon-background"
    | "seldon-component"
    | "seldon-componentDefault"
    | "seldon-componentVariant"
    | "seldon-frame"
    | "seldon-frameColumns"
    | "seldon-frameRows"
    | "seldon-icon"
    | "seldon-image"
    | "seldon-imageFit"
    | "seldon-input"
    | "seldon-reset"
    | "seldon-screen"
    | "seldon-stub"
    | "seldon-swatch"
    | "seldon-text"
    | "seldon-theme"
    | "seldon-toolArrow"
    | "seldon-toolComponent"
    | "seldon-toolSketch"
}

export function Icon({
  className = "",
  icon = "__default__",
  ...props
}: IconProps) {
  let Icon = iconMap[icon || "__default__"]
  if (!Icon) {
    Icon = iconMap["__default__"]
    console.error(`Icon ${icon} not found. Falling back to the default icon.`)
  }
  return <Icon className={"variant-icon-default " + className} {...props} />
}
const iconMap = {
  __default__: IconDefault,
  "material-chevronDoubleLeft": IconMaterialChevronDoubleLeft,
  "seldon-component": IconSeldonComponent,
  "seldon-frameRows": IconSeldonFrameRows,
  "seldon-frameColumns": IconSeldonFrameColumns,
  "seldon-text": IconSeldonText,
  "seldon-background": IconSeldonBackground,
  "seldon-frame": IconSeldonFrame,
  "seldon-componentVariant": IconSeldonComponentVariant,
  "seldon-componentDefault": IconSeldonComponentDefault,
  "seldon-screen": IconSeldonScreen,
  "seldon-input": IconSeldonInput,
  "seldon-image": IconSeldonImage,
  "seldon-icon": IconSeldonIcon,
  "seldon-toolArrow": IconSeldonToolArrow,
  "material-thumbP": IconMaterialThumbP,
  "material-thumbDown": IconMaterialThumbDown,
  "material-bolt": IconMaterialBolt,
  "seldon-stub": IconSeldonStub,
  "seldon-reset": IconSeldonReset,
  "material-chevronRight": IconMaterialChevronRight,
  "material-delete": IconMaterialDelete,
  "material-unfoldLess": IconMaterialUnfoldLess,
  "material-add": IconMaterialAdd,
  "material-unfoldMore": IconMaterialUnfoldMore,
  "seldon-imageFit": IconSeldonImageFit,
  "material-block": IconMaterialBlock,
  "material-visibilityOff": IconMaterialVisibilityOff,
  "material-upload": IconMaterialUpload,
  "seldon-swatch": IconSeldonSwatch,
  "seldon-theme": IconSeldonTheme,
  "material-search": IconMaterialSearch,
  "material-robot": IconMaterialRobot,
  "material-close": IconMaterialClose,
  "seldon-toolComponent": IconSeldonToolComponent,
  "seldon-toolSketch": IconSeldonToolSketch,
}
