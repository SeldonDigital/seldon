import { PropertySchema } from "../../../types/schema"
import { EmptyValue } from "../../shared/empty/empty"
import { ImageSourceValue } from "../../shared/utilities/image-source"

export type BackgroundImageValue = EmptyValue | ImageSourceValue

export const backgroundImageSchema: PropertySchema = {
  name: "backgroundImage",
  description: "Background image source",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: any) => {
      if (
        typeof value === "string" &&
        (value.startsWith("url(") || value.startsWith("http"))
      )
        return true
      if (typeof value === "object" && value.src !== undefined) return true
      return false
    },
  },
}
