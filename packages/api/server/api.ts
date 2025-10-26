import { Hono } from "hono"

import { PrismaClient } from "#db"

import type { AssetClient } from "../asset/asset.client.js"
import { addGetAssetRoute, addUploadAssetRoute } from "../asset/asset.route.js"
import { makeProjectApp } from "../project/project.route.js"
import type { AppEnv, PublicApp } from "../types.js"
import { makeRequestContextMiddleware } from "./context.js"
import { makeHealthApp } from "./health.js"

export function makeApiApp(
  appEnv: AppEnv,
  prisma: PrismaClient,
  assetClient: AssetClient,
): PublicApp {
  const app: PublicApp = new Hono()

  app.use(makeRequestContextMiddleware(appEnv, prisma, assetClient))

  app.route("/projects", makeProjectApp())

  addUploadAssetRoute(app)

  addGetAssetRoute(app)

  return app
}
