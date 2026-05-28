import { PropertySchema } from "../../../types/schema"
import { ImageSourceValue } from "../../shared/utilities/image-source"

/** Unset or exact image location for one background layer. */
export type BackgroundImageValue = ImageSourceValue

/** Validates image source storage on one background paint layer. */
export const backgroundImageSchema: PropertySchema = {
  name: "backgroundImage",
  description:
    "Sets the file path or web address this layer uses as its picture.",
  supports: ["empty", "inherit", "exact"] as const,
  validation: {
    empty: () => true,
    inherit: () => true,
    exact: (value: unknown) => {
      if (typeof value !== "string" || value.length === 0) return false
      return (
        value.startsWith("url(") ||
        value.startsWith("http") ||
        value.startsWith("/") ||
        value.startsWith("./")
      )
    },
  },
}
