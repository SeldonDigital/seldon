import { File } from "node:buffer"

import type { AssetContent, NewAssetResult } from "#shared/asset.type.js"

import type { RequestContext } from "../types.js"
import * as repo from "./asset.repo.js"

export async function getAssetContent(
  ctx: RequestContext,
  assetId: string,
): Promise<AssetContent | null> {
  const { assetClient } = ctx

  const assetContent = await assetClient.getContent(assetId)

  if (!assetContent) {
    return null
  }

  return {
    Body: assetContent.Body as ReadableStream,
    ContentType: assetContent.ContentType || "application/octet-stream",
  }
}

export async function uploadUserAsset(
  ctx: RequestContext,
  projectId: string,
  file: File,
): Promise<NewAssetResult | null> {
  const { assetClient, prisma } = ctx

  const result = await assetClient.uploadFile(
    projectId,
    Buffer.from(await file.arrayBuffer()),
    file.type,
    {
      uploadedBy: "user",
    },
  )

  await repo.createAsset(prisma, result.assetId, projectId, result.contentType)

  return {
    ...result,
    projectId,
  }
}
