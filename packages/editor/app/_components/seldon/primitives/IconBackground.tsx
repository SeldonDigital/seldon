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
import { IconDefault } from "../icons/IconDefault"
import { IconMaterialAdd } from "../icons/IconMaterialAdd"
import { IconMaterialBolt } from "../icons/IconMaterialBolt"
import { IconMaterialChevronDoubleLeft } from "../icons/IconMaterialChevronDoubleLeft"
import { IconMaterialChevronRight } from "../icons/IconMaterialChevronRight"
import { IconMaterialClose } from "../icons/IconMaterialClose"
import { IconMaterialDelete } from "../icons/IconMaterialDelete"
import { IconMaterialRobot } from "../icons/IconMaterialRobot"
import { IconMaterialSearch } from "../icons/IconMaterialSearch"
import { IconMaterialThumbDown } from "../icons/IconMaterialThumbDown"
import { IconMaterialThumbP } from "../icons/IconMaterialThumbP"
import { IconMaterialUnfoldLess } from "../icons/IconMaterialUnfoldLess"
import { IconMaterialUnfoldMore } from "../icons/IconMaterialUnfoldMore"
import { IconMaterialUpload } from "../icons/IconMaterialUpload"
import { IconSeldonBackground } from "../icons/IconSeldonBackground"
import { IconSeldonComponent } from "../icons/IconSeldonComponent"
import { IconSeldonComponentDefault } from "../icons/IconSeldonComponentDefault"
import { IconSeldonComponentVariant } from "../icons/IconSeldonComponentVariant"
import { IconSeldonFrame } from "../icons/IconSeldonFrame"
import { IconSeldonFrameColumns } from "../icons/IconSeldonFrameColumns"
import { IconSeldonFrameRows } from "../icons/IconSeldonFrameRows"
import { IconSeldonIcon } from "../icons/IconSeldonIcon"
import { IconSeldonImage } from "../icons/IconSeldonImage"
import { IconSeldonImageFit } from "../icons/IconSeldonImageFit"
import { IconSeldonInput } from "../icons/IconSeldonInput"
import { IconSeldonReset } from "../icons/IconSeldonReset"
import { IconSeldonScreen } from "../icons/IconSeldonScreen"
import { IconSeldonStub } from "../icons/IconSeldonStub"
import { IconSeldonSwatch } from "../icons/IconSeldonSwatch"
import { IconSeldonText } from "../icons/IconSeldonText"
import { IconSeldonToolArrow } from "../icons/IconSeldonToolArrow"
import { IconSeldonToolComponent } from "../icons/IconSeldonToolComponent"
import { IconSeldonToolSketch } from "../icons/IconSeldonToolSketch"

export interface IconBackgroundProps extends SVGAttributes<SVGElement> {
  className?: string
  icon?:
    | "__default__"
    | "material-chevronDoubleLeft"
    | "seldon-component"
    | "seldon-frameRows"
    | "seldon-frameColumns"
    | "seldon-text"
    | "seldon-background"
    | "seldon-frame"
    | "seldon-componentVariant"
    | "seldon-componentDefault"
    | "seldon-screen"
    | "seldon-input"
    | "seldon-image"
    | "seldon-icon"
    | "seldon-toolArrow"
    | "material-thumbP"
    | "material-thumbDown"
    | "material-bolt"
    | "seldon-stub"
    | "seldon-reset"
    | "material-chevronRight"
    | "material-delete"
    | "material-unfoldLess"
    | "material-add"
    | "material-unfoldMore"
    | "seldon-imageFit"
    | "material-upload"
    | "seldon-swatch"
    | "material-search"
    | "material-robot"
    | "material-close"
    | "seldon-toolComponent"
    | "seldon-toolSketch"
}

export function IconBackground({
  className = "",
  icon = "seldon-background",
  ...props
}: IconBackgroundProps) {
  let Icon = iconMap[icon || "__default__"]
  if (!Icon) {
    Icon = iconMap["__default__"]
    console.error(`Icon ${icon} not found. Falling back to the default icon.`)
  }
  return <Icon className={"variant-icon-kUssCT " + className} {...props} />
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
  "material-upload": IconMaterialUpload,
  "seldon-swatch": IconSeldonSwatch,
  "material-search": IconMaterialSearch,
  "material-robot": IconMaterialRobot,
  "material-close": IconMaterialClose,
  "seldon-toolComponent": IconSeldonToolComponent,
  "seldon-toolSketch": IconSeldonToolSketch,
}
