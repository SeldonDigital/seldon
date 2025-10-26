export interface AssetContent {
  Body: ReadableStream
  ContentType: string
}

export interface NewAssetResult {
  assetId: string
  projectId: string
  contentType: string
  url: string
}

export interface UploadResponse {
  assetId: string
  contentType: string
  url: string
}
