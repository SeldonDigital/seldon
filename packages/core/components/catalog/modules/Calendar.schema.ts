import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Calendar",
  id: Seldon.ComponentId.CALENDAR,
  intent:
    "Month calendar with a navigable header, weekday labels, and a day grid. The default shows a single bordered month; variants cover a two-month range picker and a single month with event markers.",
  tags: [
    "calendar",
    "ui",
    "month",
    "date",
    "navigation",
    "selection",
    "range",
    "events",
  ],
  level: Seldon.ComponentLevel.MODULE,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.CENTER,
    },
    width: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Resize.FIT,
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
      top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.comfortable" },
      right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.comfortable" },
      bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.comfortable" },
      left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.comfortable" },
    },
    gap: {
      type: Sdn.ValueType.THEME_ORDINAL,
      value: "@gap.comfortable",
    },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    color: { type: Sdn.ValueType.EMPTY, value: null },
    brightness: { type: Sdn.ValueType.EMPTY, value: null },
    opacity: { type: Sdn.ValueType.EMPTY, value: null },
    background: [
      {
        kind: { type: Sdn.ValueType.OPTION, value: Sdn.BackgroundKind.COLOR },
        color: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@swatch.white",
        },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: {
          type: Sdn.ValueType.EXACT,
          value: { unit: Sdn.Unit.PERCENT, value: 100 },
        },
      },
    ],
    border: {
      preset: {
        type: Sdn.ValueType.THEME_CATEGORICAL,
        value: "@border.hairline",
      },
      style: { type: Sdn.ValueType.EMPTY, value: null },
      color: { type: Sdn.ValueType.EMPTY, value: null },
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
      topLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.compact",
      },
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
        offsetX: { type: Sdn.ValueType.EMPTY, value: null },
        offsetY: { type: Sdn.ValueType.EMPTY, value: null },
        blur: { type: Sdn.ValueType.EMPTY, value: null },
        color: { type: Sdn.ValueType.EMPTY, value: null },
        brightness: { type: Sdn.ValueType.EMPTY, value: null },
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
        spread: { type: Sdn.ValueType.EMPTY, value: null },
      },
    ],
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
        },
        children: [
          {
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
            overrides: {
              buttonSize: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.medium",
              },
              background: [
                {
                  kind: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.BackgroundKind.NONE,
                  },
                },
              ],
              border: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@border.none",
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-chevronDoubleLeft",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
            overrides: {
              buttonSize: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.medium",
              },
              background: [
                {
                  kind: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.BackgroundKind.NONE,
                  },
                },
              ],
              border: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@border.none",
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-chevronLeft",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "title",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "August 2025" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
              },
              wrapText: {
                type: Sdn.ValueType.EXACT,
                value: false,
              },
              lines: {
                type: Sdn.ValueType.EXACT,
                value: 0,
              },
            },
          },
          {
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
            overrides: {
              buttonSize: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.medium",
              },
              background: [
                {
                  kind: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.BackgroundKind.NONE,
                  },
                },
              ],
              border: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@border.none",
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-chevronRight",
                  },
                },
              },
            ],
          },
          {
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
            overrides: {
              buttonSize: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.medium",
              },
              background: [
                {
                  kind: {
                    type: Sdn.ValueType.OPTION,
                    value: Sdn.BackgroundKind.NONE,
                  },
                },
              ],
              border: {
                preset: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@border.none",
                },
              },
            },
            children: [
              {
                component: Seldon.ComponentId.ICON,
                overrides: {
                  symbol: {
                    type: Sdn.ValueType.OPTION,
                    value: "material-chevronDoubleRight",
                  },
                },
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.CONTAINER,
        overrides: {
          columns: {
            type: Sdn.ValueType.EXACT,
            value: { unit: Sdn.Unit.NUMBER, value: 7 },
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.NONE },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Su" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Mo" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Tu" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "We" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Th" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Fr" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
              },
            },
          },
          {
            component: Seldon.ComponentId.TEXT,
            variant: "label",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Sa" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              textAlign: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.TextAlign.CENTER,
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
            value: Sdn.Orientation.VERTICAL,
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          padding: {
            top: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
            right: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
            bottom: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
            left: { type: Sdn.ValueType.THEME_ORDINAL, value: "@padding.tight" },
          },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
          background: [
            {
              kind: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BackgroundKind.COLOR,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.primary",
              },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: { type: Sdn.ValueType.EXACT, value: { unit: Sdn.Unit.PERCENT, value: 10 } },
            },
          ],
        },
        children: [
          {
            component: Seldon.ComponentId.CONTAINER,
            overrides: {
              columns: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.NUMBER, value: 7 },
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                overrides: {
                  columnSpan: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.NUMBER, value: 5 },
                  },
                },
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "1" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "2" },
                    },
                  },
                ],
              },
            ],
          },
          {
            component: Seldon.ComponentId.CONTAINER,
            overrides: {
              columns: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.NUMBER, value: 7 },
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "3" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "4" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "5" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "6" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "7" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "8" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "9" },
                    },
                  },
                ],
              },
            ],
          },
          {
            component: Seldon.ComponentId.CONTAINER,
            overrides: {
              columns: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.NUMBER, value: 7 },
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "10" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "11" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "12" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "13" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "14" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "15" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "16" },
                    },
                  },
                ],
              },
            ],
          },
          {
            component: Seldon.ComponentId.CONTAINER,
            overrides: {
              columns: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.NUMBER, value: 7 },
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "17" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "today",
                overrides: {
                  width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                },
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "18" },
                      color: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@swatch.primary",
                      },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "19" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "selected",
                overrides: {
                  width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                  corners: {
                    topLeft: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Corner.ROUNDED,
                    },
                    topRight: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Corner.ROUNDED,
                    },
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
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "20" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "21" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "22" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "23" },
                    },
                  },
                ],
              },
            ],
          },
          {
            component: Seldon.ComponentId.CONTAINER,
            overrides: {
              columns: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.NUMBER, value: 7 },
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "24" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "25" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "26" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "27" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "28" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "29" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "30" },
                    },
                  },
                ],
              },
            ],
          },
          {
            component: Seldon.ComponentId.CONTAINER,
            overrides: {
              columns: {
                type: Sdn.ValueType.EXACT,
                value: { unit: Sdn.Unit.NUMBER, value: 7 },
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                variant: "cell",
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "31" },
                    },
                  },
                ],
              },
              {
                component: Seldon.ComponentId.CALENDAR_DAY,
                overrides: {
                  columnSpan: {
                    type: Sdn.ValueType.EXACT,
                    value: { unit: Sdn.Unit.NUMBER, value: 6 },
                  },
                },
                children: [
                  {
                    component: Seldon.ComponentId.TEXT,
                    variant: "label",
                    overrides: {
                      content: { type: Sdn.ValueType.EXACT, value: "" },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "range",
      label: "Range",
      intent:
        "Two months shown side by side for picking a start and end date, with the days between them filled.",
      overrides: {
        orientation: {
          type: Sdn.ValueType.OPTION,
          value: Sdn.Orientation.HORIZONTAL,
        },
        align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.TOP_LEFT },
        gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.open" },
      },
      children: [
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.comfortable",
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
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.BUTTON,
                  variant: "iconic",
                  overrides: {
                    buttonSize: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    background: [
                      {
                        kind: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.BackgroundKind.NONE,
                        },
                      },
                    ],
                    border: {
                      preset: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@border.none",
                      },
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.ICON,
                      overrides: {
                        symbol: {
                          type: Sdn.ValueType.OPTION,
                          value: "material-chevronLeft",
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "title",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "October 2020",
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
              ],
            },
            {
              component: Seldon.ComponentId.CONTAINER,
              overrides: {
                columns: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.NUMBER, value: 7 },
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                gap: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Gap.NONE,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Mo" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Tu" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "We" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Th" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Fr" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Sa" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Su" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
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
                  value: Sdn.Orientation.VERTICAL,
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      overrides: {
                        columnSpan: {
                          type: Sdn.ValueType.EXACT,
                          value: { unit: Sdn.Unit.NUMBER, value: 3 },
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "1" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "2" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "3" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "4" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "5" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "6" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "7" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "8" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "muted",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "9" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "10" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "11" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "12" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "13" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "14" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "15" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "selected",
                      overrides: {
                        background: [
                          {
                            kind: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.BackgroundKind.COLOR,
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.primary",
                            },
                            brightness: {
                              type: Sdn.ValueType.EMPTY,
                              value: null,
                            },
                            opacity: {
                              type: Sdn.ValueType.EXACT,
                              value: { unit: Sdn.Unit.PERCENT, value: 100 },
                            },
                          },
                        ],
                        corners: {
                          topLeft: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.ROUNDED,
                          },
                          topRight: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
                          },
                          bottomLeft: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.ROUNDED,
                          },
                          bottomRight: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
                          },
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "16" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      overrides: {
                        corners: {
                          topLeft: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
                          },
                          topRight: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
                          },
                          bottomLeft: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
                          },
                          bottomRight: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
                          },
                        },
                        background: [
                          {
                            kind: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.BackgroundKind.COLOR,
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.primary",
                            },
                            brightness: {
                              type: Sdn.ValueType.EXACT,
                              value: { unit: Sdn.Unit.PERCENT, value: 0 },
                            },
                            opacity: {
                              type: Sdn.ValueType.EXACT,
                              value: { unit: Sdn.Unit.PERCENT, value: 25 },
                            },
                          },
                        ],
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "17" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      variant: "selected",
                      overrides: {
                        background: [
                          {
                            kind: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.BackgroundKind.COLOR,
                            },
                            color: {
                              type: Sdn.ValueType.THEME_CATEGORICAL,
                              value: "@swatch.primary",
                            },
                            brightness: {
                              type: Sdn.ValueType.EMPTY,
                              value: null,
                            },
                            opacity: {
                              type: Sdn.ValueType.EXACT,
                              value: { unit: Sdn.Unit.PERCENT, value: 100 },
                            },
                          },
                        ],
                        corners: {
                          topLeft: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
                          },
                          topRight: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.ROUNDED,
                          },
                          bottomLeft: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Corner.SQUARED,
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
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "18" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "19" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "20" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "21" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "22" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "23" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "24" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "25" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "26" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "27" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "28" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "29" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "30" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "31" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "" },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          component: Seldon.ComponentId.FRAME,
          overrides: {
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.VERTICAL,
            },
            gap: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@gap.comfortable",
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
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "title",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "November 2020",
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.BUTTON,
                  variant: "iconic",
                  overrides: {
                    buttonSize: {
                      type: Sdn.ValueType.THEME_ORDINAL,
                      value: "@fontSize.medium",
                    },
                    background: [
                      {
                        kind: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.BackgroundKind.NONE,
                        },
                      },
                    ],
                    border: {
                      preset: {
                        type: Sdn.ValueType.THEME_CATEGORICAL,
                        value: "@border.none",
                      },
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.ICON,
                      overrides: {
                        symbol: {
                          type: Sdn.ValueType.OPTION,
                          value: "material-chevronRight",
                        },
                      },
                    },
                  ],
                },
              ],
            },
            {
              component: Seldon.ComponentId.CONTAINER,
              overrides: {
                columns: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.NUMBER, value: 7 },
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                gap: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Gap.NONE,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Mo" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Tu" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "We" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Th" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Fr" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Sa" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "label",
                  overrides: {
                    content: { type: Sdn.ValueType.EXACT, value: "Su" },
                    width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                    textAlign: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.TextAlign.CENTER,
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
                  value: Sdn.Orientation.VERTICAL,
                },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
                gap: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@gap.compact",
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      overrides: {
                        columnSpan: {
                          type: Sdn.ValueType.EXACT,
                          value: { unit: Sdn.Unit.NUMBER, value: 6 },
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "1" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "2" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "3" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "4" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "5" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "6" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "7" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "8" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "9" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "10" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "11" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "12" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "13" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "14" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "15" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "16" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "17" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "18" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "19" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "20" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "21" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "22" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "23" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "24" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "25" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "26" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "27" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "28" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "29" },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CONTAINER,
                  overrides: {
                    columns: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 7 },
                    },
                    width: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Resize.FILL,
                    },
                    gap: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Gap.NONE,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "30" },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.CALENDAR_DAY,
                      overrides: {
                        columnSpan: {
                          type: Sdn.ValueType.EXACT,
                          value: { unit: Sdn.Unit.NUMBER, value: 6 },
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: "" },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "event",
      label: "Event markers",
      intent:
        "A single month that highlights the active week and marks the selected day with an event count.",
      overrides: {
        gap: {
          type: Sdn.ValueType.THEME_ORDINAL,
          value: "@gap.comfortable",
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
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "SEPTEMBER 2024" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                color: {
                  type: Sdn.ValueType.THEME_CATEGORICAL,
                  value: "@swatch.gray",
                },
              },
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.medium",
                },
                background: [
                  {
                    kind: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.BackgroundKind.NONE,
                    },
                  },
                ],
                border: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@border.none",
                  },
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-chevronLeft",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.primary",
                    },
                  },
                },
              ],
            },
            {
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.medium",
                },
                background: [
                  {
                    kind: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.BackgroundKind.NONE,
                    },
                  },
                ],
                border: {
                  preset: {
                    type: Sdn.ValueType.THEME_CATEGORICAL,
                    value: "@border.none",
                  },
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.ICON,
                  overrides: {
                    symbol: {
                      type: Sdn.ValueType.OPTION,
                      value: "material-chevronRight",
                    },
                    color: {
                      type: Sdn.ValueType.THEME_CATEGORICAL,
                      value: "@swatch.primary",
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          component: Seldon.ComponentId.CONTAINER,
          overrides: {
            columns: {
              type: Sdn.ValueType.EXACT,
              value: { unit: Sdn.Unit.NUMBER, value: 7 },
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            gap: { type: Sdn.ValueType.OPTION, value: Sdn.Gap.NONE },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Sun" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.CENTER,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Mon" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.CENTER,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Tue" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.CENTER,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Wed" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.CENTER,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Thu" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.CENTER,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Fri" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.CENTER,
                },
              },
            },
            {
              component: Seldon.ComponentId.TEXT,
              variant: "label",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "Sat" },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                textAlign: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.TextAlign.CENTER,
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
              value: Sdn.Orientation.VERTICAL,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.cozy" },
          },
          children: [
            {
              component: Seldon.ComponentId.CONTAINER,
              overrides: {
                columns: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.NUMBER, value: 7 },
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                gap: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Gap.NONE,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "1" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "selected",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "2" },
                      },
                    },
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "5" },
                        font: {
                          preset: {
                            type: Sdn.ValueType.THEME_CATEGORICAL,
                            value: "@font.label",
                          },
                          size: {
                            type: Sdn.ValueType.THEME_ORDINAL,
                            value: "@fontSize.tiny",
                          },
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "3" },
                        color: {
                          type: Sdn.ValueType.THEME_CATEGORICAL,
                          value: "@swatch.primary",
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "4" },
                        color: {
                          type: Sdn.ValueType.THEME_CATEGORICAL,
                          value: "@swatch.primary",
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "5" },
                        color: {
                          type: Sdn.ValueType.THEME_CATEGORICAL,
                          value: "@swatch.primary",
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "6" },
                        color: {
                          type: Sdn.ValueType.THEME_CATEGORICAL,
                          value: "@swatch.primary",
                        },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "7" },
                      },
                    },
                  ],
                },
              ],
            },
            {
              component: Seldon.ComponentId.CONTAINER,
              overrides: {
                columns: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.NUMBER, value: 7 },
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                gap: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Gap.NONE,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "8" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "9" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "10" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "11" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "12" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "13" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "14" },
                      },
                    },
                  ],
                },
              ],
            },
            {
              component: Seldon.ComponentId.CONTAINER,
              overrides: {
                columns: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.NUMBER, value: 7 },
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                gap: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Gap.NONE,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "15" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "16" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "17" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "18" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "19" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "20" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "21" },
                      },
                    },
                  ],
                },
              ],
            },
            {
              component: Seldon.ComponentId.CONTAINER,
              overrides: {
                columns: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.NUMBER, value: 7 },
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                gap: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Gap.NONE,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "22" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "23" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "24" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "25" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "26" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "27" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "28" },
                      },
                    },
                  ],
                },
              ],
            },
            {
              component: Seldon.ComponentId.CONTAINER,
              overrides: {
                columns: {
                  type: Sdn.ValueType.EXACT,
                  value: { unit: Sdn.Unit.NUMBER, value: 7 },
                },
                width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
                gap: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Gap.NONE,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "29" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  variant: "muted",
                  overrides: {
                    align: {
                      type: Sdn.ValueType.OPTION,
                      value: Sdn.Align.TOP_CENTER,
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "30" },
                      },
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.CALENDAR_DAY,
                  overrides: {
                    columnSpan: {
                      type: Sdn.ValueType.EXACT,
                      value: { unit: Sdn.Unit.NUMBER, value: 5 },
                    },
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TEXT,
                      variant: "label",
                      overrides: {
                        content: { type: Sdn.ValueType.EXACT, value: "" },
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
