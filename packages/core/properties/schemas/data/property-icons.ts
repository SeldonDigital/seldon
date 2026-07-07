/**
 * Property icon catalog.
 *
 * One place that assigns an icon to a property row and to individual option
 * values. Keys are catalog keys from {@link PROPERTY_SCHEMAS} (for example
 * `borderColor`, `shadowOffsetX`) plus a few compound parent keys that are real
 * inspector rows but not flattened catalog keys (for example `background`,
 * `border`, `font`, `shadow`). The icon registry resolves a node property path
 * to a catalog key with `getCatalogKeyForPropertyPath`, then reads this map.
 *
 * Why a key map and not a field on each value module: the flat catalog reuses a
 * single value-module object across many catalog keys (for example every
 * border side shares one schema, `shadowOffsetX`/`shadowOffsetY` share one
 * schema). Keys that need different icons cannot both express them through a
 * shared module, so the icon is owned here at the catalog-key level.
 *
 * Icon ids are semantic names the editor's Icon wrapper renders, so they are
 * plain strings rather than the core `IconId` union (which omits these
 * property-set names). Render availability comes from the user's workspace icon
 * set; an unrenderable id shows the red "missing" symbol.
 */

/**
 * Default icon for a property row, keyed by catalog key or compound parent key.
 * Compound parent keys (`background`, `border`, `borderTop`...) are not in
 * `PROPERTY_SCHEMAS`, so the registry looks them up directly before falling
 * back to the resolved catalog key.
 */
export const PROPERTY_ICONS: Record<string, string> = {
  // Attributes
  content: "material-textSelectStart",
  altText: "seldon-text",
  ariaLabel: "seldon-text",
  ariaHidden: "material-radioButtonUnchecked",
  placeholder: "seldon-text",
  checked: "material-radioButtonUnchecked",
  inputType: "seldon-inputType",
  htmlElement: "material-codeXml",
  wrapperElement: "material-codeXml",
  symbol: "material-deployedCode",
  source: "seldon-image",
  imageFit: "material-aspectRatio",
  display: "material-visibility",
  size: "material-aspectRatio",
  buttonSize: "material-aspectRatio",
  boardPreset: "seldon-component",
  boardWidth: "material-width",
  boardHeight: "material-height",

  // Layout
  direction: "material-formatTextdirectionLToR",
  orientation: "material-desktopLandscape",
  align: "seldon-positionCenter",
  cellAlign: "seldon-align",
  placement: "material-openWith",
  position: "seldon-positionTopLeft",
  "position.top": "seldon-positionTop",
  "position.right": "seldon-positionRight",
  "position.bottom": "seldon-positionBottom",
  "position.left": "seldon-positionLeft",
  width: "material-width",
  height: "material-height",
  screenWidth: "material-width",
  screenHeight: "material-height",
  margin: "material-margin",
  padding: "material-padding",
  gap: "seldon-gap",
  rotation: "material-rotateRight",
  wrapChildren: "material-wrapText",
  clip: "seldon-clip",
  cursor: "material-mouse",
  columnStart: "material-splitscreenVerticalAdd",
  columnSpan: "material-fitPageHeight",
  rowStart: "material-splitscreenAdd",
  rowSpan: "material-fitPageWidth",

  // Appearance
  color: "seldon-backgroundColor",
  accentColor: "seldon-backgroundColor",
  brightness: "material-brightnessMedium",
  opacity: "material-opacity",
  background: "material-colors",
  backgroundPreset: "material-gradient",
  backgroundColor: "seldon-backgroundColor",
  backgroundBrightness: "material-brightnessMedium",
  backgroundOpacity: "material-opacity",
  backgroundImage: "seldon-image",
  backgroundPosition: "seldon-positionCenter",
  backgroundSize: "material-aspectRatio",
  backgroundRepeat: "material-copyAll",
  backgroundBlendMode: "material-layers",
  backgroundFilter: "material-blurCircular",
  backgroundAngle: "material-rotateRight",
  backgroundPositionX: "material-width",
  backgroundPositionY: "material-height",
  backgroundShape: "material-circle",
  backgroundRadialSize: "material-aspectRatio",
  backgroundConicRepeat: "material-autorenew",
  backgroundStartColor: "seldon-backgroundColor",
  backgroundStartBrightness: "material-brightnessMedium",
  backgroundStartOpacity: "material-opacity",
  backgroundStartPosition: "material-lineStartCircle",
  backgroundEndColor: "seldon-backgroundColor",
  backgroundEndBrightness: "material-brightnessMedium",
  backgroundEndOpacity: "material-opacity",
  backgroundEndPosition: "material-lineEndCircle",
  border: "material-borderStyle",
  borderPreset: "material-borderStyle",
  borderStyle: "material-style",
  borderColor: "seldon-backgroundColor",
  borderWidth: "material-lineWeight",
  borderBrightness: "material-brightnessMedium",
  borderOpacity: "material-opacity",
  borderTop: "material-borderStyle",
  borderTopPreset: "material-borderStyle",
  borderTopStyle: "material-borderStyle",
  borderTopColor: "seldon-backgroundColor",
  borderTopWidth: "material-borderStyle",
  borderTopBrightness: "material-brightnessMedium",
  borderTopOpacity: "material-opacity",
  borderRight: "material-borderStyle",
  borderRightPreset: "material-borderStyle",
  borderRightStyle: "material-borderStyle",
  borderRightColor: "seldon-backgroundColor",
  borderRightWidth: "material-borderStyle",
  borderRightBrightness: "material-brightnessMedium",
  borderRightOpacity: "material-opacity",
  borderBottom: "material-borderStyle",
  borderBottomPreset: "material-borderStyle",
  borderBottomStyle: "material-borderStyle",
  borderBottomColor: "seldon-backgroundColor",
  borderBottomWidth: "material-borderStyle",
  borderBottomBrightness: "material-brightnessMedium",
  borderBottomOpacity: "material-opacity",
  borderLeft: "material-borderStyle",
  borderLeftPreset: "material-borderStyle",
  borderLeftStyle: "material-borderStyle",
  borderLeftColor: "seldon-backgroundColor",
  borderLeftWidth: "material-borderStyle",
  borderLeftBrightness: "material-brightnessMedium",
  borderLeftOpacity: "material-opacity",
  corners: "material-roundedCorner",

  // Typography
  font: "material-textFormat",
  fontPreset: "material-textFormat",
  fontFamily: "material-fontDownload",
  fontStyle: "material-style",
  fontWeight: "material-formatBold",
  fontSize: "material-formatSize",
  fontLineHeight: "material-formatLineSpacing",
  fontTextCase: "material-matchCase",
  fontLetterSpacing: "material-formatLetterSpacing",
  textAlign: "material-formatAlignLeft",
  textDecoration: "material-formatUnderlined",
  wrapText: "material-wrapText",
  lines: "seldon-lines",

  // Effects
  shadow: "seldon-shadow",
  shadowPreset: "seldon-shadow",
  shadowStyle: "material-style",
  shadowOffsetX: "material-width",
  shadowOffsetY: "material-height",
  shadowBlur: "material-blurOn",
  shadowSpread: "material-deblur",
  shadowColor: "seldon-backgroundColor",
  shadowBrightness: "material-brightnessMedium",
  shadowOpacity: "material-opacity",
  scroll: "material-mouse",

  // Accessibility
  role: "material-token",
  ariaDisabled: "material-radioButtonUnchecked",
  ariaExpanded: "material-radioButtonUnchecked",
  ariaSelected: "material-radioButtonUnchecked",
  ariaChecked: "material-radioButtonUnchecked",
  ariaPressed: "material-radioButtonUnchecked",
  ariaCurrent: "material-token",
  ariaHasPopup: "material-token",
  ariaInvalid: "material-token",
  ariaRequired: "material-radioButtonUnchecked",
  ariaReadonly: "material-radioButtonUnchecked",
  ariaLive: "material-token",
}

