import { File } from "node:buffer"

import { z } from "zod"

import type { PublicApp } from "../types.js"
import { getAssetContent, uploadUserAsset } from "./asset.service.js"

export function addGetAssetRoute(app: PublicApp) {
  app.get("/assets/:assetId/file", async (ctx) => {
    const { requestContext } = ctx.var
    const { assetId } = ctx.req.param()

    const asset = await getAssetContent(requestContext, assetId)

    if (!asset) {
      return ctx.text("Asset not found", 404)
    }

    // Set the appropriate Content-Type header
    ctx.header("Content-Type", asset.ContentType)

    // Stream the file content
    return ctx.body(asset.Body as ReadableStream)
  })
}

export function addUploadAssetRoute(app: PublicApp) {
  const bodySchema = z.object({
    projectId: z.string(),
    file: z.instanceof(File),
  })

  app.post("/assets", async (ctx) => {
    const { requestContext } = ctx.var
    const body = await ctx.req.parseBody()

    // Validate the request body
    const { success, error, data } = bodySchema.safeParse(body)

    if (!success) {
      return ctx.text(`Invalid request body: ${error.message}`, 400)
    }

    const response = await uploadUserAsset(
      requestContext,
      data.projectId,
      data.file,
    )

    return ctx.json(response, 201)
  })
}
