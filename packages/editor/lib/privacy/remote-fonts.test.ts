import { describe, expect, test } from "bun:test"
import {
  isRemoteFontFamilyCandidate,
  shouldLoadRemoteFont,
  shouldLoadRemoteFonts,
} from "./remote-fonts"

const ENV_KEY = "NEXT_PUBLIC_SELDON_ENABLE_REMOTE_FONTS"

function withRemoteFontsEnv<T>(
  value: string | undefined,
  callback: () => T,
): T {
  const original = process.env[ENV_KEY]
  if (value === undefined) {
    delete process.env[ENV_KEY]
  } else {
    process.env[ENV_KEY] = value
  }

  try {
    return callback()
  } finally {
    if (original === undefined) {
      delete process.env[ENV_KEY]
    } else {
      process.env[ENV_KEY] = original
    }
  }
}

describe("remote font privacy controls", () => {
  test("remote font loading is disabled by default", () => {
    withRemoteFontsEnv(undefined, () => {
      expect(shouldLoadRemoteFonts()).toBe(false)
    })
  })

  test("remote font loading requires an explicit true flag", () => {
    withRemoteFontsEnv("false", () => {
      expect(shouldLoadRemoteFonts()).toBe(false)
    })

    withRemoteFontsEnv("true", () => {
      expect(shouldLoadRemoteFonts()).toBe(true)
    })
  })

  test("font family candidates reject local tokens and generic stacks", () => {
    expect(isRemoteFontFamilyCandidate("@fontFamily.primary")).toBe(false)
    expect(isRemoteFontFamilyCandidate("system-ui")).toBe(false)
    expect(isRemoteFontFamilyCandidate("IBM Plex Sans, sans-serif")).toBe(false)
    expect(isRemoteFontFamilyCandidate("IBM Plex Sans")).toBe(true)
  })

  test("individual fonts load only when enabled and safe", () => {
    withRemoteFontsEnv(undefined, () => {
      expect(shouldLoadRemoteFont("IBM Plex Sans")).toBe(false)
    })

    withRemoteFontsEnv("true", () => {
      expect(shouldLoadRemoteFont("@fontFamily.primary")).toBe(false)
      expect(shouldLoadRemoteFont("IBM Plex Sans")).toBe(true)
    })
  })
})
