import { Hono } from "hono"

import type { AppEnv, PublicApp } from "../types.js"

export function makeHealthApp() {
  const app: PublicApp = new Hono()

  app.get("/", async (c) => {
    return c.json({
      ok: true,
      servedAt: new Date(),
    })
  })

  return app
}
