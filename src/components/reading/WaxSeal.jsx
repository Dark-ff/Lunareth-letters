import { motion } from "framer-motion"

function StarSeal({ accent }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" style={{ color: accent }}>
      <path
        fill="currentColor"
        d="M12 1.5 14.2 9.8 22.5 12 14.2 14.2 12 22.5 9.8 14.2 1.5 12 9.8 9.8Z"
      />
    </svg>
  )
}

function MoonSeal({ accent }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="28" height="28" style={{ color: accent }}>
      <path
        fill="currentColor"
        d="M15.5 3.5a7.5 7.5 0 1 0 4.2 13.6A9 9 0 1 1 15.5 3.5Z"
      />
    </svg>
  )
}

function SealParticles({ accent, reducedMotion }) {
  if (reducedMotion) return null

  const particles = [
    { x: -18, y: -10, delay: 0 },
    { x: 16, y: -14, delay: 0.05 },
    { x: -8, y: 16, delay: 0.1 },
    { x: 20, y: 8, delay: 0.08 },
    { x: 0, y: -22, delay: 0.03 },
  ]

  return particles.map((particle, index) => (
    <motion.span
      key={index}
      aria-hidden="true"
      className="reading-seal-particle"
      style={{ backgroundColor: accent }}
      initial={{ opacity: 0.8, scale: 1, x: 0, y: 0 }}
      animate={{
        opacity: 0,
        scale: 0.2,
        x: particle.x,
        y: particle.y,
      }}
      transition={{
        duration: 0.7,
        delay: particle.delay,
        ease: "easeOut",
      }}
    />
  ))
}

export default function WaxSeal({
  variant = "star",
  sealState,
  accent,
  reducedMotion = false,
}) {
  const isBroken = sealState === "broken" || sealState === "breaking"
  const glowColor =
    sealState === "glow-crimson"
      ? "var(--reading-seal-crimson)"
      : sealState === "glow-lilac" || sealState === "sparkle"
        ? accent
        : "transparent"

  const sealClassName = [
    "reading-wax-seal",
    sealState === "sparkle" ? "reading-wax-seal--sparkle" : "",
    sealState === "glow-crimson" ? "reading-wax-seal--crimson" : "",
    sealState === "glow-lilac" ? "reading-wax-seal--lilac" : "",
    isBroken ? "reading-wax-seal--broken" : "",
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <div className="reading-wax-seal-wrap">
      {sealState === "breaking" && (
        <SealParticles accent={accent} reducedMotion={reducedMotion} />
      )}

      <motion.div
        className={sealClassName}
        style={{
          "--reading-seal-glow": glowColor,
          borderColor: accent,
          color: accent,
        }}
        animate={
          reducedMotion
            ? { opacity: isBroken ? 0 : 1 }
            : {
                scale: sealState === "sparkle" ? [1, 1.08, 1] : 1,
                rotate: isBroken ? 8 : 0,
                opacity: isBroken ? 0 : 1,
              }
        }
        transition={{
          duration: reducedMotion ? 0.2 : 0.55,
          ease: "easeInOut",
        }}
      >
        {variant === "moon" ? <MoonSeal accent={accent} /> : <StarSeal accent={accent} />}
        {sealState === "breaking" && !reducedMotion && (
          <span aria-hidden="true" className="reading-wax-crack" />
        )}
      </motion.div>
    </div>
  )
}
