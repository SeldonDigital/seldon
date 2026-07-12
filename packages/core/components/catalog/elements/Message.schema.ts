import * as Sdn from "../../../properties";
import * as Seldon from "../../constants";
import { ComponentExport, ComponentSchema } from "../../types";





export const schema = {
  name: "Message",
  id: Seldon.ComponentId.MESSAGE,
  intent:
    "Transcript message block for an AI chat. Renders one turn piece: a plain text block, a user or assistant message, reasoning, tool activity, an outcome summary, an error, or a status line.",
  tags: ["message", "chat", "transcript", "ai", "element", "text", "bubble"],
  level: Seldon.ComponentLevel.ELEMENT,
  icon: Seldon.ComponentIcon.TEXT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    cursor: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Cursor.DEFAULT,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER_LEFT,
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FILL,
    },
    height: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
    },
    margin: {
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    padding: {
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.compact" },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.compact",
    },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: { type: Sdn.ValueType.EXACT, value: false },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      { kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.NONE } },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.hairline",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.OPTION, value: Sdn.Color.TRANSPARENT },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderTop: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderRight: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderBottom: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    borderLeft: {
      preset: { type: Sdn.ValueType.EMPTY, value: null },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
      width: { type: Sdn.ValueType.EMPTY, value: null },
      brightness: { type: Sdn.ValueType.EMPTY, value: null },
      opacity: { type: Sdn.ValueType.EMPTY, value: null },
    },
    corners: {
      topLeft: { type: Sdn.ValueType.THEME_ORDINAL, value: "@corners.compact" },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.none",
        },
        style: { type: Sdn.ValueType.EMPTY, value: null },
        offsetX: { type: Sdn.ValueType.EMPTY, value: null },
        offsetY: { type: Sdn.ValueType.EMPTY, value: null },
        blur: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
        spread: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
    scroll: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.TEXT,
        variant: "description",
        overrides: {
          content: {
            type: Sdn.ValueType.EXACT,
            value: "Empty message",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Resize.FILL,
          },
          color: {
            type: Sdn.ValueType.COMPUTED,
            value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
          },
          font: {
            preset: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@font.body",
            },
            size: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.small",
            },
          },
        },
      },
    ],
  },
  variants: [
    {
      id: "user",
      label: "User",
      intent: "The user's prompt, shown as a compact right-aligned bubble.",
      overrides: {
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_RIGHT,
        },
        width: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Resize.FILL,
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.offWhite",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "User message",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.body",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.small",
              },
            },
          },
        },
      ],
    },
    {
      id: "assistant",
      label: "Assistant",
      intent:
        "An AI reply. Its content is markdown, rendered by the editor markdown view at wire time.",
      overrides: {
        corners: {
          topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
          topRight: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.ROUNDED },
          bottomLeft: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Corner.ROUNDED,
          },
          bottomRight: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Corner.ROUNDED,
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Assistant message",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.body",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.small",
              },
            },
          },
        },
      ],
    },
    {
      id: "thinking",
      label: "Thinking",
      intent:
        "Collapsible reasoning disclosure with a summary header and a markdown body.",
      overrides: {
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.offWhite",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
        borderLeft: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
          style: { type: Sdn.ValueType.OPTION, value: Sdn.BorderStyle.SOLID },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.primary",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          brightness: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
        corners: {
          topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
          bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.tight",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Thinking...",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.label",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-chevronDown",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Reasoning...",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.body",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.xsmall",
              },
            },
          },
        },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      intent: "A vertical list of tool calls, each a status icon with a label.",
      overrides: {
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.tight",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-checkCircle",
                },
                size: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.AUTO_FIT,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "set_properties(target, ...)",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.body",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.tight",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "seldon-componentDefault",
                },
                size: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.AUTO_FIT,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "find_nodes(query)",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.body",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "outcome",
      label: "Outcome",
      intent:
        "A summary card of the applied changes: a status header and one row per change.",
      overrides: {
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.compact",
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.offWhite",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
        border: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
          style: { type: Sdn.ValueType.OPTION, value: Sdn.BorderStyle.SOLID },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.offBlack",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          brightness: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: {
            type: Sdn.ValueType.EXACT,
            value: { unit: Sdn.Unit.PERCENT, value: 30 },
          },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.tight",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-checkCircle",
                },
                size: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.AUTO_FIT,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Applied",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.label",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "description",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Button background: primary -> accent",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.body",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.xsmall",
              },
            },
          },
        },
      ],
    },
    {
      id: "error",
      label: "Error",
      intent:
        "A failure callout with an alert icon, a message, and a retry button.",
      overrides: {
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.cozy",
        },
        background: [
          {
            kind: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BackgroundKind.COLOR,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.offWhite",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        ],
        borderLeft: {
          preset: { type: Sdn.ValueType.EMPTY, value: null },
          style: { type: Sdn.ValueType.OPTION, value: Sdn.BorderStyle.SOLID },
          color: {
            type: Sdn.ValueType.THEME_CATEGORICAL,
            value: "@swatch.negative",
          },
          width: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.BorderWidth.HAIRLINE,
          },
          brightness: { type: Sdn.ValueType.EMPTY, value: null },
          opacity: { type: Sdn.ValueType.EMPTY, value: null },
        },
        corners:{
          topLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
          bottomLeft: { type: Sdn.ValueType.OPTION, value: Sdn.Corner.SQUARED },
        },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.tight",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.ICON,
              overrides: {
                symbol: {
                  type: Sdn.ValueType.OPTION,
                  value: "material-error",
                },
                size: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.AUTO_FIT,
                },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.negative",
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Something went wrong",
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                color: {
                  type: Sdn.ValueType.COMPUTED,
                  value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
                },
                font: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@font.body",
                  },
                  size: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.xsmall",
                  },
                },
              },
            },
          ],
        },
        {
          component: Seldon.ComponentId.BUTTON,
          variant: "label",
          overrides: {
            buttonSize: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@fontSize.xsmall",
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: {
                  type: Sdn.ValueType.EXACT,
                  value: "Retry",
                },
              },
            },
          ],
        },
      ],
    },
    {
      id: "status",
      label: "Status",
      intent: "An inline running indicator with a spinner and a phase label.",
      overrides: {
        orientation: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Orientation.HORIZONTAL,
        },
        align: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Align.CENTER_LEFT,
        },
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.tight",
        },
      },
      children: [
        {
          component: Seldon.ComponentId.ICON,
          overrides: {
            symbol: {
              type: Sdn.ValueType.OPTION,
              value: "material-robot",
            },
            size: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.AUTO_FIT,
            },
            color: {
              type: Sdn.ValueType.COMPUTED,
              value: Sdn.ComputedFunction.HIGH_CONTRAST_COLOR,
            },
          },
        },
        {
          component: Seldon.ComponentId.TEXT,
          variant: "label",
          overrides: {
            content: {
              type: Sdn.ValueType.EXACT,
              value: "Working...",
            },
            width: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Resize.FILL,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.gray",
            },
            font: {
              preset: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@font.label",
              },
              size: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.xsmall",
              },
            },
          },
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}