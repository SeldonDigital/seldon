import "allotment/dist/style.css"
import type { Metadata } from "next"
import { LoadEditorFonts } from "@components/LoadEditorFonts"
import { Toasts } from "@components/toaster/Toaster"
import { Providers } from "./_components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Seldon | Local Editor",
  description: "Local Seldon design editor. Workspaces stay in your browser.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="scrollbar-track-transparent scrollbar-thumb-white/30 scrollbar-thumb-rounded-full"
    >
      <body className="bg-black">
        <LoadEditorFonts />
        <Providers>{children}</Providers>
        <Toasts />
      </body>
    </html>
  )
}
