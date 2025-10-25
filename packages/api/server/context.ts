import type Cryptr from "cryptr"
import { createMiddleware } from "hono/factory"

import type { PrismaClient } from "#db"

import type { AssetClient } from "../asset/asset.client.js"
import type { AppEnv, RequestContext } from "../types.js"

/**
 * Injects the app context into the request context for each request.
 */
export function makeRequestContextMiddleware(
  env: AppEnv,
  prisma: PrismaClient,
  assetClient: AssetClient,
) {
  return createMiddleware(async function requestContextMiddleware(ctx, next) {
    const context: RequestContext = {
      env,
      prisma,
      assetClient,
    }

    ctx.set("requestContext", context)

    await next()
  })
}
