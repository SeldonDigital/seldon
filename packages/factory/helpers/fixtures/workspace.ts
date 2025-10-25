import { Workspace } from "@seldon/core"
import { ComputedFunction, Unit, ValueType } from "@seldon/core"
import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"
import customTheme from "@seldon/core/themes/custom"
import testTheme from "@seldon/core/themes/test/test-theme"

/**
 * Shared workspace fixture for factory tests
 * Provides a realistic workspace with multiple components and variants
 */
export const FACTORY_WORKSPACE_FIXTURE: Workspace = {
  version: 1,
  customTheme,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      component: ComponentId.BUTTON,
      label: "Buttons",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default", "variant-button-primary"],
    },
    [ComponentId.ICON]: {
      id: ComponentId.ICON,
      component: ComponentId.ICON,
      label: "Icons",
      order: 1,
      theme: "default",
      properties: {},
      variants: ["variant-icon-default"],
    },
    [ComponentId.LABEL]: {
      id: ComponentId.LABEL,
      component: ComponentId.LABEL,
      label: "Labels",
      order: 2,
      theme: "default",
      properties: {},
      variants: ["variant-label-default"],
    },
    [ComponentId.BAR_BUTTONS]: {
      id: ComponentId.BAR_BUTTONS,
      component: ComponentId.BAR_BUTTONS,
      label: "Button Bars",
      order: 3,
      theme: "default",
      properties: {},
      variants: ["variant-barButtons-default"],
    },
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      type: "defaultVariant",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
        padding: {
          top: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 12 } },
          bottom: {
            type: ValueType.EXACT,
            value: { unit: Unit.PX, value: 12 },
          },
          left: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 24 } },
          right: { type: ValueType.EXACT, value: { unit: Unit.PX, value: 24 } },
        },
      },
      children: ["child-label-1", "child-icon-1"],
    },
    "variant-button-primary": {
      id: "variant-button-primary",
      type: "userVariant",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Primary Button",
      isChild: false,
      fromSchema: false,
      instanceOf: "variant-button-default",
      theme: null,
      properties: {
        background: {
          color: {
            type: ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
        },
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
      },
      children: ["child-label-2", "child-icon-2"],
    },
    "variant-icon-default": {
      id: "variant-icon-default",
      type: "defaultVariant",
      component: ComponentId.ICON,
      level: ComponentLevel.PRIMITIVE,
      label: "Icon",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {
        size: {
          type: ValueType.EXACT,
          value: { unit: Unit.PX, value: 24 },
        },
        symbol: {
          type: ValueType.PRESET,
          value: "material-add",
        },
      },
      children: [],
    },
    "variant-label-default": {
      id: "variant-label-default",
      type: "defaultVariant",
      component: ComponentId.LABEL,
      level: ComponentLevel.PRIMITIVE,
      label: "Label",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {
        content: {
          type: ValueType.EXACT,
          value: "Button",
        },
        font: {
          size: {
            type: ValueType.THEME_ORDINAL,
            value: "@fontSize.medium",
          },
        },
      },
      children: [],
    },
    "variant-barButtons-default": {
      id: "variant-barButtons-default",
      type: "defaultVariant",
      component: ComponentId.BAR_BUTTONS,
      level: ComponentLevel.PART,
      label: "Button Bar",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {
        gap: {
          type: ValueType.THEME_ORDINAL,
          value: "@gap.comfortable",
        },
      },
      children: ["child-button-1", "child-button-2", "child-button-3"],
    },
    // Child instances
    "child-label-1": {
      id: "child-label-1",
      component: ComponentId.LABEL,
      level: ComponentLevel.PRIMITIVE,
      label: "Label",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-label-default",
      instanceOf: "variant-label-default",
      properties: {},
      children: [],
    },
    "child-label-2": {
      id: "child-label-2",
      component: ComponentId.LABEL,
      level: ComponentLevel.PRIMITIVE,
      label: "Label",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-label-default",
      instanceOf: "variant-label-default",
      properties: {
        content: {
          type: ValueType.EXACT,
          value: "Primary",
        },
      },
      children: [],
    },
    "child-icon-1": {
      id: "child-icon-1",
      component: ComponentId.ICON,
      level: ComponentLevel.PRIMITIVE,
      label: "Icon",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {},
      children: [],
    },
    "child-icon-2": {
      id: "child-icon-2",
      component: ComponentId.ICON,
      level: ComponentLevel.PRIMITIVE,
      label: "Icon",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {
        symbol: {
          type: ValueType.PRESET,
          value: "material-check",
        },
      },
      children: [],
    },
    "child-button-1": {
      id: "child-button-1",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button 1",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-button-default",
      instanceOf: "variant-button-default",
      properties: {},
      children: ["child-label-3", "child-icon-3"],
    },
    "child-button-2": {
      id: "child-button-2",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button 2",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-button-default",
      instanceOf: "variant-button-default",
      properties: {},
      children: ["child-label-4", "child-icon-4"],
    },
    "child-button-3": {
      id: "child-button-3",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button 3",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-button-default",
      instanceOf: "variant-button-default",
      properties: {},
      children: ["child-label-5", "child-icon-5"],
    },
    "child-label-3": {
      id: "child-label-3",
      component: ComponentId.LABEL,
      level: ComponentLevel.PRIMITIVE,
      label: "Label",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-label-default",
      instanceOf: "variant-label-default",
      properties: {
        content: {
          type: ValueType.EXACT,
          value: "Save",
        },
      },
      children: [],
    },
    "child-label-4": {
      id: "child-label-4",
      component: ComponentId.LABEL,
      level: ComponentLevel.PRIMITIVE,
      label: "Label",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-label-default",
      instanceOf: "variant-label-default",
      properties: {
        content: {
          type: ValueType.EXACT,
          value: "Cancel",
        },
      },
      children: [],
    },
    "child-label-5": {
      id: "child-label-5",
      component: ComponentId.LABEL,
      level: ComponentLevel.PRIMITIVE,
      label: "Label",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-label-default",
      instanceOf: "variant-label-default",
      properties: {
        content: {
          type: ValueType.EXACT,
          value: "Delete",
        },
      },
      children: [],
    },
    "child-icon-3": {
      id: "child-icon-3",
      component: ComponentId.ICON,
      level: ComponentLevel.PRIMITIVE,
      label: "Icon",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {
        symbol: {
          type: ValueType.PRESET,
          value: "material-save",
        },
      },
      children: [],
    },
    "child-icon-4": {
      id: "child-icon-4",
      component: ComponentId.ICON,
      level: ComponentLevel.PRIMITIVE,
      label: "Icon",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {
        symbol: {
          type: ValueType.PRESET,
          value: "material-close",
        },
      },
      children: [],
    },
    "child-icon-5": {
      id: "child-icon-5",
      component: ComponentId.ICON,
      level: ComponentLevel.PRIMITIVE,
      label: "Icon",
      isChild: true,
      fromSchema: true,
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      properties: {
        symbol: {
          type: ValueType.PRESET,
          value: "material-delete",
        },
      },
      children: [],
    },
  },
}

