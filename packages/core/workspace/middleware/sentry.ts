import { addBreadcrumb } from "@sentry/nextjs"
import { Middleware } from "../types"

/**
 * Middleware to leave Sentry breadcrumbs for every action to help with debugging
 */
export const sentryBreadcrumbMiddleware: Middleware =
  (next) => (workspace, action) => {
    try {
      addBreadcrumb({
        category: "workspace",
        message: `Action: ${action.type}`,
        level: "info",
        data: {
          actionType: action.type,
          payload: action.payload,
        },
      })
    } catch (error) {
      // Silently fail if Sentry is not available
    }
    return next(workspace, action)
  }
