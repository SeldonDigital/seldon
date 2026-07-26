import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { usePanel } from "@app/editor/hooks/use-panel"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useCallback, useMemo, useState } from "react"

import { catalog } from "@seldon/core/components/catalog"
import { isComponentId } from "@seldon/core/components/constants"
import {
  authoredBoardKeyFromName,
  authoredExportNameFromName,
} from "@seldon/core/workspace/helpers/components/authored-board-key"
import type { EntryNodeLevel } from "@seldon/core/workspace/model/entry-node"

export type AuthoredRootKind = "container" | "frame"

/** Levels an authored component may declare. Primitives and frames are excluded. */
export const AUTHORED_LEVEL_OPTIONS: readonly {
  value: EntryNodeLevel
  label: string
}[] = [
  { value: "element", label: "Element" },
  { value: "part", label: "Part" },
  { value: "module", label: "Module" },
  { value: "screen", label: "Screen" },
]

/** Catalog schema names, used to warn about export filename collisions. */
const CATALOG_COMPONENT_NAMES = new Set<string>(
  Object.values(catalog)
    .flat()
    .map((schema) => schema.name),
)

/**
 * View-model for the Create Component dialog. Holds the authored component form
 * fields, derives a collision warning from the entered name, and dispatches
 * `add_authored_component` on submit. The core validator is the final gate; the
 * warning mirrors its checks so the user sees the problem before submitting.
 */
export function useCreateComponentPanel() {
  const { activePanel, closePanel } = usePanel()
  const { workspace } = useWorkspace()
  const { addAuthoredComponent } = useAddRemoveCommands()

  const [name, setName] = useState("")
  const [rootKind, setRootKind] = useState<AuthoredRootKind>("frame")
  const [level, setLevel] = useState<EntryNodeLevel>("element")
  const [intent, setIntent] = useState("")
  const [tags, setTags] = useState("")

  const isOpen = activePanel === "create-component"

  const trimmedName = name.trim()
  const boardKey = trimmedName ? authoredBoardKeyFromName(trimmedName) : ""
  const exportName = trimmedName ? authoredExportNameFromName(trimmedName) : ""

  const nameError = useMemo(() => {
    if (!trimmedName) return null
    if (!boardKey) return "Name must contain a letter or number."
    if (
      workspace.boards[boardKey] !== undefined ||
      workspace.playgrounds?.[boardKey] !== undefined
    ) {
      return "A component with this name already exists in this workspace."
    }
    if (isComponentId(boardKey)) {
      return `Name collides with the catalog component "${boardKey}".`
    }
    if (CATALOG_COMPONENT_NAMES.has(exportName)) {
      return `Name collides with the catalog component "${exportName}".`
    }
    return null
  }, [trimmedName, boardKey, exportName, workspace])

  const canSubmit = trimmedName.length > 0 && boardKey.length > 0 && !nameError

  const reset = useCallback(() => {
    setName("")
    setRootKind("frame")
    setLevel("element")
    setIntent("")
    setTags("")
  }, [])

  const close = useCallback(() => {
    reset()
    closePanel()
  }, [reset, closePanel])

  const save = useCallback(() => {
    if (!canSubmit) return
    const parsedTags = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    const trimmedIntent = intent.trim()
    addAuthoredComponent({
      name: trimmedName,
      rootKind,
      level,
      intent: trimmedIntent || undefined,
      tags: parsedTags.length > 0 ? parsedTags : undefined,
    })
    close()
  }, [
    canSubmit,
    tags,
    intent,
    addAuthoredComponent,
    trimmedName,
    rootKind,
    level,
    close,
  ])

  return {
    isOpen,
    name,
    setName,
    rootKind,
    setRootKind,
    level,
    setLevel,
    intent,
    setIntent,
    tags,
    setTags,
    nameError,
    canSubmit,
    save,
    close,
  }
}
