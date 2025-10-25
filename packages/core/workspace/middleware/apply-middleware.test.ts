import { describe, expect, it } from "bun:test"
import { Action, Workspace } from "../types"
import { applyMiddleware } from "./apply-middleware"

describe("applyMiddleware", () => {
  const mockReducer = (workspace: Workspace, action: Action): Workspace => {
    return { ...workspace, version: workspace.version + 1 }
  }

  const mockMiddleware1 =
    (next: any) => (workspace: Workspace, action: Action) => {
      return next({ ...workspace, test1: true }, action)
    }

  const mockMiddleware2 =
    (next: any) => (workspace: Workspace, action: Action) => {
      return next({ ...workspace, test2: true }, action)
    }

  it("should apply middleware in correct order", () => {
    const enhancedReducer = applyMiddleware(
      mockReducer,
      mockMiddleware1,
      mockMiddleware2,
    )

    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme: {} as any,
    }

    const action: Action = { type: "test", payload: {} }
    const result = enhancedReducer(workspace, action)

    expect(result.test1).toBe(true)
    expect(result.test2).toBe(true)
    expect(result.version).toBe(2)
  })

  it("should work with no middleware", () => {
    const enhancedReducer = applyMiddleware(mockReducer)

    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme: {} as any,
    }

    const action: Action = { type: "test", payload: {} }
    const result = enhancedReducer(workspace, action)

    expect(result.version).toBe(2)
    expect(result.test1).toBeUndefined()
  })

  it("should apply middleware in reverse order", () => {
    const orderMiddleware1 =
      (next: any) => (workspace: Workspace, action: Action) => {
        return next({ ...workspace, order: (workspace.order || 0) + 1 }, action)
      }

    const orderMiddleware2 =
      (next: any) => (workspace: Workspace, action: Action) => {
        return next(
          { ...workspace, order: (workspace.order || 0) + 10 },
          action,
        )
      }

    const enhancedReducer = applyMiddleware(
      mockReducer,
      orderMiddleware1,
      orderMiddleware2,
    )

    const workspace: Workspace = {
      version: 1,
      boards: {},
      byId: {},
      customTheme: {} as any,
    }

    const action: Action = { type: "test", payload: {} }
    const result = enhancedReducer(workspace, action)

    // Middleware should be applied in reverse order (right-to-left)
    expect(result.order).toBe(11) // 10 + 1
  })
})
