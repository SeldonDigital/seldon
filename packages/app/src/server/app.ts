import { type ServerType, serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"

import type { AppEnv } from "../types.js"

export function makeApp(_appEnv: AppEnv) {
  const app = new Hono()

  app.use(logger())

  // Set Vary header for CORS preflight requests
  app.use(async (c, next) => {
    await next()

    if (c.req.method === "OPTIONS") {
      c.header("Vary", "Origin")
    }
  })

  app.use(
    cors({
      origin: "*",
      maxAge: 7200,
      allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
      allowHeaders: ["Content-Type", "Authorization"],
      exposeHeaders: [],
    }),
  )

  return app
}

/**
 * Start listening on the specified port on Node.js runtime.
 */
export async function startApp(app: Hono, appEnv: AppEnv): Promise<ServerType> {
  const { port } = appEnv

  const awaited = new Promise<ServerType>((resolve) => {
    const server = serve(
      {
        fetch: app.fetch,
        port,
      },
      (_info) => {
        resolve(server)
      },
    )

    // Handle SIGINT for graceful shutdown
    process.on("SIGINT", () => {
      server.close(() => {
        console.log("Server closed")
        process.exit(0)
      })
    })
  })

  return awaited
}
