import * as Sdn from "../../../properties/constants"
import * as Seldon from "../../constants"
import { ComponentExport, ComponentSchema } from "../../types"

export const schema = {
  name: "Video",
  id: Seldon.ComponentId.VIDEO,
  intent: "Embeds video content with optional controls and playback settings.",
  tags: ["video", "media", "embed", "primitive", "playback", "UI"],
  level: Seldon.ComponentLevel.PRIMITIVE,
  icon: Seldon.ComponentIcon.STUB,
  properties: {
    // This is a basic schema - developers will expand it as needed
    display: { type: Sdn.ValueType.EMPTY, value: null },
    source: { type: Sdn.ValueType.EMPTY, value: null },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLVideo" },
}
