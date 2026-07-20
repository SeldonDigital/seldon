import App from "@app/App.vue"
import { router } from "@app/router"
import { configureWorkspaceStore } from "@seldon/editor/lib/storage/workspace-store"
import { createPinia } from "pinia"
import { createApp } from "vue"

import "@app/globals.css"
import "@app/editor-chrome.css"

// Stamp saved workspaces as written by the Vue editor for cross-editor drift
// debugging. The shared store defaults to "react" otherwise.
configureWorkspaceStore("vue")

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount("#app")
