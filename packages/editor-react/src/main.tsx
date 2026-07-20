import { CSSProperties, StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router"

import "allotment/dist/style.css"

import { LoadEditorFonts } from "@app/LoadEditorFonts"
import { Providers } from "@app/Providers"
import { Toasts } from "@app/toaster/Toaster"

import HomePage from "../app/home/HomePage"

import "../app/globals.css"
import "../app/fonts/plex/fonts.css"
import "../app/editor-chrome.css"
// Side-effect import: registers editor-only, prop-driven `icon-custom-*` icons
// with the generated `Icon`'s runtime registry at load.
import "@app/icons/register-dynamic-icons"

const loadingFallbackStyle: CSSProperties = {
  padding: "2rem",
  color: "var(--sdn-swatch-white)",
}

const EditorPage = lazy(() => import("../app/editor/EditorPage"))

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  {
    path: "/:id",
    element: (
      <Suspense fallback={<p style={loadingFallbackStyle}>Loading…</p>}>
        <EditorPage />
      </Suspense>
    ),
  },
])

const container = document.getElementById("root")
if (!container) {
  throw new Error("Root container #root not found.")
}

createRoot(container).render(
  <StrictMode>
    <Providers>
      <LoadEditorFonts />
      <RouterProvider router={router} />
      <Toasts />
    </Providers>
  </StrictMode>,
)
