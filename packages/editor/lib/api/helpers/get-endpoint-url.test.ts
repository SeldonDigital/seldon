import { afterEach, beforeEach, describe, expect, it } from "bun:test"
import { getEndpointUrl } from "./get-endpoint-url"

describe("getEndpointUrl", () => {
  const originalEnv = process.env
  const originalURL = global.URL

  beforeEach(() => {
    // Mock URL constructor
    global.URL = class MockURL {
      href: string
      searchParams: { append: (key: string, value: string) => void }
      constructor(url: string, base?: string) {
        this.href = base ? new URL(url, base).href : url
        this.searchParams = {
          append: (key: string, value: string) => {
            const separator = this.href.includes("?") ? "&" : "?"
            this.href += `${separator}${key}=${value}`
          },
        }
      }
      toString() {
        return this.href
      }
    } as typeof URL
  })

  afterEach(() => {
    process.env = originalEnv
    global.URL = originalURL
  })

  it("should return the correct URL without params", () => {
    process.env.API_URL = "https://api.example.com"
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    const result = getEndpointUrl("/1/users")
    expect(result).toBe("https://api.example.com/1/users")
  })

  it("should use default NEXT_PUBLIC_API_URL if not set", () => {
    delete process.env.API_URL
    delete process.env.NEXT_PUBLIC_API_URL
    try {
      getEndpointUrl("/1/users")
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toInclude("NEXT_PUBLIC_API_URL is not set")
      } else {
        throw new Error("Error should be instance of Error")
      }
    }
  })

  it("should append params correctly", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    const result = getEndpointUrl("/1/users", { id: 1, name: "John" })
    expect(result).toBe("https://api.example.com/1/users?id=1&name=John")
  })

  it("should handle number params", () => {
    process.env.NEXT_PUBLIC_API_URL = "https://api.example.com"
    const result = getEndpointUrl("/1/items", { count: 5 })
    expect(result).toBe("https://api.example.com/1/items?count=5")
  })
})
