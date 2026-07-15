import { PropertySchema } from "../../types/schema"

export const clipSchema: PropertySchema = {
  name: "clip",
  description:
    "Cuts off content that extends past the element bounds when enabled.",
  supports: ["option"] as const,
  validation: {
    option: (value: unknown) => typeof value === "boolean",
  },
  presetOptions: () => [true, false],
}
