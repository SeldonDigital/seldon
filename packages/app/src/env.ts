import { z } from "zod"

import type { AppEnv } from "./types.js"

const envDecoder = z.object({
  API_URL: z.string(),
  AI_API_URL: z.string(),

  DATABASE_URL: z.string(),

  R2_ACCESS_KEY_ID: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),
  CLOUDFLARE_ACCOUNT_ID: z.string(),
  R2_BUCKET_NAME: z.string(),
})

export function parseEnv(): AppEnv {
  const parsed = envDecoder.parse(process.env)

  const cfAccountId = parsed.CLOUDFLARE_ACCOUNT_ID
  const r2Url = `https://${cfAccountId}.eu.r2.cloudflarestorage.com`

  return {
    apiURL: parsed.API_URL,
    port: 2300,
    databaseUrl: parsed.DATABASE_URL,

    cfAccessKey: parsed.R2_ACCESS_KEY_ID,
    cfSecretAccessKey: parsed.R2_SECRET_ACCESS_KEY,
    r2Url,
    r2Bucket: parsed.R2_BUCKET_NAME,
  }
}
