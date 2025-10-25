import { afterEach, beforeEach, describe, expect, it, jest } from "bun:test"
import { Action, Workspace } from "../types"
import { debugMiddleware } from "./debug"

describe("debugMiddleware", () => {
  const mockReducer = (workspace: Workspace, action: Action): Workspace => {
    return { ...workspace, version: (workspace?.version || 0) + 1 }
  }

  const mockWorkspace: Workspace = {
    version: 1,
    boards: {},
    byId: {},
    customTheme: {} as any,
  }

  const mockAction: Action = { type: "test", payload: {} }

  beforeEach(() => {
    // Clear any existing window object
    delete (global as any).window
  })

  afterEach(() => {
    // Clean up
    delete (global as any).window
  })

  it("should work without Redux DevTools", () => {
    const debugReducer = debugMiddleware(mockReducer)
    const result = debugReducer(mockWorkspace, mockAction)

    expect(result.version).toBe(2)
  })

  it("should work with Redux DevTools when window is undefined", () => {
    const debugReducer = debugMiddleware(mockReducer)
    const result = debugReducer(mockWorkspace, mockAction)

    expect(result.version).toBe(2)
  })

  it("should integrate with Redux DevTools when available", () => {
    const mockDevTools = {
      init: jest.fn(),
      send: jest.fn(),
    }

    const mockConnect = jest.fn().mockReturnValue(mockDevTools)

    ;(global as any).window = {
      __REDUX_DEVTOOLS_EXTENSION__: {
        connect: mockConnect,
      },
    }

    const debugReducer = debugMiddleware(mockReducer)

    // First call should init DevTools
    const result1 = debugReducer(null as any, mockAction)
    expect(mockConnect).toHaveBeenCalledWith({ name: "Workspace Reducer" })
    expect(mockDevTools.init).toHaveBeenCalledWith(result1)

    // Subsequent calls should send actions
    const result2 = debugReducer(mockWorkspace, mockAction)
    expect(mockDevTools.send).toHaveBeenCalledWith(mockAction, result2)
  })

  it("should throw when DevTools connection fails", () => {
    const mockConnect = jest.fn().mockImplementation(() => {
      throw new Error("DevTools connection failed")
    })

    ;(global as any).window = {
      __REDUX_DEVTOOLS_EXTENSION__: {
        connect: mockConnect,
      },
    }

    // The middleware should throw when DevTools connection fails
    expect(() => {
      debugMiddleware(mockReducer)
    }).toThrow("DevTools connection failed")

    expect(mockConnect).toHaveBeenCalled()
  })
})
