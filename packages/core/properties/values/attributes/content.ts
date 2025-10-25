import { PropertySchema } from "../../types/schema"
import { EmptyValue } from "../shared/empty/empty"
import { StringValue } from "../shared/exact/string"

export type ContentValue = EmptyValue | StringValue

export const contentSchema: PropertySchema = {
  name: "content",
  description: "Text content for elements",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => typeof value === "string",
  },
}
