import { motion } from "framer-motion"
import LetterRenderer from "../LetterRenderer"

export default function PaperReveal({
  letter,
  styleTokens,
  reducedMotion,
  translateY = 0,
}) {
  const duration = reducedMotion ? 0.2 : 1.35

  return (
    <motion.div
      className="reading-paper-reveal"
      initial={false}
      animate={{ y: translateY }}
      transition={{ duration, ease: "easeInOut" }}
      style={{
        transformOrigin: "top center",
        pointerEvents: "auto",
      }}
    >
      <div
        className="reading-paper-sheet"
        style={{
          ...styleTokens.containerStyle,
          color: styleTokens.text,
          fontFamily: styleTokens.fontFamily,
          padding: "3rem 3.5rem",
          boxSizing: "border-box",
        }}
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
      </div>
    </motion.div>
  )
}
