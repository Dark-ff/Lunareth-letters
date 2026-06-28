import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function PasswordPrompt({
  visible,
  onSubmit,
  onDismiss,
  isVerifying,
  errorMessage,
  styleTokens,
  reducedMotion,
}) {
  const inputRef = useRef(null)

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus()
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="reading-password-panel"
          role="dialog"
          aria-labelledby="reading-password-title"
          aria-describedby="reading-password-body"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.96 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.45, ease: "easeOut" }}
          style={{
            borderColor: styleTokens.border,
            background: styleTokens.panelBg,
            color: styleTokens.text,
            boxShadow: styleTokens.panelShadow,
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation()
              onDismiss()
            }
          }}
        >
          <p
            id="reading-password-title"
            className="reading-password-title"
            style={{ color: styleTokens.accent }}
          >
            Unseal this letter
          </p>

          <p
            id="reading-password-body"
            className="reading-password-body"
            style={{ color: styleTokens.subtext }}
          >
            This letter was sealed by its author.
            <br />
            Enter the password to continue.
          </p>

          <form
            className="reading-password-form"
            onSubmit={(event) => {
              event.preventDefault()
              if (isVerifying) return
              onSubmit(inputRef.current?.value ?? "")
            }}
          >
            <input
              ref={inputRef}
              type="password"
              autoComplete="off"
              aria-invalid={Boolean(errorMessage)}
              disabled={isVerifying}
              className="reading-password-input"
              style={{
                background: styleTokens.inputBg,
                color: styleTokens.text,
                borderColor: errorMessage ? "var(--reading-seal-crimson)" : styleTokens.border,
              }}
            />

            {errorMessage && (
              <p className="reading-password-error" role="status">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying}
              className="reading-password-submit"
              style={{
                borderColor: styleTokens.accent,
                color: styleTokens.accent,
              }}
            >
              {isVerifying ? "Unsealing..." : "Unseal"}
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
