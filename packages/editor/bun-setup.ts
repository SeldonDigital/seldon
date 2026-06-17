import { GlobalRegistrator } from "@happy-dom/global-registrator"

// Ensure URL constructor is available before registering happy-dom
if (typeof globalThis.URL === "undefined") {
  const { URL } = require("url")
  globalThis.URL = URL
}

GlobalRegistrator.register()
