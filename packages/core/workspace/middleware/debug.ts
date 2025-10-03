import type { Action, Workspace } from "../types"

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: {
      connect: (options?: { name?: string }) => {
        init: (state: any) => void
        send: (action: any, state: any) => void
      }
    }
  }
}

/** Redux DevTools connection instance for debugging workspace state changes */
let devTools:
  | {
      init: (state: any) => void
      send: (action: any, state: any) => void
    }
  | undefined

/**
 * Middleware that integrates Redux DevTools for debugging workspace state changes.
 * @param reducer - The workspace reducer to wrap with debugging capabilities
 * @returns A new reducer function that logs actions and state to Redux DevTools
 */
export function debugMiddleware(
  reducer: (workspace: Workspace, action: Action) => Workspace,
) {
  if (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__) {
    devTools = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
      name: "Workspace Reducer",
    })
  }

  return (workspace: Workspace, action: Action) => {
    const nextWorkspace = reducer(workspace, action)

    if (devTools) {
      if (!workspace) {
        devTools.init(nextWorkspace)
      } else {
        devTools.send(action, nextWorkspace)
      }
    }

    return nextWorkspace
  }
}
