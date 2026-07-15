import { PropertySchema } from "../../types/schema"

export const wrapChildrenSchema: PropertySchema = {
  name: "wrapChildren",
  description:
    "Sets whether children move to the next line or row instead of overflowing.",
  supports: ["option"] as const,
  validation: {
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
