import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import {
  debugGroup,
  debugGroupEnd,
  debugLog,
  setServerDebugMode,
} from "@seldon/core/utils/debug-logger"

const logEntrySchema = z.object({
  category: z.string(),
  functionName: z.string(),
  message: z.string(),
  data: z.any().optional(),
  type: z.enum(["log", "group", "groupEnd"]),
  timestamp: z.number(),
})

const logRequestSchema = z.object({
  logs: z.array(logEntrySchema),
})

export async function POST(request: NextRequest) {
  try {
    const json = await request.json()
    const { logs } = logRequestSchema.parse(json)

    const isDebugEnabled =
      process.env.DEBUG_MODE === "true" ||
      process.env.NODE_ENV === "development"

    if (!isDebugEnabled) {
      return NextResponse.json({
        success: true,
        message: "Debug mode disabled",
      })
    }

    setServerDebugMode(true)

    for (const log of logs) {
      if (log.type === "group") {
        debugGroup(log.category, log.functionName, log.message)
      } else if (log.type === "groupEnd") {
        debugGroupEnd(log.category, log.functionName, log.message)
      } else {
        debugLog(log.category, log.functionName, log.message, log.data)
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process logs" },
      { status: 400 },
    )
  }
}
