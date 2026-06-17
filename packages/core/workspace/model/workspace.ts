import type { Board, BoardKey } from "./components"
import type {
  EntryFontCollection,
  EntryFontCollectionId,
} from "./entry-font-collection"
import type { EntryIconSet, EntryIconSetId } from "./entry-icon-set"
import type { EntryMedia, EntryMediaId } from "./entry-media"
import type { EntryNode, EntryNodeId } from "./entry-node"
import type { EntryTheme, EntryThemeId } from "./entry-theme"
import type { WorkspaceMetadata } from "./metadata"
import type { PlaygroundContainer, PlaygroundKey } from "./playground"

export interface Workspace {
  metadata: WorkspaceMetadata
  boards: Record<BoardKey, Board>
  playgrounds: Record<PlaygroundKey, PlaygroundContainer>
  nodes: Record<EntryNodeId, EntryNode>
  themes: Record<EntryThemeId, EntryTheme>
  "font-collections": Record<EntryFontCollectionId, EntryFontCollection>
  "icon-sets": Record<EntryIconSetId, EntryIconSet>
  media: Record<EntryMediaId, EntryMedia>
}
