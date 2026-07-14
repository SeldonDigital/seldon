/**
 * The render pipeline behind `view_node` and `apply_actions`' render
 * parameter: target resolution, the cheap css path, Factory-SSR html, and
 * the screenshot fallback ladder. Lives in render/ so both tools share one
 * identical code path without one tool module importing another. Throws
 * ToolError; never mutates the session or the on-disk workspace.
 */
import { getThemeSlug } from "@seldon/factory/export/css/generation/get-theme-slug"
import { getCssObjectFromProperties } from "@seldon/factory/styles/css-properties/get-css-object-from-properties"
import type { CSSObject } from "@seldon/factory/styles/css-properties/types"
import type { StyleGenerationContext } from "@seldon/factory/styles/types"

import type { ThemeInstanceId } from "@seldon/core/themes/types/theme-id"
import { getNodeComputeContext } from "@seldon/core/workspace/compute"
import { getBoardByNodeId } from "@seldon/core/workspace/helpers/components/get-board-by-node-id"
import { walkBoardTreeRefs } from "@seldon/core/workspace/helpers/components/walk-board-tree-refs"
import { getContainerByKey } from "@seldon/core/workspace/helpers/general/get-composition-containers"
import { isComponentBoard } from "@seldon/core/workspace/model/components"
import { workspaceReducer } from "@seldon/core/workspace/reducers/reducer"
import type {
  Board,
  ComponentTreeRef,
  EntryNode,
  Workspace,
} from "@seldon/core/workspace/types"

import { ToolError } from "../errors"
import type { ToolContext } from "../tools/context"
import { assembleBoardSheet, assembleDocument } from "./assemble-html"
import { COMPONENTS_FOLDER, getCachedExport, toFileMap } from "./export-cache"
import { bundleAndRender, findComponentFile } from "./factory-ssr"
import { persistPreview } from "./preview-file"
import { DEFAULT_WIDTH } from "./screenshot"

export type ViewNodeFormat = "css" | "html" | "image"

export interface ViewNodeResult {
  target: string
  /** The format actually delivered (image degrades to html). */
  format: ViewNodeFormat
  /** Present when the delivered format differs from the requested one. */
  requestedFormat?: ViewNodeFormat
  /** Why an image request was delivered as html. */
  imageFallback?: string
  /** What actually rendered — instance targets widen to their variant. */
  renderedScope:
    | { kind: "variant"; id: string; component: string }
    | { kind: "board"; key: string; variantIds: string[] }
  /**
   * Present when target was an instance nested inside a variant: html
   * renders the whole variant (the widest production unit Factory
   * generates); use format "css" for this exact node's resolved values.
   */
  widenedFrom?: string
  /** Theme id(s) the render resolved under. */
  themeIds: string[]
  /** format "css" only: resolved values for the exact target node. */
  css?: CSSObject
  /** format "html" only: a full, self-contained HTML document. */
  html?: string
  /** format "image" only: PNG bytes, base64. The server lifts this into an
   * MCP image content block; it is stripped from the JSON text. */
  imageBase64?: string
  mimeType?: "image/png"
  /** Where the PNG was persisted, next to the workspace file. */
  previewPath?: string
  /** Viewport width the screenshot used. */
  width?: number
}

interface VariantTarget {
  kind: "variant"
  variant: EntryNode
  widenedFrom?: string
}
interface BoardTarget {
  kind: "board"
  key: string
  board: Board
  variantIds: string[]
}

function findAncestorVariantId(board: Board, nodeId: string): string | null {
  for (const root of board.variants as ComponentTreeRef[]) {
    let found = false
    walkBoardTreeRefs([root], (ref) => {
      if (ref.id !== nodeId) return
      found = true
      return true
    })
    if (found) return root.id
  }
  return null
}

