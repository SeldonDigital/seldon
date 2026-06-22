import * as Sdn from "../../../properties"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Table",
  id: Seldon.ComponentId.TABLE,
  intent:
    "A data table card with a toolbar, a column header row, data rows, and a pagination footer.",
  tags: [
    "table",
    "standard",
    "ui",
    "data",
    "columns",
    "rows",
    "filter",
    "sort",
  ],
  level: Seldon.ComponentLevel.MODULE,
  icon: Seldon.ComponentIcon.COMPONENT,
  properties: {
    display: { type: Sdn.ValueType.EMPTY, value: null },
    direction: { type: Sdn.ValueType.EMPTY, value: null },
    orientation: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Orientation.VERTICAL,
    },
    align: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.Align.TOP_LEFT,
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
      top: { type: Sdn.ValueType.EMPTY, value: null },
      right: { type: Sdn.ValueType.EMPTY, value: null },
      bottom: { type: Sdn.ValueType.EMPTY, value: null },
      left: { type: Sdn.ValueType.EMPTY, value: null },
    },
    gap: { type: Sdn.ValueType.EMPTY, value: null },
    rotation: { type: Sdn.ValueType.EMPTY, value: null },
    wrapChildren: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
    clip: {
      type: Sdn.ValueType.EXACT,
      value: true,
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
        opacity: { type: Sdn.ValueType.EMPTY, value: null },
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
      brightness: {
        type: Sdn.ValueType.EXACT,
        value: { unit: Sdn.Unit.PERCENT, value: 75 },
      },
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
        value: "@corners.tight",
      },
      topRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
      bottomLeft: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
      bottomRight: {
        type: Sdn.ValueType.THEME_ORDINAL,
        value: "@corners.tight",
      },
    },
    shadow: [
      {
        preset: {
          type: Sdn.ValueType.THEME_CATEGORICAL,
          value: "@shadow.xlight",
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
    role: { type: Sdn.ValueType.EMPTY, value: null },
    ariaLabel: { type: Sdn.ValueType.EMPTY, value: null },
    ariaHidden: {
      type: Sdn.ValueType.EXACT,
      value: false,
    },
  },
  default: {
    children: [
      {
        component: Seldon.ComponentId.FRAME,
        overrides: {
          wrapperElement: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.WrapperElement.HEADER,
          },
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          align: { type: Sdn.ValueType.OPTION, value: Sdn.Align.CENTER_LEFT },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
          },
          borderBottom: {
            preset: { type: Sdn.ValueType.EMPTY, value: null },
            style: { type: Sdn.ValueType.OPTION, value: Sdn.BorderStyle.SOLID },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.gray",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@borderWidth.xsmall",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "subtitle",
            overrides: {
              content: { type: Sdn.ValueType.EXACT, value: "Table name" },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            },
          },
          {
            component: Seldon.ComponentId.FRAME,
            overrides: {
              orientation: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.Orientation.HORIZONTAL,
              },
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
              gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.tight" },
            },
            children: [
              {
                component: Seldon.ComponentId.BUTTON,
                variant: "iconic",
                overrides: {
                  buttonSize: {
                    type: Sdn.ValueType.THEME_ORDINAL,
                    value: "@fontSize.large",
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
                        value: "material-search",
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
                    value: "@fontSize.large",
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
                        value: "material-filterList",
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
                    value: "@fontSize.large",
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
                        value: "material-tune",
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        component: Seldon.ComponentId.TABLE_GRID,
        overrides: {
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
        },
        children: [
          {
            component: Seldon.ComponentId.TABLE_HEAD,
            children: [
              {
                component: Seldon.ComponentId.TABLE_ROW_DATA,
                children: [
                  {
                    component: Seldon.ComponentId.TABLE_HEADER,
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
                    component: Seldon.ComponentId.TABLE_HEADER,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: { type: Sdn.ValueType.EXACT, value: "Name" },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_HEADER,
                    overrides: {
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER,
                      },
                    },
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Version",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_HEADER,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Supplier",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_HEADER,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Description",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_HEADER,
                    variant: "numeric",
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: { type: Sdn.ValueType.EXACT, value: "Date" },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            component: Seldon.ComponentId.TABLE_BODY,
            children: [
              {
                component: Seldon.ComponentId.TABLE_ROW_DATA,
                children: [
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      width: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Resize.FIT,
                      },
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER_LEFT,
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
                          height: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Resize.FIT,
                          },
                        },
                        children: [
                          {
                            component: Seldon.ComponentId.BUTTON,
                            variant: "iconic",
                            overrides: {
                              buttonSize: {
                                type: Sdn.ValueType.THEME_ORDINAL,
                                value: "@fontSize.large",
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
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Contract document 1",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER,
                      },
                    },
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: { type: Sdn.ValueType.EXACT, value: "1.0" },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Supplier name",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "description",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Lorem ipsum dolor sit amet",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    variant: "numeric",
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "7/16/20",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                component: Seldon.ComponentId.TABLE_ROW_DATA,
                children: [
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      width: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Resize.FIT,
                      },
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER_LEFT,
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
                          height: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Resize.FIT,
                          },
                        },
                        children: [
                          {
                            component: Seldon.ComponentId.BUTTON,
                            variant: "iconic",
                            overrides: {
                              buttonSize: {
                                type: Sdn.ValueType.THEME_ORDINAL,
                                value: "@fontSize.large",
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
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Contract document 2",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER,
                      },
                    },
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: { type: Sdn.ValueType.EXACT, value: "1.0" },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Supplier name",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "description",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Lorem ipsum dolor sit amet",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    variant: "numeric",
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "7/16/20",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                component: Seldon.ComponentId.TABLE_ROW_DATA,
                children: [
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      width: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Resize.FIT,
                      },
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER_LEFT,
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
                          height: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Resize.FIT,
                          },
                        },
                        children: [
                          {
                            component: Seldon.ComponentId.BUTTON,
                            variant: "iconic",
                            overrides: {
                              buttonSize: {
                                type: Sdn.ValueType.THEME_ORDINAL,
                                value: "@fontSize.large",
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
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Contract document 3",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER,
                      },
                    },
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: { type: Sdn.ValueType.EXACT, value: "1.0" },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Supplier name",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "description",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Lorem ipsum dolor sit amet",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    variant: "numeric",
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "7/16/20",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                component: Seldon.ComponentId.TABLE_ROW_DATA,
                children: [
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      width: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Resize.FIT,
                      },
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER_LEFT,
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
                          height: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Resize.FIT,
                          },
                        },
                        children: [
                          {
                            component: Seldon.ComponentId.BUTTON,
                            variant: "iconic",
                            overrides: {
                              buttonSize: {
                                type: Sdn.ValueType.THEME_ORDINAL,
                                value: "@fontSize.large",
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
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Contract document 4",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER,
                      },
                    },
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: { type: Sdn.ValueType.EXACT, value: "1.0" },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Supplier name",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "description",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Lorem ipsum dolor sit amet",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    variant: "numeric",
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "7/16/20",
                          },
                        },
                      },
                    ],
                  },
                ],
              },
              {
                component: Seldon.ComponentId.TABLE_ROW_DATA,
                children: [
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      width: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Resize.FIT,
                      },
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER_LEFT,
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
                          height: {
                            type: Sdn.ValueType.OPTION,
                            value: Sdn.Resize.FIT,
                          },
                        },
                        children: [
                          {
                            component: Seldon.ComponentId.BUTTON,
                            variant: "iconic",
                            overrides: {
                              buttonSize: {
                                type: Sdn.ValueType.THEME_ORDINAL,
                                value: "@fontSize.large",
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
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Contract document 5",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    overrides: {
                      cellAlign: {
                        type: Sdn.ValueType.OPTION,
                        value: Sdn.Align.CENTER,
                      },
                    },
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: { type: Sdn.ValueType.EXACT, value: "1.0" },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Supplier name",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "description",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "Lorem ipsum dolor sit amet",
                          },
                        },
                      },
                    ],
                  },
                  {
                    component: Seldon.ComponentId.TABLE_DATA,
                    variant: "numeric",
                    children: [
                      {
                        component: Seldon.ComponentId.TEXT,
                        variant: "label",
                        overrides: {
                          content: {
                            type: Sdn.ValueType.EXACT,
                            value: "7/16/20",
                          },
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
          wrapperElement: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.WrapperElement.FOOTER,
          },
          orientation: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Orientation.HORIZONTAL,
          },
          align: {
            type: Sdn.ValueType.OPTION,
            value: Sdn.Align.CENTER_RIGHT,
          },
          width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
          height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
          padding: {
            top: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            right: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            bottom: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
            left: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@padding.compact",
            },
          },
          borderTop: {
            preset: { type: Sdn.ValueType.EMPTY, value: null },
            style: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.BorderStyle.SOLID,
            },
            color: {
              type: Sdn.ValueType.THEME_CATEGORICAL,
              value: "@swatch.gray",
            },
            width: {
              type: Sdn.ValueType.THEME_ORDINAL,
              value: "@borderWidth.xsmall",
            },
            brightness: { type: Sdn.ValueType.EMPTY, value: null },
            opacity: { type: Sdn.ValueType.EMPTY, value: null },
          },
        },
        children: [
          {
            component: Seldon.ComponentId.TEXT,
            variant: "description",
            overrides: {
              content: {
                type: Sdn.ValueType.EXACT,
                value: "1 - 10 of 500",
              },
            },
          },
          {
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
            overrides: {
              buttonSize: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.large",
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
            component: Seldon.ComponentId.BUTTON,
            variant: "iconic",
            overrides: {
              buttonSize: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@fontSize.large",
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
            component: Seldon.ComponentId.SELECT,
            overrides: {
              width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            },
            children: [
              {
                component: Seldon.ComponentId.TEXT,
                variant: "option",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "10 per view",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "option",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "20 per view",
                  },
                },
              },
              {
                component: Seldon.ComponentId.TEXT,
                variant: "option",
                overrides: {
                  content: {
                    type: Sdn.ValueType.EXACT,
                    value: "50 per view",
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  variants: [
    {
      id: "customer",
      label: "Customer Table",
      intent:
        "Customer roster with a tinted header band, status chips, and colored balance figures.",
      children: [
        {
          component: Seldon.ComponentId.TABLE_GRID,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.TABLE_HEAD,
              children: [
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
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
                          type: Sdn.ValueType.EXACT,
                          value: { unit: Sdn.Unit.PERCENT, value: 65 },
                        },
                        opacity: { type: Sdn.ValueType.EMPTY, value: null },
                      },
                    ],
                  },
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      variant: "sortable",
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
                              value: Sdn.Resize.FIT,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
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
                                  value: "Customer",
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
                                      value: "material-unfoldMore",
                                    },
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      variant: "sortable",
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
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
                              value: Sdn.Resize.FIT,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
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
                                  value: "Status",
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
                                      value: "material-unfoldMore",
                                    },
                                  },
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Rate",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Balance",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Deposit",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              component: Seldon.ComponentId.TABLE_BODY,
              children: [
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "twoLine",
                      children: [
                        {
                          component: Seldon.ComponentId.FRAME,
                          overrides: {
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
                                  value: "Ralph Edwards",
                                },
                              },
                            },
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "description",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "(405) 555-0128",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "status",
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.CHIP,
                          children: [
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "label",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "Open",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$78.00",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "negative",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "-$105.55",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$293.01",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "twoLine",
                      children: [
                        {
                          component: Seldon.ComponentId.FRAME,
                          overrides: {
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
                                  value: "Floyd Miles",
                                },
                              },
                            },
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "description",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "(480) 555-0103",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "status",
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.CHIP,
                          overrides: {
                            background: [
                              {
                                kind: {
                                  type: Sdn.ValueType.OPTION,
                                  value: Sdn.BackgroundKind.COLOR,
                                },
                                color: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "#1F9D55",
                                },
                                brightness: {
                                  type: Sdn.ValueType.EMPTY,
                                  value: null,
                                },
                                opacity: {
                                  type: Sdn.ValueType.EMPTY,
                                  value: null,
                                },
                              },
                            ],
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "label",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "Paid",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$40.00",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "positive",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$275.43",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$710.68",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "twoLine",
                      children: [
                        {
                          component: Seldon.ComponentId.FRAME,
                          overrides: {
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
                                  value: "Darlene Robertson",
                                },
                              },
                            },
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "description",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "(808) 555-0111",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "status",
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.CHIP,
                          children: [
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "label",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "Open",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$77.00",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "negative",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "-$778.35",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$169.43",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "twoLine",
                      children: [
                        {
                          component: Seldon.ComponentId.FRAME,
                          overrides: {
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
                                  value: "Albert Flores",
                                },
                              },
                            },
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "description",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "(316) 555-0116",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "status",
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.CHIP,
                          overrides: {
                            background: [
                              {
                                kind: {
                                  type: Sdn.ValueType.OPTION,
                                  value: Sdn.BackgroundKind.COLOR,
                                },
                                color: {
                                  type: Sdn.ValueType.THEME_CATEGORICAL,
                                  value: "@swatch.gray",
                                },
                                brightness: {
                                  type: Sdn.ValueType.EMPTY,
                                  value: null,
                                },
                                opacity: {
                                  type: Sdn.ValueType.EMPTY,
                                  value: null,
                                },
                              },
                            ],
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "label",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "Inactive",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$85.00",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "positive",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$928.41",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$779.58",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "twoLine",
                      children: [
                        {
                          component: Seldon.ComponentId.FRAME,
                          overrides: {
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
                                  value: "Devon Lane",
                                },
                              },
                            },
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "description",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "(217) 555-0113",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "status",
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.CHIP,
                          overrides: {
                            background: [
                              {
                                kind: {
                                  type: Sdn.ValueType.OPTION,
                                  value: Sdn.BackgroundKind.COLOR,
                                },
                                color: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "#1F9D55",
                                },
                                brightness: {
                                  type: Sdn.ValueType.EMPTY,
                                  value: null,
                                },
                                opacity: {
                                  type: Sdn.ValueType.EMPTY,
                                  value: null,
                                },
                              },
                            ],
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.TEXT,
                              variant: "label",
                              overrides: {
                                content: {
                                  type: Sdn.ValueType.EXACT,
                                  value: "Paid",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$56.00",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "positive",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$256.35",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      variant: "numeric",
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "$896.65",
                            },
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
            wrapperElement: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.WrapperElement.FOOTER,
            },
            orientation: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Orientation.HORIZONTAL,
            },
            align: {
              type: Sdn.ValueType.OPTION,
              value: Sdn.Align.CENTER_LEFT,
            },
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
            gap: { type: Sdn.ValueType.THEME_ORDINAL, value: "@gap.compact" },
            padding: {
              top: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              right: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              bottom: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
              left: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@padding.compact",
              },
            },
            borderTop: {
              preset: { type: Sdn.ValueType.EMPTY, value: null },
              style: {
                type: Sdn.ValueType.OPTION,
                value: Sdn.BorderStyle.SOLID,
              },
              color: {
                type: Sdn.ValueType.THEME_CATEGORICAL,
                value: "@swatch.gray",
              },
              width: {
                type: Sdn.ValueType.THEME_ORDINAL,
                value: "@borderWidth.xsmall",
              },
              brightness: { type: Sdn.ValueType.EMPTY, value: null },
              opacity: { type: Sdn.ValueType.EMPTY, value: null },
            },
          },
          children: [
            {
              component: Seldon.ComponentId.TEXT,
              variant: "description",
              overrides: {
                content: { type: Sdn.ValueType.EXACT, value: "1-10 of 97" },
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FILL,
                },
              },
            },
            {
              component: Seldon.ComponentId.SELECT,
              overrides: {
                width: {
                  type: Sdn.ValueType.OPTION,
                  value: Sdn.Resize.FIT,
                },
              },
              children: [
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "option",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Rows per page: 10",
                    },
                  },
                },
                {
                  component: Seldon.ComponentId.TEXT,
                  variant: "option",
                  overrides: {
                    content: {
                      type: Sdn.ValueType.EXACT,
                      value: "Rows per page: 20",
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
                  value: "@fontSize.large",
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
              component: Seldon.ComponentId.BUTTON,
              variant: "iconic",
              overrides: {
                buttonSize: {
                  type: Sdn.ValueType.THEME_ORDINAL,
                  value: "@fontSize.large",
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
      ],
    },
    {
      id: "comparison",
      label: "Comparison Table",
      intent:
        "Plan comparison with grouped section rows and feature rows that mix text and checkmarks.",
      children: [
        {
          component: Seldon.ComponentId.TABLE_GRID,
          overrides: {
            width: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FILL },
            height: { type: Sdn.ValueType.OPTION, value: Sdn.Resize.FIT },
          },
          children: [
            {
              component: Seldon.ComponentId.TABLE_HEAD,
              children: [
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Usage",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Personal",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Personal Pro",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Team",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_HEADER,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Enterprise",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              component: Seldon.ComponentId.TABLE_BODY,
              children: [
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Pages & blocks",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Unlimited",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Unlimited",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Unlimited",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Unlimited",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Members",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Just you",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Just you",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Unlimited",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER,
                        },
                      },
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Unlimited",
                            },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "subtitle",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Collaboration",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: " " },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: " " },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: " " },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: { type: Sdn.ValueType.EXACT, value: " " },
                          },
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Real-time collaboration",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  component: Seldon.ComponentId.TABLE_ROW_DATA,
                  children: [
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      children: [
                        {
                          component: Seldon.ComponentId.TEXT,
                          variant: "label",
                          overrides: {
                            content: {
                              type: Sdn.ValueType.EXACT,
                              value: "Link sharing",
                            },
                          },
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
                              },
                            },
                          ],
                        },
                      ],
                    },
                    {
                      component: Seldon.ComponentId.TABLE_DATA,
                      overrides: {
                        cellAlign: {
                          type: Sdn.ValueType.OPTION,
                          value: Sdn.Align.CENTER_LEFT,
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
                              value: Sdn.Align.CENTER,
                            },
                            width: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FILL,
                            },
                            height: {
                              type: Sdn.ValueType.OPTION,
                              value: Sdn.Resize.FIT,
                            },
                          },
                          children: [
                            {
                              component: Seldon.ComponentId.ICON,
                              overrides: {
                                symbol: {
                                  type: Sdn.ValueType.OPTION,
                                  value: "material-check",
                                },
                                size: {
                                  type: Sdn.ValueType.THEME_ORDINAL,
                                  value: "@size.large",
                                },
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
      ],
    },
  ],
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "Frame" },
}
