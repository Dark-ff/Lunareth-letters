import { motion } from "framer-motion"
import LetterRenderer from "../LetterRenderer"

export default function PaperReveal({
  phase,
  letter,
  styleTokens,
  reducedMotion,
}) {
  const isHidden = phase === "hidden"
  const isRising = phase === "rising"
  const isUnfolding = phase === "unfolding"
  const isComplete = phase === "complete"

  const motionDuration = reducedMotion ? 0.2 : 0.65

  return (
    <motion.div
      className="reading-paper-reveal"
      initial={false}
      animate={
        isHidden
          ? { opacity: 0, y: reducedMotion ? 0 : 36, scaleY: reducedMotion ? 1 : 0.72 }
          : isRising
            ? {
                opacity: 1,
                y: reducedMotion ? 0 : -48,
                scaleY: reducedMotion ? 1 : 0.72,
              }
            : isUnfolding || isComplete
              ? { opacity: 1, y: reducedMotion ? 0 : -48, scaleY: 1 }
              : { opacity: 0, y: 36, scaleY: 0.72 }
      }
      transition={{ duration: motionDuration, ease: "easeInOut" }}
      style={{
        transformOrigin: "top center",
        pointerEvents: isComplete ? "auto" : "none",
      }}
    >
      <div
        className="reading-paper-sheet"
        style={{
          ...styleTokens.containerStyle,
          color: styleTokens.text,
          fontFamily: styleTokens.fontFamily,
        }}
      >
        <motion.div
          initial={false}
          animate={{ opacity: isComplete ? 1 : 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.55, ease: "easeOut" }}
          aria-hidden={!isComplete}
        >
          <LetterRenderer
            title={letter.title}
            recipient={letter.recipient}
            message={letter.message}
            memory={letter.memory}
            hope={letter.hope}
            style={letter.style}
            createdAt={letter.createdAt}
            variant="full"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
