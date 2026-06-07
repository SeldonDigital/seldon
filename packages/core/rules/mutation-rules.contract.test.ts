import { describe, expect, it } from "bun:test"
import { addVariant } from "../workspace/reducers/handlers/add/add-variant"
import { duplicateNode } from "../workspace/reducers/handlers/duplicate/duplicate-node"
import { moveInstance } from "../workspace/reducers/handlers/move/move-instance"
import { removeInstance } from "../workspace/reducers/handlers/remove/remove-instance"
import { removeVariant } from "../workspace/reducers/handlers/remove/remove-variant"
import { reorderInstanceInParent } from "../workspace/reducers/handlers/reorder/reorder-instance-in-parent"
import { reorderVariantInBoard } from "../workspace/reducers/handlers/reorder/reorder-variant-in-board"
import { resetDefaultVariantToCatalog } from "../workspace/reducers/handlers/reset/reset-default-variant-to-catalog"
import { resetNode } from "../workspace/reducers/handlers/reset/reset-node"
import { resetUserVariantToDefault } from "../workspace/reducers/handlers/reset/reset-user-variant-to-default"
import type { EntryNode, EntryNodeType } from "../workspace/model/entry-node"
import type { Workspace } from "../workspace/types"
import { rules } from "./config/rules.config"
import type { Config } from "./types/rule-config-types"

const ENTITIES = ["board", "userVariant", "defaultVariant", "instance"] as const

function makeNode(id: string, type: EntryNodeType): EntryNode {
  return {
    id,
    type,
    level: "element",
    label: id,
    theme: null,
    template: "catalog:button",
    overrides: {},
    ...(type === "instance" ? { origin: "user" as const } : {}),
  }
}

function makeWorkspace(): Workspace {
  return {
    metadata: { version: 0, label: "" },
    components: {},
    nodes: {
      "default-1": makeNode("default-1", "default"),
      "variant-1": makeNode("variant-1", "variant"),
      "instance-1": makeNode("instance-1", "instance"),
      "parent-1": makeNode("parent-1", "instance"),
    },
    themes: {},
    "font-collections": {},
    "icon-sets": {},
    media: {},
  }
}

/**
 * Flips one bucket entry to `allowed: false`, runs `fn`, then restores it.
 * Asserting the handler returns the workspace untouched proves the rule config
 * is the single gate for that action.
 */
function withDenied<T>(
  bucket: keyof typeof rules.mutations,
  entity: (typeof ENTITIES)[number],
  fn: () => T,
): T {
  const row = (rules.mutations[bucket] as Config)[entity]
  const previous = row.allowed
  row.allowed = false
  try {
    return fn()
  } finally {
    row.allowed = previous
  }
}

describe("rules.config single-source contract", () => {
  it("defines every entity row for each mutation bucket", () => {
    for (const bucket of Object.values(rules.mutations)) {
      for (const entity of ENTITIES) {
        const row = (bucket as Config)[entity]
        expect(row).toBeDefined()
        expect(typeof row.allowed).toBe("boolean")
        expect(["none", "downstream", "bidirectional"]).toContain(
          row.propagation,
        )
      }
    }
  })

  it("exposes an explicit reset bucket with propagation none", () => {
    for (const entity of ENTITIES) {
      expect(rules.mutations.reset[entity].allowed).toBe(true)
      expect(rules.mutations.reset[entity].propagation).toBe("none")
    }
  })

  it("scopes removalBehavior to the delete instance row only", () => {
    expect(rules.mutations.delete.instance.removalBehavior).toBeDefined()
    expect("removalBehavior" in rules.mutations.delete.board).toBe(false)
    expect("removalBehavior" in rules.mutations.delete.userVariant).toBe(false)
    expect("removalBehavior" in rules.mutations.delete.defaultVariant).toBe(
      false,
    )
  })

  it("locks the policy values the handlers depend on", () => {
    expect(rules.mutations.create.userVariant.allowed).toBe(true)
    expect(rules.mutations.reorder.userVariant.allowed).toBe(true)
    expect(rules.mutations.reorder.defaultVariant.allowed).toBe(false)
    expect(rules.mutations.reorder.instance.allowed).toBe(true)
    expect(rules.mutations.reorder.board.allowed).toBe(false)
    expect(rules.mutations.move.instance.allowed).toBe(true)
    expect(rules.mutations.move.userVariant.allowed).toBe(false)
    expect(rules.mutations.duplicate.defaultVariant.allowed).toBe(true)
    expect(rules.mutations.duplicate.instance.allowed).toBe(true)
    expect(rules.mutations.delete.userVariant.allowed).toBe(true)
    expect(rules.mutations.delete.defaultVariant.allowed).toBe(false)
    expect(rules.mutations.delete.instance.allowed).toBe(true)
  })
})

describe("structural handlers no-op when their bucket denies the entity", () => {
  it("reorderVariantInBoard respects reorder.userVariant", () => {
    const ws = makeWorkspace()
    const result = withDenied("reorder", "userVariant", () =>
      reorderVariantInBoard(
        { componentKey: "button", variantRootId: "variant-1", newIndex: 2 },
        ws,
      ),
    )
    expect(result).toBe(ws)
  })

  it("reorderInstanceInParent respects reorder.instance", () => {
    const ws = makeWorkspace()
    const result = withDenied("reorder", "instance", () =>
      reorderInstanceInParent({ instanceId: "instance-1", newIndex: 1 }, ws),
    )
    expect(result).toBe(ws)
  })

  it("moveInstance respects move.instance", () => {
    const ws = makeWorkspace()
    const result = withDenied("move", "instance", () =>
      moveInstance(
        { instanceId: "instance-1", target: { parentId: "parent-1", index: 0 } },
        ws,
      ),
    )
    expect(result).toBe(ws)
  })

  it("duplicateNode respects duplicate.instance", () => {
    const ws = makeWorkspace()
    const result = withDenied("duplicate", "instance", () =>
      duplicateNode({ nodeId: "instance-1" }, ws),
    )
    expect(result).toBe(ws)
  })

  it("removeVariant respects delete.userVariant", () => {
    const ws = makeWorkspace()
    const result = withDenied("delete", "userVariant", () =>
      removeVariant({ variantRootId: "variant-1" }, ws),
    )
    expect(result).toBe(ws)
  })

  it("removeInstance respects delete.instance", () => {
    const ws = makeWorkspace()
    const result = withDenied("delete", "instance", () =>
      removeInstance({ instanceId: "instance-1" }, ws),
    )
    expect(result).toBe(ws)
  })

  it("resetNode respects reset.instance", () => {
    const ws = makeWorkspace()
    const result = withDenied("reset", "instance", () =>
      resetNode({ nodeId: "instance-1" }, ws),
    )
    expect(result).toBe(ws)
  })

  it("resetUserVariantToDefault respects reset.userVariant", () => {
    const ws = makeWorkspace()
    const result = withDenied("reset", "userVariant", () =>
      resetUserVariantToDefault({ variantRootId: "variant-1" }, ws),
    )
    expect(result).toBe(ws)
  })

  it("resetDefaultVariantToCatalog respects reset.defaultVariant", () => {
    const ws = makeWorkspace()
    const result = withDenied("reset", "defaultVariant", () =>
      resetDefaultVariantToCatalog({ defaultVariantRootId: "default-1" }, ws),
    )
    expect(result).toBe(ws)
  })

  it("addVariant respects create.userVariant", () => {
    const ws = makeWorkspace()
    const result = withDenied("create", "userVariant", () =>
      addVariant({ componentKey: "button" }, ws),
    )
    expect(result).toBe(ws)
  })
})
