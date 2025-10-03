import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Track",
  id: Seldon.ComponentId.TRACK,
  intent: "Defines timed text tracks (e.g., captions) for media playback.",
  tags: [
    "track",
    "captions",
    "subtitles",
    "video",
    "media",
    "primitive",
    "accessibility",
  ],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.INPUT,
  properties: {
    // This is a basic schema - developers will expand it as needed
    source: { type: Sdn.ValueType.EMPTY, value: null },
    content: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLTrack" },
}
