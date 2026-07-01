import { StrictMode, Suspense, lazy } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter } from "react-router"
import "allotment/dist/style.css"
import { LoadEditorFonts } from "@app/LoadEditorFonts"
import { Providers } from "@app/Providers"
import { Toasts } from "@app/toaster/Toaster"
import { registerDynamicIcons } from "@lib/icons/register-dynamic-icons"
import HomePage from "../app/home/HomePage"
import "../app/globals.css"
import "../app/plex/fonts.css"
import "../app/editor-chrome.css"

// Register editor-only, prop-driven icons so the generated `Icon` can resolve
// their `icon-custom-*` ids from its runtime registry.
registerDynamicIcons()

const EditorPage = lazy(() => import("../app/editor/EditorPage"))

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  {
    path: "/:id",
    element: (
      <Suspense
        fallback={
          <p style={{ padding: "2rem", color: "var(--sdn-swatch-white)" }}>
            Loading…
          </p>
        }
      >
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