/**
 * Simple workspace fixture for basic tests
 */
export const SIMPLE_WORKSPACE_FIXTURE: Workspace = {
  version: 1,
  customTheme,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      component: ComponentId.BUTTON,
      label: "Buttons",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default"],
    },
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      type: "defaultVariant",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {
        color: {
          type: ValueType.THEME_CATEGORICAL,
          value: "@swatch.primary",
        },
      },
      children: [],
    },
  },
}

/**
 * Workspace fixture with computed properties for testing computation
 */
export const COMPUTED_WORKSPACE_FIXTURE: Workspace = {
  version: 1,
  customTheme: testTheme,
  boards: {
    [ComponentId.BUTTON]: {
      id: ComponentId.BUTTON,
      component: ComponentId.BUTTON,
      label: "Buttons",
      order: 0,
      theme: "default",
      properties: {},
      variants: ["variant-button-default"],
    },
  },
  byId: {
    "variant-button-default": {
      id: "variant-button-default",
      type: "defaultVariant",
      component: ComponentId.BUTTON,
      level: ComponentLevel.ELEMENT,
      label: "Button",
      isChild: false,
      fromSchema: true,
      theme: null,
      properties: {
        font: {
          size: {
            type: ValueType.EXACT,
            value: { unit: Unit.REM, value: 1.5 },
          },
        },
        size: {
          type: ValueType.COMPUTED,
          value: {
            function: ComputedFunction.AUTO_FIT,
            input: {
              basedOn: "#font.size",
              factor: 2.5,
            },
          },
        },
      },
      children: [],
    },
  },
}

/**
 * Empty workspace fixture for edge case testing
 */
export const EMPTY_WORKSPACE_FIXTURE: Workspace = {
  version: 1,
  customTheme,
  boards: {},
  byId: {},
}

/**
 * Export options fixture for consistent testing
 */
export const EXPORT_OPTIONS_FIXTURE = {
  rootDirectory: "/test",
  target: { framework: "react" as const, styles: "css-properties" as const },
  output: {
    componentsFolder: "/src/components",
    assetsFolder: "/public/assets",
    assetPublicPath: "/assets",
  },
}

/**
 * Node ID to class mapping fixture
 */
export const NODE_ID_TO_CLASS_FIXTURE = {
  "variant-button-default": "sdn-button",
  "variant-button-primary": "sdn-button-primary",
  "variant-icon-default": "sdn-icon",
  "variant-label-default": "sdn-label",
  "variant-barButtons-default": "sdn-bar-buttons",
  "child-label-1": "sdn-label",
  "child-label-2": "sdn-label",
  "child-icon-1": "sdn-icon",
  "child-icon-2": "sdn-icon",
  "child-button-1": "sdn-button",
  "child-button-2": "sdn-button",
  "child-button-3": "sdn-button",
  "child-label-3": "sdn-label",
  "child-label-4": "sdn-label",
  "child-label-5": "sdn-label",
  "child-icon-3": "sdn-icon",
  "child-icon-4": "sdn-icon",
  "child-icon-5": "sdn-icon",
}
