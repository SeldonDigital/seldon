import localFont from "next/font/local"

/**
 * Self-hosted IBM Plex Sans for the editor chrome.
 * Files are vendored under this folder and served by next/font, so no third-party
 * request is made. Licensed under the SIL Open Font License 1.1 (see ./OFL.txt).
 */
export const plexSans = localFont({
  src: [
    { path: "./IBMPlexSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "./IBMPlexSans-Italic.woff2", weight: "400", style: "italic" },
    { path: "./IBMPlexSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "./IBMPlexSans-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./IBMPlexSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-plex-sans",
  display: "swap",
})
