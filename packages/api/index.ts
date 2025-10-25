import { PrismaPg } from "@prisma/adapter-pg"
import Cryptr from "cryptr"
import { showRoutes } from "hono/dev"

import { PrismaClient } from "#db"

import { AssetClient } from "./asset/asset.client.js"
import { parseEnv } from "./env.js"
import { logger } from "./logger.js"
import { makeApp, startApp } from "./server/app.js"
import { makePublicApp } from "./server/public.js"
import { makeSPAApp } from "./ui/editor.js"

async function main() {
  const appEnv = parseEnv()
  const { port } = appEnv

  logger.init()

  logger.info("Starting API server")

  // Initialize the database connection.
  const adapter = new PrismaPg({ connectionString: appEnv.databaseUrl })
  const prisma = new PrismaClient({
    adapter,
  })
  const assetClient = new AssetClient(appEnv)

  await prisma.$connect()

  // Create the Hono app.
  const app = makeApp(appEnv)

  app.route("/", makePublicApp(appEnv, prisma, assetClient))
  app.route("/", await makeSPAApp(appEnv))

  const server = await startApp(app, appEnv)

  logger.info(`🚀 Started on port: ${port}`)

  process.on("uncaughtException", (err) => {
    // Some errors are thrown by the streams.
    logger.error(err)
  })

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    await prisma.$disconnect()
    assetClient.stop()
    server.close(() => {
      console.log("Server closed")
      process.exit(0)
    })
  })

  process.on("SIGINT", async () => {
    await prisma.$disconnect()
    assetClient.stop()
    server.close(() => {
      console.log("Server closed")
      process.exit(0)
    })
  })

  showRoutes(app, {
    verbose: false,
  })
}

main()
