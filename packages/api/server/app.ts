import { type ServerType, serve } from "@hono/node-server"
import { Hono } from "hono"
import { logger } from "hono/logger"

import type { AppEnv } from "../types.js"

export function makeApp(_appEnv: AppEnv) {
  const app = new Hono()

  app.use(logger())

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
