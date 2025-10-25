import { Hono } from "hono"

import { PrismaClient } from "#db"

import type { AssetClient } from "../asset/asset.client.js"
import { addGetAssetRoute, addUploadAssetRoute } from "../asset/asset.route.js"
import { makeProjectApp } from "../project/project.route.js"
import type { AppEnv, PublicApp } from "../types.js"
import { makeRequestContextMiddleware } from "./context.js"
import { addRootRoute } from "./health.js"

export function makePublicApp(
  appEnv: AppEnv,
  prisma: PrismaClient,
  assetClient: AssetClient,
): PublicApp {
  const publicApp: PublicApp = new Hono()

  publicApp.use(makeRequestContextMiddleware(appEnv, prisma, assetClient))

  publicApp.route("/projects", makeProjectApp())

  addUploadAssetRoute(publicApp)

  // The health check route
  addRootRoute(publicApp, appEnv)
  addGetAssetRoute(publicApp)

  return publicApp
}
