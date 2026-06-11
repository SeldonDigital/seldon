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
import { SVGAttributes } from "react"
// TODO: Need to reconcile custom icons - these were added temporarily to support property icons
import * as CustomIcons from "../custom-icons/index"
import * as Icons from "../icons/index"
import { combineClassNames } from "../utils/class-name"

export interface IconProps extends Omit<
  SVGAttributes<SVGElement>,
  "color" | "enabled"
> {
  className?: string
  enabled?: boolean
  color?: string | null
  icon?:
    | "__default__"
    | "seldon-component"
    | "material-chevronRight"
    | "material-close"
    | "seldon-reset"
    | "material-chevronDoubleLeft"
    | "material-bolt"
    | "material-unfoldMore"
    | "material-add"
    | "material-more"
    | "material-chevronDown"
    | "material-keyboardArrowDown"
    | "material-keyboardArrowRight"
    | "material-moreHoriz"
    | "material-code"
    | "material-delete"
    | "material-robot"
    | "material-search"
    | "material-thumbDown"
    | "material-thumbP"
    | "material-unfoldLess"
    | "material-upload"
    | "seldon-background"
    | "seldon-componentDefault"
    | "seldon-componentVariant"
    | "seldon-frame"
    | "seldon-frameColumns"
    | "seldon-frameRows"
    | "seldon-icon"
    | "seldon-image"
    | "seldon-imageFit"
    | "seldon-input"
    | "seldon-more"
    | "seldon-screen"
    | "seldon-stub"
    | "seldon-swatch"
    | "seldon-text"
    | "seldon-theme"
    | "seldon-toolArrow"
    | "seldon-toolComponent"
    | "seldon-toolSketch"
    | "seldon-valuePx"
    // TODO: Need to reconcile custom icons - these were added temporarily to support property icons
    | "icon-custom-align-value"
    | "icon-custom-background-color-value"
    | "icon-custom-background-value"
    | "icon-custom-boolean-value"
    | "icon-custom-border-color-value"
    | "icon-custom-border-style-value"
    | "icon-custom-brightness-value"
    | "icon-custom-checkbox-checked-value"
    | "icon-custom-checkbox-unchecked-value"
    | "icon-custom-clip-value"
    | "icon-custom-color-value"
    | "icon-custom-corner-value"
    | "icon-custom-custom-value"
    | "icon-custom-degrees-value"
    | "icon-custom-display-hide-value"
    | "icon-custom-duplicate"
    | "icon-custom-edit"
    | "icon-custom-display-show-value"
    | "icon-custom-font-family"
    | "icon-custom-font-size-value"
    | "icon-custom-font-value"
    | "icon-custom-font-weight-value"
    | "icon-custom-gap-value"
    | "icon-custom-gradient-value"
    | "icon-custom-height-value"
    | "icon-custom-horizontal-value"
    | "icon-custom-image-fit"
    | "icon-custom-image-value"
    | "icon-custom-input-type-value"
    | "icon-custom-letter-spacing-value"
    | "icon-custom-line-height-value"
    | "icon-custom-lines-value"
    | "icon-custom-margin-side-value"
    | "icon-custom-none-value"
    | "icon-custom-opacity-value"
    | "icon-custom-padding-side-value"
    | "icon-custom-px-value"
    | "icon-custom-radio-checked-value"
    | "icon-custom-radio-unchecked-value"
    | "icon-custom-rem-value"
    | "icon-custom-rotation-value"
    | "icon-custom-rtl-value"
    | "icon-custom-shadow-value"
    | "icon-custom-size-value"
    | "icon-custom-step-value"
    | "icon-custom-style-value"
    | "icon-custom-swatch-value"
    | "icon-custom-text-align-value"
    | "icon-custom-text-case-value"
    | "icon-custom-text-decoration"
    | "icon-custom-text-value"
    | "icon-custom-theme-color-value"
    | "icon-custom-theme-gradient-value"
    | "icon-custom-token-value"
    | "icon-custom-vertical-value"
    | "icon-custom-width-value"
    | "icon-custom-wrap-value"
}

