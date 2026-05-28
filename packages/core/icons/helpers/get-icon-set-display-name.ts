import { IconSetId } from "../types"

export function getIconSetDisplayName(iconSetId: IconSetId): string {
  const displayNames: Record<IconSetId, string> = {
    "google-material": "Material",
    carbon: "Carbon",
    lucide: "Lucide",
    seldon: "Seldon",
  }

  return displayNames[iconSetId] || iconSetId
}
