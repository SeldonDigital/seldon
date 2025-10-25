import { Buffer, File } from "node:buffer"
import { randomUUID } from "node:crypto"

import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3"
import { fileTypeFromBuffer } from "file-type"
import * as mime from "mime-types"

import { logger } from "../logger.js"
import type { AppEnv } from "../types.js"
import type { UploadResponse } from "./asset.type.js"

export class AssetClient {
  #client: S3Client
  #bucket: string

  /**
   * The host to retrive the asset from. May or may not be same as API.
   * Explicitly set to public modifier.
   */
  public assetHost: string

  constructor(appEnv: AppEnv) {
    const r2Client = new S3Client({
      region: "auto",
      endpoint: appEnv.r2Url,
      credentials: {
        accessKeyId: appEnv.cfAccessKey,
        secretAccessKey: appEnv.cfSecretAccessKey,
      },
    })

    this.#client = r2Client
    this.#bucket = appEnv.r2Bucket
    this.assetHost = appEnv.apiURL
  }

  async getContent(assetId: string) {
    const getObjectCommand = new GetObjectCommand({
      Bucket: this.#bucket,
      Key: assetId,
    })

    // Get the object from R2
    const response = await this.#client.send(getObjectCommand)

    if (!response.Body) {
      return null
    }

    return {
      Body: response.Body,
      ContentType: response.ContentType,
    }
  }

  async uploadFile(
    projectId: string,
    content: Buffer,
    contentType: string,
    metadata: Record<string, string> = {},
  ): Promise<UploadResponse> {
    const assetId = randomUUID()

    const putObjectCommand = new PutObjectCommand({
      Bucket: this.#bucket,
      Key: assetId,
      Body: content,
      ContentType: contentType,
      Metadata: {
        ...metadata,
        projectId,
      },
    })

    await this.#client.send(putObjectCommand)

    const url = new URL(`/assets/${assetId}/file`, this.assetHost)

    return {
      assetId,
      contentType,
      url: url.toString(),
    }
  }

  async uploadImage(
    directory: string,
    file: File,
    metadata: Record<string, string> = {},
  ) {
    const content = await file.arrayBuffer()
    const fileType = await fileTypeFromBuffer(content)

    if (!fileType?.mime.startsWith("image")) {
      return null
    }

    const contentType = file.type

    return this.uploadFile(
      directory,
      Buffer.from(content),
      contentType,
      metadata,
    )
  }

  stop() {
    return this.#client.destroy()
  }
}

export function fromBase64Image(content: string): File {
  // Extract MIME type from Base64 data URI
  const mimeMatch = content.match(/^data:(image\/[a-zA-Z]+);base64,/)

  const contentType = mimeMatch ? mimeMatch[1] : "application/octet-stream"
  const buffer = Buffer.from(content.split(",")[1], "base64")

  return new File([buffer], "image", {
    type: contentType,
  })
}

export async function fromUrl(fileUrl: string): Promise<File | null> {
  // Fetch the asset and determine MIME type from headers or extension
  const response = await fetch(fileUrl)

  if (!response.ok) {
    logger.error(`Error fetching asset not okay: ${fileUrl}`)

    return null
  }

  // Due to Node and Web API Buffer differences
  const blob = (await response.blob()) as unknown as Buffer

  // Convert blob to file
  const fileName = fileUrl.split("/").pop() || "image"

  const file = new File([blob], fileName, {
    type:
      response.headers.get("Content-Type") ||
      mime.lookup(fileUrl) ||
      "application/octet-stream",
  })

  return file
}
