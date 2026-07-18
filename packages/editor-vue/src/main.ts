import { createPinia } from "pinia"
import { createApp } from "vue"
import App from "@app/App.vue"
import { router } from "@app/router"
import "@app/globals.css"
import "@app/editor-chrome.css"

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount("#app")
