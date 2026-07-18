/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SELDON_ENABLE_REMOTE_FONTS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
