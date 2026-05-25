import { describe, expect, test } from "bun:test"
import { formatRelativeTime } from "./date"

describe("formatRelativeTime", () => {
  // Helper function to create a date relative to now
  function createRelativeDate(msOffset: number): Date {
    return new Date(Date.now() + msOffset)
  }

  const testCases = [
    // Just now (less than 5 minutes)
    { msAgo: 1 * 60 * 1000, expectedText: "Just now" },
    { msAgo: 2 * 60 * 1000, expectedText: "Just now" },
    { msAgo: 3 * 60 * 1000, expectedText: "Just now" },
    { msAgo: 4 * 60 * 1000, expectedText: "Just now" },
    { msAgo: 4.9 * 60 * 1000, expectedText: "Just now" },

    // Minutes ago (5-59 minutes)
    { msAgo: 5 * 60 * 1000, expectedText: "5 minutes ago" },
    { msAgo: 15 * 60 * 1000, expectedText: "15 minutes ago" },
    { msAgo: 30 * 60 * 1000, expectedText: "30 minutes ago" },
    { msAgo: 45 * 60 * 1000, expectedText: "45 minutes ago" },
    { msAgo: 59 * 60 * 1000, expectedText: "59 minutes ago" },

    // Hours ago (1-23 hours)
    { msAgo: 1 * 60 * 60 * 1000, expectedText: "1 hour ago" },
    { msAgo: 6 * 60 * 60 * 1000, expectedText: "6 hours ago" },
    { msAgo: 12 * 60 * 60 * 1000, expectedText: "12 hours ago" },
    { msAgo: 18 * 60 * 60 * 1000, expectedText: "18 hours ago" },
    { msAgo: 23 * 60 * 60 * 1000, expectedText: "23 hours ago" },

    // Days ago (1-29 days)
    { msAgo: 1 * 24 * 60 * 60 * 1000, expectedText: "1 day ago" },
    { msAgo: 7 * 24 * 60 * 60 * 1000, expectedText: "7 days ago" },
    { msAgo: 14 * 24 * 60 * 60 * 1000, expectedText: "14 days ago" },
    { msAgo: 21 * 24 * 60 * 60 * 1000, expectedText: "21 days ago" },
    { msAgo: 29 * 24 * 60 * 60 * 1000, expectedText: "29 days ago" },
  ]

  testCases.forEach(({ msAgo, expectedText }) => {
    test(`should return "${expectedText}" for ${msAgo / 1000 / 60} minutes ago`, () => {
      const date = createRelativeDate(-msAgo)
      expect(formatRelativeTime(date)).toBe(expectedText)
    })
  })

  describe("long format (30+ days)", () => {
    test("should return formatted date for 30 days ago", () => {
      const date = createRelativeDate(-30 * 24 * 60 * 60 * 1000)
      const result = formatRelativeTime(date)

      // Should match format like "December 15, 2023"
      expect(result).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/)
    })

    test("should return formatted date for 60 days ago", () => {
      const date = createRelativeDate(-60 * 24 * 60 * 60 * 1000)
      const result = formatRelativeTime(date)

      expect(result).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/)
    })

    test("should return formatted date for 1 year ago", () => {
      const date = createRelativeDate(-365 * 24 * 60 * 60 * 1000)
      const result = formatRelativeTime(date)

      expect(result).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/)
    })
  })

  describe("edge cases", () => {
    test("should handle future dates", () => {
      const futureDate = createRelativeDate(5 * 60 * 1000) // 5 minutes in future
      const result = formatRelativeTime(futureDate)

      // Should return negative relative time or handle gracefully
      expect(typeof result).toBe("string")
    })

    test("should handle very old dates", () => {
      const oldDate = new Date("1900-01-01")
      const result = formatRelativeTime(oldDate)

      expect(result).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/)
    })

    test("should handle current date", () => {
      const now = new Date()
      const result = formatRelativeTime(now)

      expect(result).toBe("Just now")
    })

    test("should handle dates with milliseconds precision", () => {
      const date = new Date(Date.now() - 2.5 * 60 * 1000) // 2.5 minutes ago
      const result = formatRelativeTime(date)

      expect(result).toBe("Just now")
    })

    test("should handle exactly 30 days ago", () => {
      const date = createRelativeDate(-30 * 24 * 60 * 60 * 1000)
      const result = formatRelativeTime(date)
      expect(result).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/)
    })
  })
})
