import { PropertySchema } from "../../types/schema"

export const clipSchema: PropertySchema = {
  name: "clip",
  description:
    "Cuts off content that extends past the element bounds when enabled.",
  supports: ["empty", "inherit", "exact", "option"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => typeof value === "boolean",
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
