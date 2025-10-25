import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

export enum Cursor {
  DEFAULT = "default",
  NONE = "none",
  CONTEXT_MENU = "context-menu",
  HELP = "help",
  POINTER = "pointer",
  PROGRESS = "progress",
  WAIT = "wait",
  CELL = "cell",
  CROSSHAIR = "crosshair",
  TEXT = "text",
  VERTICAL_TEXT = "vertical-text",
  ALIAS = "alias",
  COPY = "copy",
  MOVE = "move",
  NO_DROP = "no-drop",
  NOT_ALLOWED = "not-allowed",
  GRAB = "grab",
  GRABBING = "grabbing",
  E_RESIZE = "e-resize",
  N_RESIZE = "n-resize",
  NE_RESIZE = "ne-resize",
  NW_RESIZE = "nw-resize",
  S_RESIZE = "s-resize",
  SE_RESIZE = "se-resize",
  SW_RESIZE = "sw-resize",
  W_RESIZE = "w-resize",
  EW_RESIZE = "ew-resize",
  NS_RESIZE = "ns-resize",
  NESW_RESIZE = "nesw-resize",
  NWSE_RESIZE = "nwse-resize",
  COL_RESIZE = "col-resize",
  ROW_RESIZE = "row-resize",
  ALL_SCROLL = "all-scroll",
  ZOOM_IN = "zoom-in",
  ZOOM_OUT = "zoom-out",
}

export interface CursorPresetValue {
  type: ValueType.PRESET
  value: Cursor
}

export type CursorValue = EmptyValue | CursorPresetValue

export const cursorSchema: PropertySchema = {
  name: "cursor",
  description: "Mouse cursor style",
  supports: ["empty", "inherit", "exact", "preset"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string" && value.length > 0,
    preset: (value: any) => Object.values(Cursor).includes(value),
  },
  presetOptions: () => Object.values(Cursor),
}
