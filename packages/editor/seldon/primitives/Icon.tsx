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

export interface IconProps
  extends Omit<SVGAttributes<SVGElement>, "color" | "enabled"> {
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
  // TODO: Need to reconcile custom icons - these were added temporarily to support property icons
  "icon-custom-align-value": CustomIcons.IconCustomAlignValue,
  "icon-custom-background-color-value":
    CustomIcons.IconCustomBackgroundColorValue,
  "icon-custom-background-value": CustomIcons.IconCustomBackgroundValue,
  "icon-custom-boolean-value": CustomIcons.IconCustomBooleanValue,
  "icon-custom-border-color-value": CustomIcons.IconCustomBorderColorValue,
  "icon-custom-border-style-value": CustomIcons.IconCustomBorderStyleValue,
  "icon-custom-brightness-value": CustomIcons.IconCustomBrightnessValue,
  "icon-custom-checkbox-checked-value":
    CustomIcons.IconCustomCheckboxCheckedValue,
  "icon-custom-checkbox-unchecked-value":
    CustomIcons.IconCustomCheckboxUncheckedValue,
  "icon-custom-clip-value": CustomIcons.IconCustomClipValue,
  "icon-custom-color-value": CustomIcons.IconCustomColorValue,
  "icon-custom-corner-value": CustomIcons.IconCustomCornerValue,
  "icon-custom-custom-value": CustomIcons.IconCustomCustomValue,
  "icon-custom-degrees-value": CustomIcons.IconCustomDegreesValue,
  "icon-custom-display-hide-value": CustomIcons.IconCustomDisplayHideValue,
  "icon-custom-duplicate": CustomIcons.IconCustomDuplicate,
  "icon-custom-edit": CustomIcons.IconCustomEdit,
  "icon-custom-display-show-value": CustomIcons.IconCustomDisplayShowValue,
  "icon-custom-font-family": CustomIcons.IconCustomFontFamily,
  "icon-custom-font-size-value": CustomIcons.IconCustomFontSizeValue,
  "icon-custom-font-value": CustomIcons.IconCustomFontValue,
  "icon-custom-font-weight-value": CustomIcons.IconCustomFontWeightValue,
  "icon-custom-gap-value": CustomIcons.IconCustomGapValue,
  "icon-custom-gradient-value": CustomIcons.IconCustomGradientValue,
  "icon-custom-height-value": CustomIcons.IconCustomHeightValue,
  "icon-custom-horizontal-value": CustomIcons.IconCustomHorizontalValue,
  "icon-custom-image-fit": CustomIcons.IconCustomImageFit,
  "icon-custom-image-value": CustomIcons.IconCustomImageValue,
  "icon-custom-input-type-value": CustomIcons.IconCustomInputTypeValue,
  "icon-custom-letter-spacing-value": CustomIcons.IconCustomLetterSpacingValue,
  "icon-custom-line-height-value": CustomIcons.IconCustomLineHeightValue,
  "icon-custom-lines-value": CustomIcons.IconCustomLinesValue,
  "icon-custom-margin-side-value": CustomIcons.IconCustomMarginSideValue,
  "icon-custom-none-value": CustomIcons.IconCustomNoneValue,
  "icon-custom-opacity-value": CustomIcons.IconCustomOpacityValue,
  "icon-custom-padding-side-value": CustomIcons.IconCustomPaddingSideValue,
  "icon-custom-px-value": CustomIcons.IconCustomPxValue,
  "icon-custom-radio-checked-value": CustomIcons.IconCustomRadioCheckedValue,
  "icon-custom-radio-unchecked-value":
    CustomIcons.IconCustomRadioUncheckedValue,
  "icon-custom-rem-value": CustomIcons.IconCustomRemValue,
  "icon-custom-rotation-value": CustomIcons.IconCustomRotationValue,
  "icon-custom-rtl-value": CustomIcons.IconCustomRtlValue,
  "icon-custom-shadow-value": CustomIcons.IconCustomShadowValue,
  "icon-custom-size-value": CustomIcons.IconCustomSizeValue,
  "icon-custom-step-value": CustomIcons.IconCustomStepValue,
  "icon-custom-style-value": CustomIcons.IconCustomStyleValue,
  "icon-custom-swatch-value": CustomIcons.IconCustomSwatchValue,
  "icon-custom-text-align-value": CustomIcons.IconCustomTextAlignValue,
  "icon-custom-text-case-value": CustomIcons.IconCustomTextCaseValue,
  "icon-custom-text-decoration": CustomIcons.IconCustomTextDecoration,
  "icon-custom-text-value": CustomIcons.IconCustomTextValue,
  "icon-custom-theme-color-value": CustomIcons.IconCustomThemeColorValue,
  "icon-custom-theme-gradient-value": CustomIcons.IconCustomThemeGradientValue,
  "icon-custom-token-value": CustomIcons.IconCustomTokenValue,
  "icon-custom-vertical-value": CustomIcons.IconCustomVerticalValue,
  "icon-custom-width-value": CustomIcons.IconCustomWidthValue,
  "icon-custom-wrap-value": CustomIcons.IconCustomWrapValue,
}