function resolveTarget(
  workspace: Workspace,
  target: string,
): VariantTarget | BoardTarget {
  const container = getContainerByKey(workspace, target)
  if (container) {
    if (!isComponentBoard(container)) {
      throw new ToolError({
        code: "board_not_found",
        message: `"${target}" is a playground, not a component board — playground sandboxes are not part of the Factory export and cannot be rendered.`,
        recovery:
          "Target a component board key, or a variant/instance node id.",
      })
    }
    return {
      kind: "board",
      key: target,
      board: container,
      variantIds: (container.variants as ComponentTreeRef[]).map(
        (ref) => ref.id,
      ),
    }
  }

  const node = workspace.nodes[target]
  if (!node) {
    throw new ToolError({
      code: "node_not_found",
      message: `"${target}" is neither a node id nor a board key in this workspace.`,
      recovery:
        "Use get_workspace_outline for board keys and variant ids, " +
        "find_nodes to search nodes, or an apply_actions receipt's created ids.",
    })
  }

  if (node.type !== "instance") {
    return { kind: "variant", variant: node }
  }

  // Instance target: widen to the nearest ancestor variant — the smallest
  // unit the Factory export generates.
  const board = getBoardByNodeId(workspace, target)
  const ancestorId = board ? findAncestorVariantId(board, target) : null
  const ancestor = ancestorId ? workspace.nodes[ancestorId] : undefined
  if (!ancestor) {
    throw new ToolError({
      code: "node_not_found",
      message: `Instance "${target}" is not part of any board's variant tree.`,
      recovery:
        "The node may be orphaned. Use get_workspace_outline to list live " +
        "variant trees.",
    })
  }
  return { kind: "variant", variant: ancestor, widenedFrom: target }
}

/** Theme id a node resolves under, via Core's compute engine. */
function resolveThemeId(workspace: Workspace, nodeId: string): string {
  const context = getNodeComputeContext(nodeId, workspace)
  return context.theme.id
}

/**
 * The non-mutating theme override: fold `set_node_theme` over a variant
 * list on a SCRATCH workspace object. The session and the on-disk file are
 * untouched; the export cache keys by object identity, so the scratch
 * version gets its own (garbage-collectable) export.
 */
function applyThemeOverride(
  workspace: Workspace,
  variantIds: string[],
  themeId: string,
): Workspace {
  if (!workspace.themes[themeId]) {
    throw new ToolError({
      code: "theme_not_found",
      message: `Theme "${themeId}" does not exist in this workspace.`,
      recovery: `Available workspace theme ids: ${Object.keys(workspace.themes).join(", ")}. Stock themes must be added to the workspace (add_theme) before rendering under them.`,
    })
  }
  return variantIds.reduce(
    (ws, nodeId) =>
      workspaceReducer(ws, {
        type: "set_node_theme",
        // Workspace theme keys are opaque strings (e.g. "theme-sky-default");
        // Core's ThemeInstanceId union only models stock catalog ids and its
        // own docs say to treat workspace refs as strings at boundaries.
        payload: { nodeId, theme: themeId as ThemeInstanceId },
      }),
    workspace,
  )
}

async function renderVariantHtml(
  workspace: Workspace,
  variant: EntryNode,
): Promise<string> {
  const files = toFileMap(await getCachedExport(workspace))
  const { entryPath, exportName } = findComponentFile(
    files,
    workspace,
    variant,
    COMPONENTS_FOLDER,
  )
  return bundleAndRender(files, entryPath, exportName)
}

/**
 * Renders one target: a variant or instance node id (one component on a
 * neutral stage) or a component board key (all variants as one sheet), as
 * resolved css values, a full production HTML document, or a PNG screenshot
 * that degrades to html when screenshots are unavailable.
 */
