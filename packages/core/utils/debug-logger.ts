/**
 * Debug logger utility for Seldon system debugging.
 *
 * In the baseline app, logs stay local:
 * - browser code logs to the browser console
 * - server code logs to the terminal
 *
 * Debug mode can be enabled via the editor Help menu or with DEBUG_MODE=true.
 */

const SEPARATOR = "**********"

type DebugPayload = Record<string, unknown> | unknown

/**
 * Read a boolean flag from the persisted debug-mode state.
 *
 * Client-side: reads the named flag from localStorage.
 * Server-side: falls back to DEBUG_MODE in the environment.
 */
function isDebugFlagEnabled(flag: string): boolean {
  if (typeof window !== "undefined") {
    try {
      const debugMode = localStorage.getItem("debug-mode")
      if (debugMode) {
        const parsed = JSON.parse(debugMode)
        return parsed?.state?.[flag] === true
      }
    } catch {
      // Ignore malformed persisted values and fall through.
    }
  }

  return process.env.DEBUG_MODE === "true"
}

/**
 * Check if verbose structured logging is enabled.
 *
 * Client-side: checks the persisted verboseLogging flag.
 * Server-side: checks DEBUG_MODE in the environment.
 */
export function isDebugEnabled(): boolean {
  return isDebugFlagEnabled("verboseLogging")
}

/**
 * Check if workspace verification logging is enabled.
 *
 * Client-side: checks the persisted workspaceLogging flag.
 * Server-side: checks DEBUG_MODE in the environment.
 */
export function isWorkspaceLoggingEnabled(): boolean {
  return isDebugFlagEnabled("workspaceLogging")
}

/**
 * Get emoji for category
 */
function getCategoryEmoji(category: string): string {
  switch (category) {
    case "Schema":
      return "✏️"
    case "Workspace":
      return "🔧"
    case "Factory":
      return "🚚"
    default:
      return ""
  }
}

/**
 * Format a log message with category and function name
 */
function formatMessage(
  category: string,
  functionName: string,
  message: string,
  isGroupStart: boolean = false,
  isGroupEnd: boolean = false,
): string {
  const emoji = getCategoryEmoji(category)
  const tripleEmoji = emoji ? `${emoji} ${emoji} ${emoji}` : ""

  if (isGroupStart) {
    return `${tripleEmoji}  ${functionName}: ${message}  ${tripleEmoji}`
  }

  if (isGroupEnd) {
    return `${tripleEmoji}  ${functionName} · ${message}  ${tripleEmoji}`
  }

  // Regular logs inside a group use arrow right (or puppy face emoji for verificationMiddleware)
  if (functionName === "verificationMiddleware") {
    return `🐶 ${functionName} · ${message}`
  }
  return `➡️  ${functionName} · ${message}`
}

/**
 * Format data object for display
 * Removes outer braces and adds proper spacing
 */
function formatData(data?: any): string {
  if (data === undefined) return ""

  if (typeof data === "object" && data !== null) {
    try {
      return "\n" + JSON.stringify(data, null, 2)
    } catch {
      return ` ${String(data)}`
    }
  }

  return ` ${String(data)}`
}

/**
 * Main logging function
 *
 * Client-side: writes to the browser console
 * Server-side: writes to the terminal
 *
 * @param category - Category name (Schema, Workspace, Factory)
 * @param functionName - Name of the function generating the log
 * @param message - Log message
 * @param data - Optional data object to include
 */
export function debugLog(
  category: string,
  functionName: string,
  message: string,
  data?: DebugPayload,
): void {
  if (!isDebugEnabled()) return
  const formattedMessage = formatMessage(category, functionName, message)
  const formattedData = formatData(data)
  console.log(formattedMessage + formattedData)

  // Add blank line after log entry if there's data
  if (data) {
    console.log("")
  }
}

/**
 * Start a grouped log section
 *
 * Client-side: writes to the browser console
 * Server-side: writes to the terminal
 *
 * @param category - Category name (Schema, Workspace, Factory)
 * @param functionName - Name of the function generating the log
 * @param title - Title for the group
 */
export function debugGroup(
  category: string,
  functionName: string,
  title: string,
): void {
  if (!isDebugEnabled()) return
  console.log("") // Blank line before group start
  const formattedMessage = formatMessage(
    category,
    functionName,
    title,
    true,
    false,
  )
  console.log(formattedMessage)
  console.log("") // Blank line after group start
}

/**
 * End a grouped log section with separator
 *
 * Client-side: writes to the browser console
 * Server-side: writes to the terminal
 *
 * @param category - Category name (Schema, Workspace, Factory)
 * @param functionName - Name of the function generating the log
 * @param message - Completion message (optional)
 */
export function debugGroupEnd(
  category?: string,
  functionName?: string,
  message?: string,
): void {
  if (!isDebugEnabled()) return
  console.log("") // Blank line before group end
  if (category && functionName && message) {
    const formattedMessage = formatMessage(
      category,
      functionName,
      message,
      false,
      true,
    )
    console.log(formattedMessage)
  } else {
    console.log(SEPARATOR)
  }
  console.log("") // Blank line after group end
}

/**
 * Kept for API compatibility with older callers.
 */
export function flushDebugLogs(): void {
  // No-op in the browser-only baseline.
}

/**
 * Quick test function to verify debug logger is working
 *
 * Client-side: call from the browser console: window.testDebugLogger()
 * Server-side: import and call: testDebugLogger()
 *
 * All logs will appear in the terminal (server console)
 */
export function testDebugLogger(): void {
  const enabled = isDebugEnabled()
  const isBrowser = typeof window !== "undefined"

  console.log("=== Debug Logger Test ===")
  console.log(
    `Environment: ${isBrowser ? "Browser console" : "Server terminal"}`,
  )
  console.log(`Debug mode enabled: ${enabled}`)

  if (isBrowser) {
    const debugMode = localStorage.getItem("debug-mode")
    console.log(`localStorage['debug-mode']: ${debugMode}`)
    if (debugMode) {
      try {
        const parsed = JSON.parse(debugMode)
        console.log("Parsed debug mode:", parsed)
        console.log(`parsed.state.enabled: ${parsed?.state?.enabled}`)
      } catch (e) {
        console.error("Failed to parse:", e)
      }
    }
  } else {
    console.log(`DEBUG_MODE env var: ${process.env.DEBUG_MODE}`)
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  }

  debugGroup("Test", "testDebugLogger", "Testing debug logger")
  debugLog("Test", "testDebugLogger", "This is a test message")
  debugLog("Test", "testDebugLogger", "This is a test with data", {
    test: true,
    number: 42,
    nested: { value: "test" },
  })
  debugGroupEnd("Test", "testDebugLogger", "Test complete")

  console.log("=== Test Complete ===")
  if (enabled) {
    console.log("Debug logger is working.")
  } else {
    if (isBrowser) {
      console.log("Debug logger is disabled. Enable it via Help > Enable Debug Mode.")
    } else {
      console.log("Debug logger is disabled. Enable it with DEBUG_MODE=true.")
      console.log("Example: DEBUG_MODE=true npm run dev")
    }
  }
}

if (typeof window !== "undefined") {
  ;(window as Window & { testDebugLogger?: () => void }).testDebugLogger =
    testDebugLogger
}
