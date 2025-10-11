export type AssetContent = {
  Body: ReadableStream
  ContentType: string
}

export type NewAssetResult = {
  assetId: string
  projectId: string
  contentType: string
  url: string
}

export type UploadResponse = {
  assetId: string
  contentType: string
  url: string
}
