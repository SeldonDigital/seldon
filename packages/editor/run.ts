import "./globals.css"

import { createElement } from "react"
import { createRoot } from "react-dom/client"

import { App } from "./app/App"

export function run() {
  const domElm = document.createElement("div")
  const root = createRoot(domElm)

  domElm.className = "root"
  document.body.appendChild(domElm)

  root.render(createElement(App))
}

run()
