import tailwindScrollbar from "tailwind-scrollbar"
import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const config: Config = {
  content: ["./packages/editor/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    fontFamily: {
      sans: [
        '"SF Pro", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      ],
    },
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
      sm: ["0.8125rem", { lineHeight: "normal" }], // 13px
      base: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
      lg: ["1rem", { lineHeight: "1.5rem" }], // 16px
      xl: ["1.125rem", { lineHeight: "1.75rem" }], // 18px
      "2xl": ["1.25rem", { lineHeight: "1.75rem" }], // 20px
      "3xl": ["1.5rem", { lineHeight: "1.75rem" }], // 24px
      "4xl": ["2rem", { lineHeight: "2.5rem" }], // 32px
      "5xl": ["2.5rem", { lineHeight: "3rem" }], // 40px
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      borderWidth: {
        thin: "0.5px",
      },
      textShadow: {
        "dieter-rams-text": "0px -1px 0px rgba(0, 0, 0, 0.35)",
      },
      boxShadow: {
        "dieter-rams-button":
          "0px 1px 0px 0px rgba(255,255,255,0.25) inset, 0px 1px 1px 0px rgba(0,0,0,0.25)",
      },
      animation: {
        "flash-expandable-list-item":
          "flash-expandable-list-item .25s .3s linear forwards",
        "spin-fast": "spin 0.6s linear infinite",
        "fade-in-from-top": "fade-in-from-top 100ms forwards",
        "open-collapsible": "open-collapsible 100ms forwards",
        "close-collapsible": "close-collapsible 100ms forwards",
        "jump-in": "jump-in 0.5s ease-out",
      },
      keyframes: {
        "flash-expandable-list-item": {
          "0%": { background: "rgb(255 255 255 / 0)" },
          "50%": { background: "rgb(255 255 255 / 0.25)" },
          "100%": { background: "rgb(255 255 255 / 0)" },
        },
        "fade-in-from-top": {
          "0%": {
            opacity: "0",
            transform: "translateY(-0.25rem)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "show-chat-loader": {
          "0%": {
            height: "0",
          },
          "100%": {
            height: "56px",
          },
        },
        "open-collapsible": {
          "0%": {
            height: "0",
            opacity: "0",
            transform: "translateY(-0.25rem)",
          },
          "30%": {
            height: "var(--radix-collapsible-content-height)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "close-collapsible": {
          "0%": {
            height: "var(--radix-collapsible-content-height)",
            opacity: "1",
            transform: "translateY(0)",
          },
          "100%": {
            height: "0",
            opacity: "0",
            transform: "translateY(-0.25rem)",
          },
        },
        "jump-in": {
          "0%": { transform: "rotate(-90deg) scale(0)", opacity: "0" },
          "50%": { transform: "rotate(-45deg) scale(1.1)" },
          "100%": { transform: "rotate(0deg) scale(1)", opacity: "1" },
        },
      },
      colors: {
        pearl: "#F5F5F5",
        gray: "#333333",
        charcoal: "#262626",
        red: "#FF4F4F",
        green: "#45E66D",
        blue: "#3FB5FF",
        cyan: "#00FFFF",
        magenta: "#FF00FF",
        yellow: "#EBEB00",
        background: "#1F1F1F",
        canvas: "#141414",
        "tldraw-background": "#101011",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") },
      )
    }),
    tailwindScrollbar({
      preferredStrategy: "pseudoelements",
      nocompatible: true,
    }),
  ],
}
export default config
