import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

export const schema = {
  name: "Source",
  id: Seldon.ComponentId.SOURCE,
  intent: "Specifies the media source for video or audio playback elements.",
  tags: ["source", "media", "video", "audio", "primitive", "file", "playback"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.IMAGE,
  properties: {
    source: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLSource" },
}
