// BESPOKE-VIEW: animates generated Seldon message components as toasts.
import { motion } from "framer-motion"
import { type CSSProperties } from "react"
import { type ToastIntent } from "./hooks/use-toast-store"
import { MessageError } from "@seldon/components/elements/MessageError"
import { MessageOutcome } from "@seldon/components/elements/MessageOutcome"
import { MessageStatus } from "@seldon/components/elements/MessageStatus"

interface ToastProps {
  intent: ToastIntent
  message: string
}

const toastVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
}

const toastShellStyle: CSSProperties = {
  width: "min(28rem, calc(100vw - 2rem))",
  filter: "drop-shadow(0 10px 18px rgb(0 0 0 / 0.16))",
}

const statusToastStyle: CSSProperties = {
  alignSelf: "stretch",
  backgroundColor: "var(--sdn-swatch-offWhite)",
  borderColor:
    "color-mix(in srgb, var(--sdn-swatch-offBlack) 30%, transparent)",
}

const successIcon = { icon: "material-checkCircle" } as const
const errorIcon = { icon: "material-error" } as const

/** Animated toast card. */
export function Toast({ intent, message }: ToastProps) {
  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={toastShellStyle}
    >
      {renderToastContent(intent, message)}
    </motion.div>
  )
}

function renderToastContent(intent: ToastIntent, message: string) {
  if (intent === "success") {
    return (
      <MessageOutcome
        aria-live="polite"
        icon={successIcon}
        role="status"
        textLabel={{ children: message }}
      />
    )
  }

  if (intent === "error") {
    return (
      <MessageError
        aria-live="assertive"
        buttonSimple={null}
        icon={errorIcon}
        role="alert"
        textDescription={{ children: message }}
      />
    )
  }

  return (
    <MessageStatus
      aria-live="polite"
      icon={null}
      role="status"
      style={statusToastStyle}
      textLabel={{ children: message }}
    />
  )
}
