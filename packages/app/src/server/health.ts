import type { AppEnv, PublicApp } from "../types.js"

export function addRootRoute(app: PublicApp, appEnv: AppEnv) {
  app.get("/", async (c) => {
    return c.json({
      ok: true,
      servedAt: new Date(),
    })
  })

  return app
}
