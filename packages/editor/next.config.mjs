import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const corePackageRoot = path.join(__dirname, "../core")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@seldon/core", "@seldon/factory"],
  typescript: {
    // Core package has known TS drift; editor paths are validated via `npm run quality`.
    ignoreBuildErrors: true,
  },
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@seldon/core": corePackageRoot,
      "@seldon/factory": path.join(__dirname, "../factory"),
    }
    return config
  },
}

export default nextConfig
