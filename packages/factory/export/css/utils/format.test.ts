import { describe, expect, it } from "bun:test"
import { format } from "./format"

describe("format", () => {
  it("should format CSS content with Prettier", async () => {
    const unformattedCss = `
    .button{color:#333;padding:16px;margin:8px;}
    .button:hover{color:#666;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(typeof result).toBe("string")
    expect(result).toContain(".button")
    expect(result).toContain("color: #333")
    expect(result).toContain("padding: 16px")
    expect(result).toContain("margin: 8px")
    expect(result).toContain(":hover")
  })

  it("should format CSS with proper indentation", async () => {
    const unformattedCss = `
    .container{display:flex;flex-direction:column;align-items:center;}
    .item{margin:10px;padding:5px;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain(".container")
    expect(result).toContain(".item")
    expect(result).toContain("display: flex")
    expect(result).toContain("flex-direction: column")
    expect(result).toContain("align-items: center")
  })

  it("should handle CSS with media queries", async () => {
    const unformattedCss = `
    @media (max-width: 768px){.container{flex-direction:row;}}
    .button{width:100%;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain("@media")
    expect(result).toContain("max-width: 768px")
    expect(result).toContain(".container")
    expect(result).toContain(".button")
  })

  it("should handle CSS with comments", async () => {
    const unformattedCss = `
    /* Button styles */
    .button{color:#333;/* Primary color */}
    .button:hover{color:#666;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain("/* Button styles */")
    expect(result).toContain("/* Primary color */")
    expect(result).toContain(".button")
    expect(result).toContain(":hover")
  })

  it("should handle CSS with CSS custom properties", async () => {
    const unformattedCss = `
    :root{--primary-color:#333;--secondary-color:#666;}
    .button{color:var(--primary-color);background:var(--secondary-color);}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain(":root")
    expect(result).toContain("--primary-color: #333")
    expect(result).toContain("--secondary-color: #666")
    expect(result).toContain("var(--primary-color)")
    expect(result).toContain("var(--secondary-color)")
  })

  it("should handle empty CSS", async () => {
    const emptyCss = ""

    const result = await format(emptyCss)

    expect(result).toBeDefined()
    expect(result).toBe("")
  })

  it("should handle CSS with only whitespace", async () => {
    const whitespaceCss = "   \n  \t  \n  "

    const result = await format(whitespaceCss)

    expect(result).toBeDefined()
    expect(result.trim()).toBe("")
  })

  it("should handle CSS with complex selectors", async () => {
    const unformattedCss = `
    .container .item:nth-child(2n+1){background:#f0f0f0;}
    .container > .item:first-child{margin-top:0;}
    .container .item:last-child{margin-bottom:0;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain(".container .item:nth-child(2n + 1)")
    expect(result).toContain(".container > .item:first-child")
    expect(result).toContain(".container .item:last-child")
    expect(result).toContain("background: #f0f0f0")
    expect(result).toContain("margin-top: 0")
    expect(result).toContain("margin-bottom: 0")
  })

  it("should handle CSS with keyframes", async () => {
    const unformattedCss = `
    @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
    .fade-in{animation:fadeIn 1s ease-in-out;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain("@keyframes fadeIn")
    expect(result).toContain("from")
    expect(result).toContain("to")
    expect(result).toContain("opacity: 0")
    expect(result).toContain("opacity: 1")
    expect(result).toContain(".fade-in")
    expect(result).toContain("animation: fadeIn 1s ease-in-out")
  })

  it("should handle CSS with imports", async () => {
    const unformattedCss = `
    @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');
    .text{font-family:'Roboto',sans-serif;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain("@import")
    expect(result).toContain(
      'url("https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap")',
    )
    expect(result).toContain(".text")
    expect(result).toContain('font-family: "Roboto", sans-serif')
  })

  it("should handle CSS with calc() functions", async () => {
    const unformattedCss = `
    .container{width:calc(100% - 20px);height:calc(100vh - 40px);}
    .item{margin:calc(10px + 5px);}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain(".container")
    expect(result).toContain("width: calc(100% - 20px)")
    expect(result).toContain("height: calc(100vh - 40px)")
    expect(result).toContain(".item")
    expect(result).toContain("margin: calc(10px + 5px)")
  })

  it("should handle CSS with pseudo-elements", async () => {
    const unformattedCss = `
    .button::before{content:'';position:absolute;top:0;left:0;}
    .button::after{content:'';position:absolute;bottom:0;right:0;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain(".button::before")
    expect(result).toContain(".button::after")
    expect(result).toContain('content: ""')
    expect(result).toContain("position: absolute")
    expect(result).toContain("top: 0")
    expect(result).toContain("left: 0")
    expect(result).toContain("bottom: 0")
    expect(result).toContain("right: 0")
  })

  it("should handle CSS with vendor prefixes", async () => {
    const unformattedCss = `
    .button{-webkit-border-radius:5px;-moz-border-radius:5px;border-radius:5px;}
    .container{-webkit-flex:1;-ms-flex:1;flex:1;}
    `

    const result = await format(unformattedCss)

    expect(result).toBeDefined()
    expect(result).toContain(".button")
    expect(result).toContain("-webkit-border-radius: 5px")
    expect(result).toContain("-moz-border-radius: 5px")
    expect(result).toContain("border-radius: 5px")
    expect(result).toContain(".container")
    expect(result).toContain("-webkit-flex: 1")
    expect(result).toContain("-ms-flex: 1")
    expect(result).toContain("flex: 1")
  })
})
