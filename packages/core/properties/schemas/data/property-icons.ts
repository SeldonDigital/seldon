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
  ariaHidden: "seldon-radioOff",
  placeholder: "seldon-text",
  checked: "seldon-radioOff",
  inputType: "seldon-inputType",
  htmlElement: "material-codeXml",
  wrapperElement: "material-codeXml",
  symbol: "material-deployedCode",
  source: "seldon-image",
  imageFit: "seldon-imageFit",
  display: "material-visibility",
  size: "material-aspectRatio",
  buttonSize: "material-aspectRatio",
  boardPreset: "seldon-component",
  boardWidth: "seldon-width",
  boardHeight: "seldon-height",

  // Layout
  direction: "material-formatTextdirectionLToR",
  orientation: "material-desktopLandscape",
  align: "seldon-positionCenter",
  cellAlign: "seldon-align",
  position: "seldon-positionTopLeft",
  "position.top": "seldon-positionTop",
  "position.right": "seldon-positionRight",
  "position.bottom": "seldon-positionBottom",
  "position.left": "seldon-positionLeft",
  width: "seldon-width",
  height: "seldon-height",
  screenWidth: "seldon-width",
  screenHeight: "seldon-height",
  margin: "seldon-margin",
  padding: "seldon-padding",
  gap: "seldon-gap",
  rotation: "seldon-rotation",
  wrapChildren: "seldon-fontTextWrap",
  clip: "seldon-clip",
  cursor: "material-mouse",

  // Appearance
  color: "seldon-backgroundColor",
  accentColor: "seldon-backgroundColor",
  brightness: "seldon-brightness",
  opacity: "seldon-opacity",
  background: "material-colors",
  backgroundPreset: "seldon-gradient",
  backgroundColor: "seldon-backgroundColor",
  backgroundBrightness: "seldon-brightness",
  backgroundOpacity: "seldon-opacity",
  backgroundImage: "seldon-image",
  backgroundPosition: "seldon-positionCenter",
  backgroundSize: "material-aspectRatio",
  backgroundRepeat: "material-copyAll",
  backgroundBlendMode: "material-layers",
  backgroundFilter: "material-blurCircular",
  backgroundGradientType: "seldon-gradient",
  backgroundAngle: "seldon-rotation",
  backgroundStartColor: "seldon-backgroundColor",
  backgroundStartBrightness: "seldon-brightness",
  backgroundStartOpacity: "seldon-opacity",
  backgroundStartPosition: "material-lineStartCircle",
  backgroundEndColor: "seldon-backgroundColor",
  backgroundEndBrightness: "seldon-brightness",
  backgroundEndOpacity: "seldon-opacity",
  backgroundEndPosition: "material-lineEndCircle",
  border: "seldon-borderStyle",
  borderPreset: "seldon-borderStyle",
  borderStyle: "material-style",
  borderColor: "seldon-backgroundColor",
  borderWidth: "material-lineWeight",
  borderBrightness: "seldon-brightness",
  borderOpacity: "seldon-opacity",
  borderTop: "seldon-borderStyle",
  borderTopPreset: "seldon-borderStyle",
  borderTopStyle: "seldon-borderStyle",
  borderTopColor: "seldon-backgroundColor",
  borderTopWidth: "seldon-borderStyle",
  borderTopBrightness: "seldon-brightness",
  borderTopOpacity: "seldon-opacity",
  borderRight: "seldon-borderStyle",
  borderRightPreset: "seldon-borderStyle",
  borderRightStyle: "seldon-borderStyle",
  borderRightColor: "seldon-backgroundColor",
  borderRightWidth: "seldon-borderStyle",
  borderRightBrightness: "seldon-brightness",
  borderRightOpacity: "seldon-opacity",
  borderBottom: "seldon-borderStyle",
  borderBottomPreset: "seldon-borderStyle",
  borderBottomStyle: "seldon-borderStyle",
  borderBottomColor: "seldon-backgroundColor",
  borderBottomWidth: "seldon-borderStyle",
  borderBottomBrightness: "seldon-brightness",
  borderBottomOpacity: "seldon-opacity",
  borderLeft: "seldon-borderStyle",
  borderLeftPreset: "seldon-borderStyle",
  borderLeftStyle: "seldon-borderStyle",
  borderLeftColor: "seldon-backgroundColor",
  borderLeftWidth: "seldon-borderStyle",
  borderLeftBrightness: "seldon-brightness",
  borderLeftOpacity: "seldon-opacity",
  corners: "material-roundedCorner",

  // Typography
  font: "seldon-font",
  fontPreset: "seldon-font",
  fontFamily: "seldon-fontFamily",
  fontStyle: "material-style",
  fontWeight: "seldon-fontWeight",
  fontSize: "seldon-fontSize",
  fontLineHeight: "seldon-fontLineHeight",
  fontTextCase: "material-matchCase",
  fontLetterSpacing: "seldon-fontLetterSpacing",
  textAlign: "seldon-textAlign",
  textDecoration: "seldon-fontTextDecoration",
  wrapText: "seldon-fontTextWrap",
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
  shadowBrightness: "seldon-brightness",
  shadowOpacity: "seldon-opacity",
  scroll: "material-mouse",

  // Accessibility
  role: "seldon-token",
  ariaDisabled: "seldon-radioOff",
  ariaExpanded: "seldon-radioOff",
  ariaSelected: "seldon-radioOff",
  ariaChecked: "seldon-radioOff",
  ariaPressed: "seldon-radioOff",
  ariaCurrent: "seldon-token",
  ariaHasPopup: "seldon-token",
  ariaInvalid: "seldon-token",
  ariaRequired: "seldon-radioOff",
  ariaReadonly: "seldon-radioOff",
  ariaLive: "seldon-token",
}

/**
 * Per-option icon overrides, keyed by catalog key then option value. Looked up
 * before {@link GLOBAL_OPTION_ICONS} and the property default.
 */
export const PROPERTY_OPTION_ICONS: Record<string, Record<string, string>> = {
  background: {
    color: "material-colors",
    image: "material-image",
    gradient: "material-gradient",
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
