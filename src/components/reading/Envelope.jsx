import { forwardRef } from "react"
import { motion } from "framer-motion"
import WaxSeal from "./WaxSeal"
import PaperReveal from "./PaperReveal"
import { canActivateEnvelope } from "./readingStates"

const Envelope = forwardRef(function Envelope(
  {
    styleTokens,
    experienceState,
    sealState,
    isProtected,
    isShaking,
    isFlapOpen,
    reducedMotion,
    onActivate,
    letter,
    extractionProgress,
    children,
  },
  ref
) {
  const showSeal =
    sealState !== "broken" &&
    experienceState !== "reading" &&
    experienceState !== "skipped"

  const paperTranslateY = reducedMotion ? 0 : 36 + extractionProgress * -400

  return (
    <motion.div
      ref={ref}
      className="reading-envelope-stage"
      initial={
        experienceState === "arriving"
          ? reducedMotion
            ? { opacity: 0 }
            : { opacity: 0, scale: 0.88, y: 24 }
          : false
      }
      animate={
        isShaking && !reducedMotion
          ? { x: [0, -8, 8, -6, 6, 0], opacity: 1, scale: 1, y: 0 }
          : reducedMotion
            ? { opacity: 1, x: 0, scale: 1, y: 0 }
            : {
                opacity: 1,
                scale: 1,
                y: [0, -6, 0],
                x: 0,
              }
      }
      transition={
        isShaking && !reducedMotion
          ? { x: { duration: 0.45, ease: "easeInOut" } }
          : experienceState === "arriving"
            ? reducedMotion
              ? { duration: 0.25 }
              : {
                  opacity: { duration: 0.9, ease: "easeOut" },
                  scale: { duration: 1.1, ease: "easeOut" },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1.1 },
                }
            : {
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }
      }
    >
      <button
        type="button"
        className="reading-envelope-button"
        onClick={() => {
          if (!canActivateEnvelope(experienceState)) return
          onActivate()
        }}
        aria-label={isProtected ? "Unseal this protected letter" : "Open this letter"}
      >
        <div
          className="reading-envelope"
          style={{
            "--reading-envelope-body": styleTokens.body,
            "--reading-envelope-flap": styleTokens.flap,
            "--reading-envelope-shadow": styleTokens.shadow,
            "--reading-envelope-texture": styleTokens.texture,
          }}
        >
          <div className="reading-envelope-body" />

          {/* Paper viewport - physical clipping boundary */}
          <div className="reading-paper-viewport">
            <PaperReveal
              letter={letter}
              styleTokens={styleTokens}
              reducedMotion={reducedMotion}
              translateY={paperTranslateY}
            />
          </div>

          <motion.div
            className="reading-envelope-flap"
            animate={
              isFlapOpen
                ? reducedMotion
                  ? { opacity: 0 }
                  : { rotateX: 168, opacity: 0.35 }
                : { rotateX: 0, opacity: 1 }
            }
            transition={{ duration: reducedMotion ? 0.2 : 0.75, ease: "easeInOut" }}
            style={{ transformOrigin: "top center" }}
          />

          {showSeal && (
            <div className="reading-envelope-seal">
              <WaxSeal
                variant={isProtected ? "moon" : "star"}
                sealState={sealState}
                accent={styleTokens.accent}
                reducedMotion={reducedMotion}
              />
            </div>
          )}

          {children}
        </div>
      </button>
    </motion.div>
  )
})

export default Envelope
