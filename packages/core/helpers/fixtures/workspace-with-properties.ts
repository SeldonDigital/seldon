import customTheme from "../../themes/custom"
import { Workspace } from "../../workspace/types"

/**
 * Workspace fixture for unit tests with complete property definitions.
 *
 * Contains a full workspace structure with detailed properties for each node,
 * including various value types (exact, preset, theme, computed, empty).
 * Not used in the application - demo content is in the Screen component.
 */
export const WORKSPACE_FIXTURE = {
  version: 13,
  customTheme,
  boards: {
    cardProduct: {
      label: "Product Cards",
      id: "cardProduct",
      theme: "default",
      variants: ["variant-cardProduct-default"],
      properties: {},
      order: 0,
    },
    buttonBar: {
      label: "Button Bars",
      id: "barButtons",
      theme: "default",
      variants: ["variant-buttonBar-default"],
      properties: {},
      order: 1,
    },
    textblockDetails: {
      label: "Textblock Details",
      id: "textblockDetails",
      theme: "default",
      variants: ["variant-textblockDetails-default"],
      properties: {},
      order: 2,
    },
    button: {
      label: "Buttons",
      id: "button",
      theme: "default",
      variants: ["variant-button-default"],
      properties: {},
      order: 3,
    },
    tagline: {
      label: "Taglines",
      id: "tagline",
      theme: "default",
      variants: ["variant-tagline-default"],
      properties: {},
      order: 4,
    },
    title: {
      label: "Titles",
      id: "title",
      theme: "default",
      variants: ["variant-title-default"],
      properties: {},
      order: 5,
    },
    description: {
      label: "Descriptions",
      id: "description",
      theme: "default",
      variants: ["variant-description-default"],
      properties: {},
      order: 6,
    },
    icon: {
      label: "Icons",
      id: "icon",
      theme: "default",
      variants: ["variant-icon-default"],
      properties: {},
      order: 7,
    },
    label: {
      label: "Labels",
      id: "label",
      theme: "default",
      variants: ["variant-label-default"],
      properties: {},
      order: 8,
    },
  },
  byId: {
    "variant-cardProduct-default": {
      id: "variant-cardProduct-default",
      type: "defaultVariant",
      label: "Product Card",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "part",
      component: "cardProduct",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        ariaLabel: {
          type: "empty",
          value: null,
        },
        ariaHidden: {
          type: "exact",
          value: false,
        },
        direction: {
          type: "empty",
          value: null,
        },
        orientation: {
          type: "preset",
          value: "vertical",
        },
        align: {
          type: "preset",
          value: "left",
        },
        width: {
          type: "preset",
          value: "fill",
        },
        height: {
          type: "preset",
          value: "fit",
        },
        margin: {
          top: {
            type: "empty",
            value: null,
          },
          right: {
            type: "empty",
            value: null,
          },
          bottom: {
            type: "empty",
            value: null,
          },
          left: {
            type: "empty",
            value: null,
          },
        },
        padding: {
          top: {
            type: "empty",
            value: null,
          },
          right: {
            type: "empty",
            value: null,
          },
          bottom: {
            type: "empty",
            value: null,
          },
          left: {
            type: "empty",
            value: null,
          },
        },
        gap: {
          type: "preset",
          value: "evenly-spaced",
        },
        rotation: {
          type: "empty",
          value: null,
        },
        wrapChildren: {
          type: "exact",
          value: false,
        },
        clip: {
          type: "empty",
          value: null,
        },
        opacity: {
          type: "empty",
          value: null,
        },
        background: {
          preset: {
            type: "theme.categorical",
            value: "@background.background1",
          },
          color: {
            type: "theme.categorical",
            value: "@swatch.white",
          },
          brightness: {
            type: "empty",
            value: null,
          },
          image: {
            type: "exact",
            value: "https://static.seldon.app/background-default-light.jpg",
          },
          size: {
            type: "empty",
            value: null,
          },
          position: {
            type: "empty",
            value: null,
          },
          repeat: {
            type: "empty",
            value: null,
          },
          opacity: {
            type: "empty",
            value: null,
          },
        },
        border: {
          preset: {
            type: "theme.categorical",
            value: "@border.hairline",
          },
          style: {
            type: "empty",
            value: null,
          },
          color: {
            type: "theme.categorical",
            value: "@swatch.primary",
          },
          width: {
            type: "empty",
            value: null,
          },
          opacity: {
            type: "empty",
            value: null,
          },
          brightness: {
            type: "empty",
            value: null,
          },
          topStyle: {
            type: "empty",
            value: null,
          },
          topColor: {
            type: "empty",
            value: null,
          },
          topWidth: {
            type: "empty",
            value: null,
          },
          topOpacity: {
            type: "empty",
            value: null,
          },
          topBrightness: {
            type: "empty",
            value: null,
          },
          rightStyle: {
            type: "empty",
            value: null,
          },
          rightColor: {
            type: "empty",
            value: null,
          },
          rightWidth: {
            type: "empty",
            value: null,
          },
          rightOpacity: {
            type: "empty",
            value: null,
          },
          rightBrightness: {
            type: "empty",
            value: null,
          },
          bottomStyle: {
            type: "empty",
            value: null,
          },
          bottomColor: {
            type: "empty",
            value: null,
          },
          bottomWidth: {
            type: "empty",
            value: null,
          },
          bottomOpacity: {
            type: "empty",
            value: null,
          },
          bottomBrightness: {
            type: "empty",
            value: null,
          },
          leftStyle: {
            type: "empty",
            value: null,
          },
          leftColor: {
            type: "empty",
            value: null,
          },
          leftWidth: {
            type: "empty",
            value: null,
          },
          leftOpacity: {
            type: "empty",
            value: null,
          },
          leftBrightness: {
            type: "empty",
            value: null,
          },
        },
        corners: {
          topLeft: {
            type: "theme.ordinal",
            value: "@corners.compact",
          },
          topRight: {
            type: "theme.ordinal",
            value: "@corners.compact",
          },
          bottomLeft: {
            type: "theme.ordinal",
            value: "@corners.compact",
          },
          bottomRight: {
            type: "theme.ordinal",
            value: "@corners.compact",
          },
        },
        gradient: {
          preset: {
            type: "empty",
            value: null,
          },
          angle: {
            type: "empty",
            value: null,
          },
          startColor: {
            type: "empty",
            value: null,
          },
          startOpacity: {
            type: "empty",
            value: null,
          },
          startBrightness: {
            type: "empty",
            value: null,
          },
          startPosition: {
            type: "empty",
            value: null,
          },
          endColor: {
            type: "empty",
            value: null,
          },
          endOpacity: {
            type: "empty",
            value: null,
          },
          endBrightness: {
            type: "empty",
            value: null,
          },
          endPosition: {
            type: "empty",
            value: null,
          },
        },
        shadow: {
          preset: {
            type: "empty",
            value: null,
          },
          offsetX: {
            type: "empty",
            value: null,
          },
          offsetY: {
            type: "empty",
            value: null,
          },
          color: {
            type: "empty",
            value: null,
          },
          blur: {
            type: "empty",
            value: null,
          },
          spread: {
            type: "empty",
            value: null,
          },
          opacity: {
            type: "empty",
            value: null,
          },
          brightness: {
            type: "empty",
            value: null,
          },
        },
      },
      children: ["child-textblockDetails-pv9tiJDS", "child-buttonBar-YwByDTnU"],
    },
    "child-textblockDetails-pv9tiJDS": {
      id: "child-textblockDetails-pv9tiJDS",
      label: "Textblock Details",
      isChild: true,
      fromSchema: true,
      level: "element",
      theme: null,
      variant: "variant-textblockDetails-default",
      instanceOf: "variant-textblockDetails-default",
      component: "textblockDetails",
      properties: {
        margin: {
          top: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
          right: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
          bottom: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
          left: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
        },
      },
      children: [
        "child-tagline-rNpC8RXH",
        "child-title-r76mbOnL",
        "child-description-lv9vOdyM",
      ],
    },
    "child-tagline-rNpC8RXH": {
      id: "child-tagline-rNpC8RXH",
      label: "Tagline",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-tagline-default",
      instanceOf: "child-tagline-tptC3MdT",
      component: "tagline",
      properties: {
        content: {
          type: "exact",
          value: "Tagline",
        },
      },
    },
    "child-title-r76mbOnL": {
      id: "child-title-r76mbOnL",
      label: "Title",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-title-default",
      instanceOf: "child-title-SAxMtXLz",
      component: "title",
      properties: {
        content: {
          type: "exact",
          value: "Product Card Title",
        },
        margin: {
          bottom: {
            type: "theme.ordinal",
            value: "@margin.compact",
          },
        },
        font: {
          preset: {
            type: "theme.categorical",
            value: "@font.heading",
          },
        },
      },
    },
    "child-description-lv9vOdyM": {
      id: "child-description-lv9vOdyM",
      label: "Description",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-description-default",
      instanceOf: "child-description-d4HzSFND",
      component: "description",
      properties: {
        content: {
          type: "exact",
          value:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus.",
        },
      },
    },
    "child-buttonBar-YwByDTnU": {
      id: "child-buttonBar-YwByDTnU",
      label: "Button Bar",
      isChild: true,
      fromSchema: true,
      level: "part",
      theme: null,
      variant: "variant-buttonBar-default",
      instanceOf: "variant-buttonBar-default",
      component: "barButtons",
      properties: {
        width: {
          type: "preset",
          value: "fit",
        },
        margin: {
          top: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
          right: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
          bottom: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
          left: {
            type: "theme.ordinal",
            value: "@margin.cozy",
          },
        },
      },
      children: [
        "child-button-4eo3qAPb",
        "child-button-ZvZ8kmVr",
        "child-button-KA1P5Y8h",
      ],
    },
    "child-button-4eo3qAPb": {
      id: "child-button-4eo3qAPb",
      label: "Button",
      isChild: true,
      fromSchema: true,
      level: "element",
      theme: null,
      variant: "variant-button-default",
      instanceOf: "child-button-5Q6oG09m",
      component: "button",
      properties: {
        background: {
          color: {
            type: "theme.categorical",
            value: "@swatch.swatch1",
          },
        },
      },
      children: ["child-icon-MAFDy9IN", "child-label-uhhihiiA"],
    },
    "child-icon-MAFDy9IN": {
      id: "child-icon-MAFDy9IN",
      label: "Icon",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "child-icon-Ifn75RTZ",
      component: "icon",
      properties: {
        symbol: {
          type: "preset",
          value: "material-add",
        },
        size: {
          type: "computed",
          value: {
            function: "auto_fit",
            input: {
              basedOn: "#parent.buttonSize",
              factor: 0.8,
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-label-uhhihiiA": {
      id: "child-label-uhhihiiA",
      label: "Label",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-label-default",
      instanceOf: "child-label-TOTJz1gq",
      component: "label",
      properties: {
        content: {
          type: "exact",
          value: "Add",
        },
        font: {
          size: {
            type: "computed",
            value: {
              function: "auto_fit",
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-button-ZvZ8kmVr": {
      id: "child-button-ZvZ8kmVr",
      label: "Button",
      isChild: true,
      fromSchema: true,
      level: "element",
      theme: null,
      variant: "variant-button-default",
      instanceOf: "child-button-7akAwbMf",
      component: "button",
      properties: {},
      children: ["child-icon-LHLzFHuF", "child-label-aqt5mR8N"],
    },
    "child-icon-LHLzFHuF": {
      id: "child-icon-LHLzFHuF",
      label: "Icon",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "child-icon-XuSaMtdV",
      component: "icon",
      properties: {
        symbol: {
          type: "preset",
          value: "material-remove",
        },
        size: {
          type: "computed",
          value: {
            function: "auto_fit",
            input: {
              basedOn: "#parent.buttonSize",
              factor: 0.8,
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-label-aqt5mR8N": {
      id: "child-label-aqt5mR8N",
      label: "Label",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-label-default",
      instanceOf: "child-label-0NJriRWt",
      component: "label",
      properties: {
        content: {
          type: "exact",
          value: "Remove",
        },
        font: {
          size: {
            type: "computed",
            value: {
              function: "auto_fit",
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-button-KA1P5Y8h": {
      id: "child-button-KA1P5Y8h",
      label: "Button",
      isChild: true,
      fromSchema: true,
      level: "element",
      theme: null,
      variant: "variant-button-default",
      instanceOf: "child-button-XNDxCwpi",
      component: "button",
      properties: {},
      children: ["child-icon-Qx8cVNZS", "child-label-OcDFgQwH"],
    },
    "child-icon-Qx8cVNZS": {
      id: "child-icon-Qx8cVNZS",
      label: "Icon",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "child-icon-6kuuKqZR",
      component: "icon",
      properties: {
        symbol: {
          type: "preset",
          value: "__default__",
        },
        size: {
          type: "computed",
          value: {
            function: "auto_fit",
            input: {
              basedOn: "#parent.buttonSize",
              factor: 0.8,
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-label-OcDFgQwH": {
      id: "child-label-OcDFgQwH",
      label: "Label",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-label-default",
      instanceOf: "child-label-33k1Xx0z",
      component: "label",
      properties: {
        content: {
          type: "exact",
          value: "Button",
        },
        font: {
          size: {
            type: "computed",
            value: {
              function: "auto_fit",
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "variant-buttonBar-default": {
      id: "variant-buttonBar-default",
      type: "defaultVariant",
      label: "Button Bar",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "part",
      component: "barButtons",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        direction: {
          type: "preset",
          value: "horizontal",
        },
        align: {
          type: "preset",
          value: "left",
        },
        gap: {
          type: "theme.ordinal",
          value: "@gap.comfortable",
        },
      },
      children: [
        "child-button-5Q6oG09m",
        "child-button-7akAwbMf",
        "child-button-XNDxCwpi",
      ],
    },
    "child-button-5Q6oG09m": {
      id: "child-button-5Q6oG09m",
      label: "Button",
      isChild: true,
      fromSchema: true,
      level: "element",
      theme: null,
      variant: "variant-button-default",
      instanceOf: "variant-button-default",
      component: "button",
      properties: {
        background: {
          color: {
            type: "theme.categorical",
            value: "@swatch.swatch1",
          },
        },
      },
      children: ["child-icon-Ifn75RTZ", "child-label-TOTJz1gq"],
    },
    "child-icon-Ifn75RTZ": {
      id: "child-icon-Ifn75RTZ",
      label: "Icon",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "child-icon-K3GlMKHA",
      component: "icon",
      properties: {
        symbol: {
          type: "preset",
          value: "material-add",
        },
        size: {
          type: "computed",
          value: {
            function: "auto_fit",
            input: {
              basedOn: "#parent.buttonSize",
              factor: 0.8,
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-label-TOTJz1gq": {
      id: "child-label-TOTJz1gq",
      label: "Label",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-label-default",
      instanceOf: "child-label-wCHRir3I",
      component: "label",
      properties: {
        content: {
          type: "exact",
          value: "Add",
        },
        font: {
          size: {
            type: "computed",
            value: {
              function: "auto_fit",
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-button-7akAwbMf": {
      id: "child-button-7akAwbMf",
      label: "Button",
      isChild: true,
      fromSchema: true,
      level: "element",
      theme: null,
      variant: "variant-button-default",
      instanceOf: "variant-button-default",
      component: "button",
      properties: {},
      children: ["child-icon-XuSaMtdV", "child-label-0NJriRWt"],
    },
    "child-icon-XuSaMtdV": {
      id: "child-icon-XuSaMtdV",
      label: "Icon",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "child-icon-K3GlMKHA",
      component: "icon",
      properties: {
        symbol: {
          type: "preset",
          value: "material-remove",
        },
        size: {
          type: "computed",
          value: {
            function: "auto_fit",
            input: {
              basedOn: "#parent.buttonSize",
              factor: 0.8,
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-label-0NJriRWt": {
      id: "child-label-0NJriRWt",
      label: "Label",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-label-default",
      instanceOf: "child-label-wCHRir3I",
      component: "label",
      properties: {
        content: {
          type: "exact",
          value: "Remove",
        },
        font: {
          size: {
            type: "computed",
            value: {
              function: "auto_fit",
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-button-XNDxCwpi": {
      id: "child-button-XNDxCwpi",
      label: "Button",
      isChild: true,
      fromSchema: true,
      level: "element",
      theme: null,
      variant: "variant-button-default",
      instanceOf: "variant-button-default",
      component: "button",
      properties: {},
      children: ["child-icon-6kuuKqZR", "child-label-33k1Xx0z"],
    },
    "child-icon-6kuuKqZR": {
      id: "child-icon-6kuuKqZR",
      label: "Icon",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "child-icon-K3GlMKHA",
      component: "icon",
      properties: {
        symbol: {
          type: "preset",
          value: "__default__",
        },
        size: {
          type: "computed",
          value: {
            function: "auto_fit",
            input: {
              basedOn: "#parent.buttonSize",
              factor: 0.8,
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-label-33k1Xx0z": {
      id: "child-label-33k1Xx0z",
      label: "Label",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-label-default",
      instanceOf: "child-label-wCHRir3I",
      component: "label",
      properties: {
        content: {
          type: "exact",
          value: "Button",
        },
        font: {
          size: {
            type: "computed",
            value: {
              function: "auto_fit",
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "variant-textblockDetails-default": {
      id: "variant-textblockDetails-default",
      type: "defaultVariant",
      label: "Textblock Details",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "element",
      component: "textblockDetails",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        direction: {
          type: "preset",
          value: "vertical",
        },
        align: {
          type: "preset",
          value: "left",
        },
        gap: {
          type: "theme.ordinal",
          value: "@gap.comfortable",
        },
      },
      children: [
        "child-tagline-tptC3MdT",
        "child-title-SAxMtXLz",
        "child-description-d4HzSFND",
      ],
    },
    "child-tagline-tptC3MdT": {
      id: "child-tagline-tptC3MdT",
      label: "Tagline",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-tagline-default",
      instanceOf: "variant-tagline-default",
      component: "tagline",
      properties: {
        content: {
          type: "exact",
          value: "Tagline",
        },
      },
    },
    "child-title-SAxMtXLz": {
      id: "child-title-SAxMtXLz",
      label: "Title",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-title-default",
      instanceOf: "variant-title-default",
      component: "title",
      properties: {
        content: {
          type: "exact",
          value: "Product Card Title",
        },
        margin: {
          bottom: {
            type: "theme.ordinal",
            value: "@margin.compact",
          },
        },
        font: {
          preset: {
            type: "theme.categorical",
            value: "@font.heading",
          },
        },
      },
    },
    "child-description-d4HzSFND": {
      id: "child-description-d4HzSFND",
      label: "Description",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-description-default",
      instanceOf: "variant-description-default",
      component: "description",
      properties: {
        content: {
          type: "exact",
          value:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus.",
        },
      },
    },
    "variant-button-default": {
      id: "variant-button-default",
      type: "defaultVariant",
      label: "Button",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "element",
      component: "button",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        buttonSize: {
          type: "theme.ordinal",
          value: "@fontSize.medium",
        },
        background: {
          color: {
            type: "theme.categorical",
            value: "@swatch.swatch1",
          },
        },
        border: {
          topColor: {
            type: "computed",
            value: {
              function: "match",
              input: {
                basedOn: "#background.color",
              },
            },
          },
          rightColor: {
            type: "computed",
            value: {
              function: "match",
              input: {
                basedOn: "#background.color",
              },
            },
          },
          bottomColor: {
            type: "computed",
            value: {
              function: "match",
              input: {
                basedOn: "#background.color",
              },
            },
          },
          leftColor: {
            type: "computed",
            value: {
              function: "match",
              input: {
                basedOn: "#background.color",
              },
            },
          },
        },
      },
      children: ["child-icon-K3GlMKHA", "child-label-wCHRir3I"],
    },
    "child-icon-K3GlMKHA": {
      id: "child-icon-K3GlMKHA",
      label: "Icon",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-icon-default",
      instanceOf: "variant-icon-default",
      component: "icon",
      properties: {
        symbol: {
          type: "preset",
          value: "__default__",
        },
        size: {
          type: "computed",
          value: {
            function: "auto_fit",
            input: {
              basedOn: "#parent.buttonSize",
              factor: 0.8,
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "child-label-wCHRir3I": {
      id: "child-label-wCHRir3I",
      label: "Label",
      isChild: true,
      fromSchema: true,
      level: "primitive",
      theme: null,
      variant: "variant-label-default",
      instanceOf: "variant-label-default",
      component: "label",
      properties: {
        content: {
          type: "exact",
          value: "Button",
        },
        font: {
          size: {
            type: "computed",
            value: {
              function: "auto_fit",
              input: {
                basedOn: "#parent.buttonSize",
                factor: 0.8,
              },
            },
          },
        },
        color: {
          type: "computed",
          value: {
            function: "high_contrast_color",
            input: {
              basedOn: "#parent.background.color",
            },
          },
        },
      },
    },
    "variant-tagline-default": {
      id: "variant-tagline-default",
      type: "defaultVariant",
      label: "Tagline",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "primitive",
      component: "tagline",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        content: {
          type: "exact",
          value: "Tagline",
        },
      },
    },
    "variant-title-default": {
      id: "variant-title-default",
      type: "defaultVariant",
      label: "Title",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "primitive",
      component: "title",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        content: {
          type: "exact",
          value: "Product Card Title",
        },
        margin: {
          bottom: {
            type: "theme.ordinal",
            value: "@margin.compact",
          },
        },
        font: {
          preset: {
            type: "theme.categorical",
            value: "@font.heading",
          },
        },
      },
    },
    "variant-description-default": {
      id: "variant-description-default",
      type: "defaultVariant",
      label: "Description",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "primitive",
      component: "description",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        content: {
          type: "exact",
          value:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus.",
        },
      },
    },
    "variant-icon-default": {
      id: "variant-icon-default",
      type: "defaultVariant",
      label: "Icon",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "primitive",
      component: "icon",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        symbol: {
          type: "preset",
          value: "__default__",
        },
        size: {
          type: "theme.ordinal",
          value: "@size.medium",
        },
      },
    },
    "variant-label-default": {
      id: "variant-label-default",
      type: "defaultVariant",
      label: "Label",
      isChild: false,
      fromSchema: true,
      theme: null,
      level: "primitive",
      component: "label",
      properties: {
        display: {
          type: "preset",
          value: "show",
        },
        content: {
          type: "exact",
          value: "Label",
        },
        htmlElement: {
          type: "preset",
          value: "span",
        },
        lines: {
          type: "exact",
          value: 1,
        },
        font: {
          size: {
            type: "theme.ordinal",
            value: "@fontSize.medium",
            restrictions: {
              allowedValues: [
                "@fontSize.small",
                "@fontSize.medium",
                "@fontSize.large",
              ],
            },
          },
        },
        textAlign: {
          type: "preset",
          value: "left",
        },
        wrapText: {
          type: "exact",
          value: true,
        },
      },
    },
  },
} as unknown as Workspace
