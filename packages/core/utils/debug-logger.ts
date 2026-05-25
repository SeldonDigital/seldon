/**
 * Debug logger utility for Seldon system debugging
 *
 * Provides structured logging with categories and function names.
 * ALL logs appear in the terminal (server console) for unified debugging.
 *
 * Client-side: Logs are sent to the server via API endpoint
 * Server-side: Logs are written directly to terminal
 *
 * To enable debugging:
 *   - Toggle "Enable Debug Mode" in the Help menu (client-side)
 *   - Set DEBUG_MODE=true in your .env file (server-side)
 *   - Or run: DEBUG_MODE=true npm run dev
 */

const SEPARATOR = "**********"
const LOG_API_ENDPOINT = "/api/debug/log"
const BATCH_SIZE = 10
const BATCH_TIMEOUT = 100 // ms

// Server-side debug mode flag (can be set from API requests)
let serverDebugModeEnabled: boolean | null = null

// Log batching for client-side
let logQueue: Array<{
  category: string
  functionName: string
  message: string
  data?: any
  type: "log" | "group" | "groupEnd"
  timestamp: number
}> = []
let batchTimeout: ReturnType<typeof setTimeout> | null = null

/**
 * Set debug mode for server-side operations
 * Called from API routes when debug mode is passed from client
 */
export function setServerDebugMode(enabled: boolean): void {
  serverDebugModeEnabled = enabled
}

/**
 * Check if debug mode is enabled
 *
 * Client-side: Checks localStorage for 'debug-mode' key set by React Zustand store
 * Server-side: Checks serverDebugModeEnabled flag (set from API requests), then DEBUG_MODE environment variable
 *
 * Zustand persist stores data as: { state: { enabled: boolean }, version: number }
 */
export function isDebugEnabled(): boolean {
  // Browser/client-side: Check localStorage
  if (typeof window !== "undefined") {
    try {
      const debugMode = localStorage.getItem("debug-mode")
      if (debugMode) {
        const parsed = JSON.parse(debugMode)
        // Zustand persist format: { state: { enabled: true }, version: 0 }
        return parsed?.state?.enabled === true
      }
    } catch (error) {
      // If parsing fails, fall back to environment variable check
    }
  }

  // Server-side/Node.js: Check serverDebugModeEnabled flag first (set from API requests)
  if (serverDebugModeEnabled !== null) {
    return serverDebugModeEnabled
  }

  // Fallback to environment variable
  if (process.env.DEBUG_MODE === "true") {
    return true
  }

  // No fallback to development mode - only enable when explicitly set
  return false
}

/**
 * Send batched logs to server (client-side only)
 */
async function flushLogQueue(): Promise<void> {
  if (logQueue.length === 0) return

  const logsToSend = [...logQueue]
  logQueue = []
  batchTimeout = null

  try {
    await fetch(LOG_API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ logs: logsToSend }),
    })
  } catch (error) {
    // Silently fail - don't break the app if logging fails
    if (process.env.NODE_ENV === "development") {
      console.error("[debug-logger] Failed to send logs to server:", error)
    }
  }
}

/**
 * Queue a log for batching (client-side only)
 */
function queueLog(
  category: string,
  functionName: string,
  message: string,
  data?: any,
  type: "log" | "group" | "groupEnd" = "log",
): void {
  if (!isDebugEnabled()) return

  logQueue.push({
    category,
    functionName,
    message,
    data,
    type,
    timestamp: Date.now(),
  })

  // Flush if batch is full
  if (logQueue.length >= BATCH_SIZE) {
    if (batchTimeout) {
      clearTimeout(batchTimeout)
      batchTimeout = null
    }
    flushLogQueue()
  } else if (!batchTimeout) {
    // Schedule flush after timeout
    batchTimeout = setTimeout(flushLogQueue, BATCH_TIMEOUT)
  }
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
  if (!data) return ""

  if (typeof data === "object") {
    try {
      const jsonString = JSON.stringify(data, null, 2)
      // Remove outer braces and format with proper indentation
      const lines = jsonString.split("\n")
      if (lines.length > 2) {
        // Remove first line (opening brace) and last line (closing brace)
        const content = lines.slice(1, -1).join("\n")
        return "\n" + content
      }
      return "\n" + jsonString
    } catch {
      return ` ${String(data)}`
    }
  }

  return ` ${String(data)}`
}