/*****
 * Icon: Icon
 * Level: Primitive
 * Intent: Displays a vector or symbolic icon representing an action or concept.
 * Tags: icon, symbol, graphic, primitive, UI, decoration
 * Type: Default
 *
 * @example
 * ```tsx
 * <Icon
 *   icon="__default__"
 * />
 * ```
 *****/
export function Icon({
  className = "",
  icon = sdn.icon,
  color,
  ...props
}: IconProps) {
  const iconClassName = combineClassNames("sdn-icon", className)

  let Icon = iconMap[icon || ("__default__" as keyof typeof iconMap)]
  if (!Icon) {
    Icon = iconMap["__default__"]
  }
  //
  // React JSX component with merged default and custom properties
  //
  // Always pass color (as null if undefined) to satisfy components that require it
  // Icon components accept SVGAttributes<SVGSVGElement>, use type assertion for dynamic component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const iconProps = { ...props, color: color ?? null } as any
  return <Icon className={iconClassName} {...iconProps} />
}

//
// Default property values
//
const sdn: IconProps = {
  icon: "__default__",
  className: "sdn-icon",
}
const iconMap = {
  __default__: Icons.IconDefault,
  "seldon-component": Icons.IconSeldonComponent,
  "material-chevronRight": Icons.IconMaterialChevronRight,
  "material-close": Icons.IconMaterialClose,
  "seldon-reset": Icons.IconSeldonReset,
  "material-chevronDoubleLeft": Icons.IconMaterialChevronDoubleLeft,
  "material-bolt": Icons.IconMaterialBolt,
  "material-unfoldMore": Icons.IconMaterialUnfoldMore,
  "material-add": Icons.IconMaterialAdd,
  "material-more": Icons.IconMaterialMore,
  "material-chevronDown": Icons.IconMaterialChevronDown,
  "material-keyboardArrowDown": Icons.IconMaterialKeyboardArrowDown,
  "material-keyboardArrowRight": Icons.IconMaterialKeyboardArrowRight,
  "material-moreHoriz": Icons.IconMaterialMoreHoriz,
  "material-code": Icons.IconMaterialCode,
  "material-delete": Icons.IconMaterialDelete,
  "material-robot": Icons.IconMaterialRobot,
  "material-search": Icons.IconMaterialSearch,
  "material-thumbDown": Icons.IconMaterialThumbDown,
  "material-thumbP": Icons.IconMaterialThumbP,
  "material-unfoldLess": Icons.IconMaterialUnfoldLess,
  "material-upload": Icons.IconMaterialUpload,
  "seldon-background": Icons.IconSeldonBackground,
  "seldon-componentDefault": Icons.IconSeldonComponentDefault,
  "seldon-componentVariant": Icons.IconSeldonComponentVariant,
  "seldon-frame": Icons.IconSeldonFrame,
  "seldon-frameColumns": Icons.IconSeldonFrameColumns,
  "seldon-frameRows": Icons.IconSeldonFrameRows,
  "seldon-icon": Icons.IconSeldonIcon,
  "seldon-image": Icons.IconSeldonImage,
  "seldon-imageFit": Icons.IconSeldonImageFit,
  "seldon-input": Icons.IconSeldonInput,
  "seldon-more": Icons.IconSeldonMore,
  "seldon-screen": Icons.IconSeldonScreen,
  "seldon-stub": Icons.IconSeldonStub,
  "seldon-swatch": Icons.IconSeldonSwatch,
  "seldon-text": Icons.IconSeldonText,
  "seldon-theme": Icons.IconSeldonTheme,
  "seldon-toolArrow": Icons.IconSeldonToolArrow,
  "seldon-toolComponent": Icons.IconSeldonToolComponent,
  "seldon-toolSketch": Icons.IconSeldonToolSketch,
  "seldon-valuePx": Icons.IconSeldonValuePx,
  // Static property icons resolve to seldon/icons; dynamic ones stay on custom-icons
  "icon-custom-align-value": Icons.IconSeldonAlign,
  "icon-custom-background-color-value": Icons.IconSeldonBackgroundColor,
  "icon-custom-background-value": Icons.IconSeldonBackground,
  "icon-custom-boolean-value": CustomIcons.IconCustomBooleanValue,
  "icon-custom-border-color-value": Icons.IconSeldonBorderColor,
  "icon-custom-border-style-value": Icons.IconSeldonBorderStyle,
  "icon-custom-brightness-value": Icons.IconSeldonBrightness,
  "icon-custom-checkbox-checked-value": Icons.IconSeldonCheckboxOn,
  "icon-custom-checkbox-unchecked-value": Icons.IconSeldonCheckboxOff,
  "icon-custom-clip-value": Icons.IconSeldonClip,
  "icon-custom-color-value": CustomIcons.IconCustomColorValue,
  "icon-custom-corner-value": Icons.IconSeldonCorner,
  "icon-custom-custom-value": Icons.IconSeldonCustom,
  "icon-custom-degrees-value": Icons.IconSeldonAngle,
  "icon-custom-display-hide-value": Icons.IconSeldonHidden,
  "icon-custom-duplicate": Icons.IconSeldonDuplicate,
  "icon-custom-edit": Icons.IconSeldonEdited,
  "icon-custom-display-show-value": Icons.IconSeldonDisplay,
  "icon-custom-font-family": Icons.IconSeldonFontFamily,
  "icon-custom-font-size-value": Icons.IconSeldonFontSize,
  "icon-custom-font-value": Icons.IconSeldonFont,
  "icon-custom-font-weight-value": Icons.IconSeldonFontWeight,
  "icon-custom-gap-value": Icons.IconSeldonGap,
  "icon-custom-gradient-value": Icons.IconSeldonGradient,
  "icon-custom-height-value": Icons.IconSeldonHeight,
  "icon-custom-horizontal-value": Icons.IconSeldonOrientationHorizontal,
  "icon-custom-image-fit": Icons.IconSeldonImageFit,
  "icon-custom-image-value": Icons.IconSeldonImage,
  "icon-custom-input-type-value": Icons.IconSeldonInputType,
  "icon-custom-letter-spacing-value": Icons.IconSeldonFontLetterSpacing,
  "icon-custom-line-height-value": Icons.IconSeldonFontLineHeight,
  "icon-custom-lines-value": Icons.IconSeldonLines,
  "icon-custom-margin-side-value": Icons.IconSeldonMargin,
  "icon-custom-none-value": Icons.IconSeldonNone,
  "icon-custom-opacity-value": Icons.IconSeldonOpacity,
  "icon-custom-padding-side-value": Icons.IconSeldonPadding,
  "icon-custom-px-value": Icons.IconSeldonValuePx,
  "icon-custom-radio-checked-value": Icons.IconSeldonRadioOn,
  "icon-custom-radio-unchecked-value": Icons.IconSeldonRadioOff,
  "icon-custom-rem-value": Icons.IconSeldonValueRem,
  "icon-custom-rotation-value": Icons.IconSeldonRotation,
  "icon-custom-rtl-value": Icons.IconSeldonRtl,
  "icon-custom-shadow-value": Icons.IconSeldonShadow,
  "icon-custom-size-value": Icons.IconSeldonSize,
  "icon-custom-step-value": Icons.IconSeldonStep,
  "icon-custom-style-value": Icons.IconSeldonStyle,
  "icon-custom-swatch-value": CustomIcons.IconCustomSwatchValue,
  "icon-custom-text-align-value": Icons.IconSeldonTextAlign,
  "icon-custom-text-case-value": Icons.IconSeldonCase,
  "icon-custom-text-decoration": Icons.IconSeldonFontTextDecoration,
  "icon-custom-text-value": Icons.IconSeldonText,
  "icon-custom-theme-color-value": CustomIcons.IconCustomThemeColorValue,
  "icon-custom-theme-gradient-value": CustomIcons.IconCustomThemeGradientValue,
  "icon-custom-token-value": Icons.IconSeldonToken,
  "icon-custom-vertical-value": Icons.IconSeldonOrientationVertical,
  "icon-custom-width-value": Icons.IconSeldonWidth,
  "icon-custom-wrap-value": Icons.IconSeldonFontTextWrap,
}
