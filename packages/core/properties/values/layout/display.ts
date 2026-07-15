import { ValueType } from "../../constants"
import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"

/**
 * Whether the node appears on the canvas, stays hidden, renders as an opt-in
 * slot, shows only while authoring, or drops out of the tree.
 *
 * - `SHOW`: shown on the canvas and emitted by the factory.
 * - `HIDE`: hidden on the canvas and emitted by the factory as `visibility:
 *   hidden`, so it still occupies layout space.
 * - `STUB`: shown on the canvas; emitted as an opt-in slot that renders nothing
 *   by default and can be populated by a caller.
 * - `MOCK`: shown on the canvas but not emitted by the factory, so it exists
 *   only while authoring.
 * - `EXCLUDE`: hidden on the canvas and not emitted by the factory.
 */
export enum Display {
  SHOW = "show",
  HIDE = "hide",
  STUB = "stub",
  MOCK = "mock",
  EXCLUDE = "exclude",
}

/** Picks show, hide, or exclude from the Display enum. */
export interface DisplayOptionValue {
  type: ValueType.OPTION
  value: Display
}

/** Unset or a picked option from Display. */
export type DisplayValue = EmptyValue | DisplayOptionValue

export const displaySchema: PropertySchema = {
  name: "display",
  description:
    "Controls whether the element shows, stays hidden, or is excluded from the tree.",
  supports: ["empty", "inherit", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    option: (value: unknown) =>
      typeof value === "string" &&
      (Object.values(Display) as string[]).includes(value),
  },
  presetOptions: () => Object.values(Display),
}