/**
 * Main logging function
 *
 * Client-side: Queues logs to be sent to server (appears in terminal)
 * Server-side: Writes directly to terminal
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
  data?: any,
): void {
  if (!isDebugEnabled()) return

  // Client-side: Queue log to be sent to server
  if (typeof window !== "undefined") {
    queueLog(category, functionName, message, data, "log")
    return
  }

  // Server-side: Write directly to terminal
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
 * Client-side: Queues log to be sent to server (appears in terminal)
 * Server-side: Writes directly to terminal
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

  // Client-side: Queue log to be sent to server
  if (typeof window !== "undefined") {
    queueLog(category, functionName, title, undefined, "group")
    return
  }

  // Server-side: Write directly to terminal
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
 * Client-side: Queues log to be sent to server (appears in terminal)
 * Server-side: Writes directly to terminal
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

  // Client-side: Queue log to be sent to server
  if (typeof window !== "undefined") {
    queueLog(
      category || "",
      functionName || "",
      message || "Complete",
      undefined,
      "groupEnd",
    )
    return
  }

  // Server-side: Write directly to terminal
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
 * Flush any pending logs (useful for cleanup or before page unload)
 */
export function flushDebugLogs(): void {
  if (typeof window !== "undefined" && batchTimeout) {
    clearTimeout(batchTimeout)
    batchTimeout = null
    flushLogQueue()
  }
}

// Flush logs on page unload (client-side only)
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", flushDebugLogs)
}

/**
 * Quick test function to verify debug logger is working
 *
 * Client-side: Call from browser console: window.testDebugLogger()
 * Server-side: Import and call: testDebugLogger()
 *
 * All logs will appear in the terminal (server console)
 */
export function testDebugLogger(): void {
  const enabled = isDebugEnabled()
  const isBrowser = typeof window !== "undefined"

  // Use regular console.log for test output (not debug logger)
  console.log("=== Debug Logger Test ===")
  console.log(
    `Environment: ${isBrowser ? "Browser (logs sent to terminal)" : "Server (logs in terminal)"}`,
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
    console.log(
      "Note: Debug logs will appear in the terminal where the server is running",
    )
  } else {
    console.log(`DEBUG_MODE env var: ${process.env.DEBUG_MODE}`)
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`)
  }

  // Test the debug logger functions
  debugGroup("Test", "testDebugLogger", "Testing debug logger")
  debugLog("Test", "testDebugLogger", "This is a test message")
  debugLog("Test", "testDebugLogger", "This is a test with data", {
    test: true,
    number: 42,
    nested: { value: "test" },
  })
  debugGroupEnd("Test", "testDebugLogger", "Test complete")

  // Flush any pending logs (client-side)
  if (isBrowser) {
    flushDebugLogs()
  }

  console.log("=== Test Complete ===")
  if (enabled) {
    console.log(
      "✅ Debug logger is working! Check the terminal for debug messages above.",
    )
  } else {
    if (isBrowser) {
      console.log(
        "❌ Debug logger is disabled. Enable it via: Help > Enable Debug Mode",
      )
    } else {
      console.log(
        "❌ Debug logger is disabled. Enable it by setting: DEBUG_MODE=true",
      )
      console.log("   Example: DEBUG_MODE=true npm run dev")
    }
  }
}

// Make test function available globally in browser
if (typeof window !== "undefined") {
  ;(window as any).testDebugLogger = testDebugLogger
}
