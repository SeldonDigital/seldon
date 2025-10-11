import { LogLevels, consola } from "consola"

export const logger = {
  init() {
    consola.level =
      process.env.NODE_ENV === "development" ? LogLevels.debug : LogLevels.info
  },
  debug(...messages: any[]) {
    const joined = messages
      .map((message) => formatLogMessage(message))
      .join(" ")

    consola.debug(formatLogMessage(joined))
  },

  info(message: any) {
    consola.info(formatLogMessage(message))
  },

  error(message: any) {
    consola.error(formatLogMessage(message))
  },
}

function formatLogMessage(message: unknown): string {
  if (message instanceof Error) {
    return `${message.name}: ${message.message} | ${message.stack?.replace(/\n/g, " | ")}`
  }

  if (typeof message === "object") {
    return JSON.stringify(message)
  }

  return String(message).replace(/\n/g, " | ")
}
