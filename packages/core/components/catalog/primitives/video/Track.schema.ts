import * as Sdn from "../../../../properties"
import * as Seldon from "../../../constants"
import { ComponentExport, ComponentSchema } from "../../../types"

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
    content: { type: Sdn.ValueType.EMPTY, value: null },
    source: { type: Sdn.ValueType.EMPTY, value: null },
    trackKind: {
      type: Sdn.ValueType.OPTION,
      value: Sdn.TrackKind.SUBTITLES,
    },
    srcLang: { type: Sdn.ValueType.EMPTY, value: null },
    trackLabel: { type: Sdn.ValueType.EMPTY, value: null },
    trackDefault: { type: Sdn.ValueType.EXACT, value: false },
  },
} as const satisfies ComponentSchema

export const exportConfig: ComponentExport = {
  react: { returns: "HTMLTrack" },
}