export async function renderTarget(
  ctx: ToolContext,
  input: {
    target: string
    format?: ViewNodeFormat
    theme?: string
    width?: number
  },
): Promise<ViewNodeResult> {
  const open = ctx.session.requireOpen()
  const { workspace: sessionWorkspace } = open
  const format = input.format ?? "css"
  const resolved = resolveTarget(sessionWorkspace, input.target)

  const scopeVariantIds =
    resolved.kind === "board" ? resolved.variantIds : [resolved.variant.id]
  const workspace = input.theme
    ? applyThemeOverride(sessionWorkspace, scopeVariantIds, input.theme)
    : sessionWorkspace

  if (format === "css") {
    if (resolved.kind === "board") {
      throw new ToolError({
        code: "invalid_render_target",
        message: `format "css" needs a single node; "${input.target}" is a whole board.`,
        recovery:
          "Pass one of the board's variant ids (get_workspace_outline lists " +
          'them), or use format "html" for the side-by-side board sheet.',
      })
    }
    // The exact requested node — css never widens (unlike html, which can
    // only render whole variants).
    const cssTargetId = resolved.widenedFrom ?? resolved.variant.id
    const context = getNodeComputeContext(cssTargetId, workspace)
    const css = getCssObjectFromProperties(
      context.properties,
      context as StyleGenerationContext,
    )
    return {
      target: input.target,
      format,
      renderedScope: {
        kind: "variant",
        id: resolved.variant.id,
        component: resolved.variant.template,
      },
      themeIds: [context.theme.id],
      css,
    }
  }

  let htmlResult: ViewNodeResult
  try {
    if (resolved.kind === "board") {
      const variants = resolved.variantIds.map((id) => workspace.nodes[id]!)
      const sections: Array<{
        label: string
        html: string
        themeSlug: string
      }> = []
      for (const variant of variants) {
        sections.push({
          label: variant.label,
          html: await renderVariantHtml(workspace, variant),
          themeSlug: getThemeSlug(
            resolveThemeId(workspace, variant.id),
            workspace,
          ),
        })
      }
      const themeIds = [
        ...new Set(
          resolved.variantIds.map((id) => resolveThemeId(workspace, id)),
        ),
      ]
      const files = toFileMap(await getCachedExport(workspace))
      htmlResult = {
        target: input.target,
        format: "html",
        renderedScope: {
          kind: "board",
          key: resolved.key,
          variantIds: resolved.variantIds,
        },
        themeIds,
        html: assembleDocument(
          files,
          assembleBoardSheet(sections),
          themeIds,
          workspace,
          COMPONENTS_FOLDER,
        ),
      }
    } else {
      const themeId = resolveThemeId(workspace, resolved.variant.id)
      const body = await renderVariantHtml(workspace, resolved.variant)
      const files = toFileMap(await getCachedExport(workspace))
      htmlResult = {
        target: input.target,
        format: "html",
        renderedScope: {
          kind: "variant",
          id: resolved.variant.id,
          component: resolved.variant.template,
        },
        ...(resolved.widenedFrom ? { widenedFrom: resolved.widenedFrom } : {}),
        themeIds: [themeId],
        html: assembleDocument(
          files,
          body,
          [themeId],
          workspace,
          COMPONENTS_FOLDER,
        ),
      }
    }
  } catch (error) {
    if (error instanceof ToolError) throw error
    throw new ToolError({
      code: "render_failed",
      message: `Rendering "${input.target}" failed: ${(error as Error).message}`,
      recovery:
        'format "css" (Core compute, no render pipeline) usually still works ' +
        "— use it to verify values while reporting this render failure.",
    })
  }

  if (format !== "image") return htmlResult

  // image = screenshot of the assembled document; unavailable screenshots
  // degrade to the html result, flagged, never thrown.
  const png = await ctx.screenshots?.capture(htmlResult.html!, {
    width: input.width,
  })
  if (!png) {
    return {
      ...htmlResult,
      requestedFormat: "image",
      imageFallback:
        "Screenshots are unavailable (Playwright optional dependency not " +
        "installed, or its browser is missing) — serving the html document " +
        "instead. Text verifies values; only images verify layout.",
    }
  }

  const previewPath = persistPreview(open.filePath, input.target, png)
  const { html: _omitted, ...withoutHtml } = htmlResult
  return {
    ...withoutHtml,
    format: "image",
    imageBase64: png.toString("base64"),
    mimeType: "image/png",
    previewPath,
    width: input.width ?? DEFAULT_WIDTH,
  }
}
