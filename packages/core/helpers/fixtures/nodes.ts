import { ComponentLevel } from "../../components/constants"
import { Orientation, Seldon, ValueType } from "../../index"
import { Instance, Variant } from "../../workspace/types"

/**
 * Individual node fixtures for unit tests.
 *
 * Contains reusable node definitions including variants and instances
 * with computed properties, theme references, and component relationships.
 * Not used in the application - for testing only.
 */
export const FRAME_VARIANT: Variant = {
  id: "variant-frame-default",
  type: "defaultVariant",
  label: "Default",
  component: Seldon.Constants.ComponentId.FRAME,
  level: ComponentLevel.ELEMENT,
  isChild: false,
  fromSchema: true,
  theme: null,
  properties: {
    orientation: {
      type: ValueType.PRESET,
      value: Orientation.HORIZONTAL,
    },
  },
  children: [],
}

export const LABEL_CHILD: Instance = {
  id: "child-label-wCHRir3I",
  label: "Label",
  component: Seldon.Constants.ComponentId.LABEL,
  isChild: true,
  fromSchema: true,
  level: ComponentLevel.PRIMITIVE,
  properties: {
    color: {
      type: ValueType.COMPUTED,
      value: {
        function: Seldon.Constants.ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    },
    font: {
      size: {
        type: ValueType.COMPUTED,
        value: {
          function: Seldon.Constants.ComputedFunction.AUTO_FIT,
          input: {
            basedOn: "#parent.buttonSize",
            factor: 0.8,
          },
        },
      },
    },
    content: {
      type: ValueType.EXACT,
      value: "Button",
    },
  },
  theme: null,
  variant: "variant-label-default",
  instanceOf: "variant-label-default",
}

export const ICON_CHILD: Instance = {
  id: "child-icon-K3GlMKHA",
  label: "Icon",
  component: Seldon.Constants.ComponentId.ICON,
  isChild: true,
  fromSchema: true,
  level: ComponentLevel.PRIMITIVE,
  properties: {
    symbol: {
      type: ValueType.PRESET,
      value: "__default__",
    },
    size: {
      type: ValueType.COMPUTED,
      value: {
        function: Seldon.Constants.ComputedFunction.AUTO_FIT,
        input: {
          basedOn: "#parent.buttonSize",
          factor: 0.8,
        },
      },
    },
    color: {
      type: ValueType.COMPUTED,
      value: {
        function: Seldon.Constants.ComputedFunction.HIGH_CONTRAST_COLOR,
        input: {
          basedOn: "#parent.background.color",
        },
      },
    },
  },
  theme: null,
  variant: "variant-icon-default",
  instanceOf: "variant-icon-default",
}

export const BUTTON_VARIANT: Variant = {
  id: "variant-button-default",
  type: "defaultVariant",
  label: "Button",
  children: ["child-icon-K3GlMKHA", "child-label-wCHRir3I"],
  component: Seldon.Constants.ComponentId.BUTTON,
  isChild: false,
  fromSchema: true,
  level: ComponentLevel.ELEMENT,
  properties: {
    width: {
      type: Seldon.Constants.ValueType.PRESET,
      value: Seldon.Constants.Resize.FIT,
    },
    height: {
      type: Seldon.Constants.ValueType.PRESET,
      value: Seldon.Constants.Resize.FIT,
    },
    background: {
      color: {
        type: Seldon.Constants.ValueType.THEME_CATEGORICAL,
        value: "@swatch.primary",
      },
    },
  },
  theme: null,
}
