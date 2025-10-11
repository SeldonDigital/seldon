import type { HttpBindings } from "@hono/node-server"
import type { Hono } from "hono"

import type { PrismaClient } from "#db"

import type { AssetClient } from "./asset/asset.client.js"

export interface AppEnv {
  // Application settings
  apiURL: string
  port: number

  // Database
  databaseUrl: string

  // CloudFlare R2 settings
  cfAccessKey: string
  cfSecretAccessKey: string
  r2Url: string
  r2Bucket: string
}

export type AppContext = {
  env: AppEnv

  assetClient: AssetClient
  prisma: PrismaClient
}

export interface PublicRequestContext extends AppContext {}

export type RequestContext = PublicRequestContext

export type PublicAppEnv = {
  Bindings: HttpBindings
  Variables: {
    requestContext: PublicRequestContext
  }
}

export type PublicApp = Hono<PublicAppEnv>
