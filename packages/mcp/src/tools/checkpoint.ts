import { z } from "zod"

import { ToolError } from "../errors"
import { redactValue } from "../redact"
import { CHECKPOINT_CAP } from "../session"
import type { ToolContext } from "./context"

export const checkpointInputSchema = {
  op: z
    .enum(["create", "restore", "list"])
    .describe(
      '"create" snapshots the current workspace, "restore" swaps a snapshot ' +
        'back in (and persists it to the file), "list" shows what is held.',
    ),
  id: z
    .string()
    .optional()
    .describe('The checkpoint to restore (required for op "restore").'),
  label: z
    .string()
    .max(200)
    .optional()
    .describe('Optional human-readable label for op "create".'),
}

export interface CheckpointSummary {
  id: string
  label?: string
  createdAt: string
}

export interface CheckpointResult {
  op: "create" | "restore" | "list"
  /** create: the new checkpoint. restore: the checkpoint restored. */
  checkpoint?: CheckpointSummary
  /** create: the checkpoint evicted to stay under the cap (FIFO), if any. */
  evictedId?: string
  /** restore: where the restored workspace was persisted. */
  persistedTo?: string
  /** list (and create): everything currently held, oldest first. */
  checkpoints?: CheckpointSummary[]
  cap?: number
}

export function summarizeCheckpoints(ctx: ToolContext): CheckpointSummary[] {
  return ctx.session.checkpoints.map(({ id, label, createdAt }) => ({
    id,
    ...(label !== undefined ? { label } : {}),
    createdAt,
  }))
}

/**
 * In-memory session snapshots. Snapshots hold workspace
 * object references directly (reducer purity makes them immutable), capped at
 * 20 with FIFO eviction, and do not survive process exit — by design: the
 * disk file is always current, so a crash costs rollback depth, never work.
 * `restore` swaps the session workspace AND writes it to disk through the
 * disk-hash conflict check, so an external edit is never silently clobbered.
 */
export function checkpoint(
  ctx: ToolContext,
  input: { op: "create" | "restore" | "list"; id?: string; label?: string },
): CheckpointResult {
  const open = ctx.session.requireOpen()

  if (input.op === "list") {
    return redactValue({
      op: "list",
      checkpoints: summarizeCheckpoints(ctx),
      cap: CHECKPOINT_CAP,
    })
  }

  if (input.op === "create") {
    const { checkpoint: created, evictedId } = ctx.session.addCheckpoint(
      input.label,
    )
    return redactValue({
      op: "create",
      checkpoint: {
        id: created.id,
        ...(created.label !== undefined ? { label: created.label } : {}),
        createdAt: created.createdAt,
      },
      ...(evictedId !== undefined ? { evictedId } : {}),
      checkpoints: summarizeCheckpoints(ctx),
    })
  }

  // op === "restore"
  const found = input.id
    ? ctx.session.checkpoints.find((entry) => entry.id === input.id)
    : undefined
  if (!found) {
    throw new ToolError({
      code: "checkpoint_not_found",
      message: input.id
        ? `No checkpoint with id "${input.id}" exists in this session.`
        : 'op "restore" requires the id of a checkpoint to restore.',
      recovery:
        'Pick an id from detail.checkpoints (checkpoint {op: "list"} shows ' +
        "the same). Checkpoints are in-memory and per-session; they do not " +
        "survive a server restart or opening a different workspace path.",
      detail: { checkpoints: summarizeCheckpoints(ctx) },
    })
  }

  // The restore is a write like any other — disk wins on conflict.
  ctx.session.commit(found.workspace, {
    aborted: "The checkpoint was not restored",
    retry: "restore this checkpoint again if still wanted",
  })

  return redactValue({
    op: "restore",
    checkpoint: {
      id: found.id,
      ...(found.label !== undefined ? { label: found.label } : {}),
      createdAt: found.createdAt,
    },
    persistedTo: open.filePath,
  })
}