/**
 * Per-option icon overrides, keyed by catalog key then option value. Looked up
 * before {@link GLOBAL_OPTION_ICONS} and the property default.
 */
export const PROPERTY_OPTION_ICONS: Record<string, Record<string, string>> = {
  background: {
    color: "material-colors",
    image: "material-image",
    linearGradient: "material-gradient",
    radialGradient: "material-gradient",
    conicGradient: "material-gradient",
  },
  display: {
    show: "material-visibility",
    hide: "material-visibilityOff",
    exclude: "material-codeOff",
  },
  direction: {
    ltr: "material-formatTextdirectionLToR",
    rtl: "material-formatTextdirectionRToL",
  },
  orientation: {
    horizontal: "material-desktopLandscape",
    vertical: "material-desktopPortrait",
  },
  align: {
    "top-left": "seldon-positionTopLeft",
    "top-center": "seldon-positionTop",
    "top-right": "seldon-positionTopRight",
    left: "seldon-positionLeft",
    center: "seldon-positionCenter",
    right: "seldon-positionRight",
    "bottom-left": "seldon-positionBottomLeft",
    "bottom-center": "seldon-positionBottom",
    "bottom-right": "seldon-positionBottomRight",
  },
  backgroundPosition: {
    "top-left": "seldon-positionTopLeft",
    "top-center": "seldon-positionTop",
    "top-right": "seldon-positionTopRight",
    "center-left": "seldon-positionLeft",
    center: "seldon-positionCenter",
    "center-right": "seldon-positionRight",
    "bottom-left": "seldon-positionBottomLeft",
    "bottom-center": "seldon-positionBottom",
    "bottom-right": "seldon-positionBottomRight",
  },
  textAlign: {
    left: "material-formatAlignLeft",
    right: "material-formatAlignRight",
    center: "material-formatAlignCenter",
    justify: "material-formatAlignJustify",
  },
  cursor: {
    default: "material-mouse",
    "context-menu": "material-highlightMouseCursor",
    help: "material-help",
    pointer: "material-adsClick",
    progress: "material-mouse",
    wait: "material-mouse",
    cell: "material-gridOn",
    crosshair: "material-adsClick",
    text: "material-highlightTextCursor",
    "vertical-text": "material-highlightTextCursor",
    alias: "material-driveFileMoveOutline",
    copy: "material-contentCopy",
    move: "material-openWith",
    "no-drop": "material-doNotDisturbOn",
    "not-allowed": "material-block",
    grab: "material-panTool",
    grabbing: "material-panToolAlt",
    "all-scroll": "material-dragPan",
    "zoom-in": "material-zoomIn",
    "zoom-out": "material-zoomOut",
    "e-resize": "material-width",
    "w-resize": "material-width",
    "ew-resize": "material-width",
    "col-resize": "material-width",
    "n-resize": "material-height",
    "s-resize": "material-height",
    "ns-resize": "material-height",
    "row-resize": "material-height",
    "ne-resize": "material-resize",
    "nw-resize": "material-resize",
    "se-resize": "material-resize",
    "sw-resize": "material-resize",
    "nesw-resize": "material-resize",
    "nwse-resize": "material-resize",
  },
}

/**
 * Icons shared by an option value across every property. A per-property
 * override in {@link PROPERTY_OPTION_ICONS} still wins; this fills in before the
 * property default.
 */
export const GLOBAL_OPTION_ICONS: Record<string, string> = {
  none: "material-block",
  matchColor: "material-syncAlt",
  highContrastColor: "material-contrast",
  transparent: "material-circle",
}
