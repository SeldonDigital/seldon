#!/usr/bin/env node
import { runExportCli } from "./run"

runExportCli(process.argv.slice(2)).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
