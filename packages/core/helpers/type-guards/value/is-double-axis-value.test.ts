import { describe, expect, it } from "bun:test"
import { isDoubleAxisValue } from "./is-double-axis-value"

describe("isDoubleAxisValue", () => {
  it("should return true for valid double axis values", () => {
    const validValues = [
      "10px 20px",
      "0px 100px",
      "1.5px 2.5px",
      "1rem 2rem",
      "0rem 1.5rem",
      "0.5rem 3rem",
      "50% 75%",
      "0% 100%",
      "25% 50%",
      "10px 2rem",
      "1rem 20px",
      "10px 50%",
      "25% 20px",
      "1rem 50%",
      "25% 2rem",
      "  10px 20px  ",
      "10px  20px",
      " 10px  20px ",
      "10PX 20PX",
      "1REM 2REM",
      "10Px 20pX",
      "0px 0px",
      "0rem 0rem",
      "0% 0%",
      "1.5px 2.5px",
      "0.5rem 1.5rem",
      "12.5% 87.5%",
      "-10px 20px",
      "10px -20px",
      "-1rem -2rem",
      "9999px 10000px",
      "100rem 200rem",
      "99% 100%",
    ]

    validValues.forEach((value) => {
      expect(isDoubleAxisValue(value)).toBe(true)
    })
  })

  it("should return false for invalid double axis values", () => {
    const invalidValues = [
      "10px",
      "1rem",
      "50%",
      "10px 20px 30px",
      "1rem 2rem 3rem 4rem",
      "10px 20px 30px 40px",
      "10em 20em",
      "10vh 20vh",
      "10vw 20vw",
      "10pt 20pt",
      "abc 20px",
      "10px def",
      "abc def",
      "10 20",
      "1.5 2.5",
      "",
      "   ",
      "\t\t",
      "\n\n",
      "10px20px",
      "10px,20px",
      "10px-20px",
      "10px 20px extra",
      "extra 10px 20px",
    ]

    invalidValues.forEach((value) => {
      expect(isDoubleAxisValue(value)).toBe(false)
    })
  })
})
