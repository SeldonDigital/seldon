"use client"

import { useRevealedBorderSides } from "@app/sidebars/properties/hooks/use-border-side-visibility"
import { useNodeActiveState } from "@app/workspace/hooks/use-node-active-state"
import { useSelection } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  flattenNodeProperties,
  getPropertiesSubjectId,
} from "@seldon/editor/lib/properties/inspector/properties-data"
import { useMemo } from "react"

import { workspaceThemeService } from "@seldon/core/workspace/services/theme/theme.service"

import type { RowPropertyProps } from "@app/sidebars/properties/hooks/use-row-property"
import type { Board, Instance, Theme, Variant, Workspace } from "@seldon/core"
import type { FlatProperty } from "@seldon/editor/lib/properties/inspector/properties-data"

/**
 * The selection's property rows, and everything a single `Property` control needs to
 * render from them.
 *
 * The same inputs the properties sidebar builds from, gathered once so both the token
 * badges and their open cards read one flat list. `node` is `null` when nothing is
 * selected, when there is nothing to draw.
 */
export interface TokenPropertyData {
  node: Variant | Instance | Board | null
  workspace: Workspace
  theme: Theme | undefined
  flatProperties: FlatProperty[]
}

export function useTokenProperties(): TokenPropertyData {
  const { selection } = useSelection()
  const { workspace } = useWorkspace({ usePreview: false })
  const node = (selection ?? null) as Variant | Instance | Board | null

  const activeState = useNodeActiveState(node)

  const borderSideSubjectId = node ? getPropertiesSubjectId(node) : ""
  const shownBorderSides = useRevealedBorderSides(borderSideSubjectId)

  const theme = useMemo(() => {
    if (!node) return undefined

    return workspaceThemeService.getObjectTheme(node, workspace)
  }, [node, workspace])

  const flatProperties = useMemo(() => {
    if (!node) return []

    return flattenNodeProperties(node, workspace, theme, shownBorderSides, activeState)
  }, [node, workspace, theme, shownBorderSides, activeState])

  return { node, workspace, theme, flatProperties }
}

/**
 * The props one `Property` control renders from, for the top-level row of a property
 * key. `null` when the selection does not expose that row.
 */
export function buildTokenRowProps(
  propertyKey: string,
  data: TokenPropertyData,
): RowPropertyProps | null {
  if (!data.node) return null

  const property = data.flatProperties.find(
    (candidate) => !candidate.isSubProperty && candidate.key === propertyKey,
  )

  if (!property) return null

  return {
    property,
    workspace: data.workspace,
    node: data.node,
    allProperties: data.flatProperties,
    theme: data.theme,
  }
}
