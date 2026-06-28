import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import StarField from "../background/StarField"
import LetterRenderer from "../LetterRenderer"
import { getLetterStyle } from "../../lib/letterConfig"
import Envelope from "./Envelope"
import PasswordPrompt from "./PasswordPrompt"
import PaperReveal from "./PaperReveal"
import {
  canActivateEnvelope,
  canSkipAnimation,
  EXPERIENCE_PHASE,
  isReadingComplete,
  isTransitionLocked,
  READING_STATE,
  SEAL_STATE,
} from "./readingStates"
import usePrefersReducedMotion from "./usePrefersReducedMotion"

function getEnvelopePalette(styleTokens) {
  return {
    body: styleTokens.border,
    flap: styleTokens.subtext,
    shadow: styleTokens.accent,
    accent: styleTokens.accent,
    texture: styleTokens.divider,
    border: styleTokens.border,
    text: styleTokens.text,
    subtext: styleTokens.subtext,
    inputBg: styleTokens.inputBg,
    panelBg: styleTokens.containerStyle?.background ?? styleTokens.inputBg,
    panelShadow: styleTokens.containerStyle?.boxShadow ?? "0 24px 60px rgba(0, 0, 0, 0.25)",
    containerStyle: styleTokens.containerStyle,
    fontFamily: styleTokens.fontFamily,
  }
}

function getTiming(reducedMotion) {
  return {
    arrive: reducedMotion ? 250 : 1100,
    sparkle: reducedMotion ? 150 : 700,
    break: reducedMotion ? 150 : 500,
    openFlap: reducedMotion ? 150 : 800,
    paperRise: reducedMotion ? 150 : 650,
    paperUnfold: reducedMotion ? 150 : 700,
    letterFade: reducedMotion ? 150 : 550,
    verify: reducedMotion ? 200 : 600,
    shake: reducedMotion ? 200 : 450,
  }
}

export default function ReadingExperience({ letter, themeIntro: ThemeIntro }) {
  const reducedMotion = usePrefersReducedMotion()
  const timing = useMemo(() => getTiming(reducedMotion), [reducedMotion])
  const isProtected = Boolean(letter.password?.trim())
  const styleTokens = useMemo(() => getLetterStyle(letter.style), [letter.style])
  const envelopePalette = useMemo(() => getEnvelopePalette(styleTokens), [styleTokens])

  const [experiencePhase, setExperiencePhase] = useState(
    ThemeIntro ? EXPERIENCE_PHASE.THEME_INTRO : EXPERIENCE_PHASE.ENVELOPE
  )
  const [state, setState] = useState(READING_STATE.ARRIVING)
  const [sealState, setSealState] = useState(SEAL_STATE.IDLE)
  const [paperPhase, setPaperPhase] = useState("hidden")
  const [passwordError, setPasswordError] = useState("")
  const [isShaking, setIsShaking] = useState(false)
  const verifyTimeoutRef = useRef(null)
  const sequenceTimeoutRef = useRef(null)

  const clearSequenceTimeout = useCallback(() => {
    if (sequenceTimeoutRef.current) {
      clearTimeout(sequenceTimeoutRef.current)
      sequenceTimeoutRef.current = null
    }
  }, [])

  const queueSequence = useCallback(
    (callback, delay) => {
      clearSequenceTimeout()
      sequenceTimeoutRef.current = setTimeout(callback, delay)
    },
    [clearSequenceTimeout]
  )

  const beginEnvelopeExperience = useCallback(() => {
    setExperiencePhase(EXPERIENCE_PHASE.ENVELOPE)
    setState(READING_STATE.ARRIVING)
  }, [])

  const skipToReading = useCallback(() => {
    clearSequenceTimeout()
    if (verifyTimeoutRef.current) {
      clearTimeout(verifyTimeoutRef.current)
      verifyTimeoutRef.current = null
    }
    setPasswordError("")
    setIsShaking(false)
    setSealState(SEAL_STATE.BROKEN)
    setPaperPhase("complete")
    setState(READING_STATE.SKIPPED)
    setExperiencePhase(EXPERIENCE_PHASE.READING)
  }, [clearSequenceTimeout])

  const startRevealSequence = useCallback(() => {
    setState(READING_STATE.REVEALING)
    setPaperPhase("rising")

    clearSequenceTimeout()
    sequenceTimeoutRef.current = setTimeout(() => {
      setPaperPhase("unfolding")
      sequenceTimeoutRef.current = setTimeout(() => {
        setPaperPhase("complete")
        sequenceTimeoutRef.current = setTimeout(() => {
          setState(READING_STATE.READING)
          setExperiencePhase(EXPERIENCE_PHASE.READING)
        }, timing.letterFade)
      }, timing.paperUnfold)
    }, timing.paperRise)
  }, [clearSequenceTimeout, timing.letterFade, timing.paperRise, timing.paperUnfold])

  const beginOpening = useCallback(() => {
    setState((currentState) => {
      if (
        currentState === READING_STATE.OPENING ||
        currentState === READING_STATE.REVEALING ||
        isReadingComplete(currentState)
      ) {
        return currentState
      }

      return READING_STATE.OPENING
    })

    clearSequenceTimeout()
    sequenceTimeoutRef.current = setTimeout(startRevealSequence, timing.openFlap)
  }, [clearSequenceTimeout, startRevealSequence, timing.openFlap])

  useEffect(() => {
    if (experiencePhase !== EXPERIENCE_PHASE.ENVELOPE) return
    if (state !== READING_STATE.ARRIVING) return

    queueSequence(() => setState(READING_STATE.SEALED), timing.arrive)
    return clearSequenceTimeout
  }, [clearSequenceTimeout, experiencePhase, queueSequence, state, timing.arrive])

  useEffect(() => {
    if (sealState !== SEAL_STATE.SPARKLE) return

    queueSequence(() => setSealState(SEAL_STATE.BREAKING), timing.sparkle)
    return clearSequenceTimeout
  }, [clearSequenceTimeout, queueSequence, sealState, timing.sparkle])

  useEffect(() => {
    if (sealState !== SEAL_STATE.BREAKING) return

    queueSequence(() => {
      setSealState(SEAL_STATE.BROKEN)
      beginOpening()
    }, timing.break)
    return clearSequenceTimeout
  }, [beginOpening, clearSequenceTimeout, queueSequence, sealState, timing.break])

  useEffect(() => {
    return () => {
      clearSequenceTimeout()
      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current)
      }
    }
  }, [clearSequenceTimeout])

  const handleEnvelopeActivate = useCallback(() => {
    if (!canActivateEnvelope(state) || isTransitionLocked(state)) return

    if (isProtected) {
      setPasswordError("")
      setSealState(SEAL_STATE.GLOW_LILAC)
      setState(READING_STATE.PASSWORD)
      return
    }

    setSealState(SEAL_STATE.SPARKLE)
  }, [isProtected, state])

  const handlePasswordDismiss = useCallback(() => {
    if (state === READING_STATE.VERIFYING) return

    setPasswordError("")
    setSealState(SEAL_STATE.IDLE)
    setState(READING_STATE.SEALED)
  }, [state])

  const handlePasswordSubmit = useCallback(
    (password) => {
      if (state === READING_STATE.VERIFYING || isTransitionLocked(state)) return

      setPasswordError("")
      setState(READING_STATE.VERIFYING)

      if (verifyTimeoutRef.current) {
        clearTimeout(verifyTimeoutRef.current)
      }

      verifyTimeoutRef.current = setTimeout(() => {
        if (password !== letter.password) {
          setSealState(SEAL_STATE.GLOW_CRIMSON)
          setIsShaking(true)
          setPasswordError("The seal remains unbroken.")
          setState(READING_STATE.PASSWORD)

          setTimeout(() => {
            setIsShaking(false)
            setSealState(SEAL_STATE.GLOW_LILAC)
          }, timing.shake)
          return
        }

        setSealState(SEAL_STATE.GLOW_LILAC)
        setTimeout(() => setSealState(SEAL_STATE.BREAKING), timing.break)
      }, timing.verify)
    },
    [letter.password, state, timing.break, timing.shake, timing.verify]
  )

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && canActivateEnvelope(state)) {
        event.preventDefault()
        handleEnvelopeActivate()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleEnvelopeActivate, state])

  const pageStyle = {
    minHeight: "100vh",
    background: styleTokens.bg,
    color: styleTokens.text,
    fontFamily: styleTokens.fontFamily,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    position: "relative",
    ...styleTokens.pageExtra,
  }

  const readingContainerStyle = {
    ...styleTokens.containerStyle,
    width: "100%",
    maxWidth: "680px",
    padding: "3rem 3.5rem",
  }

  const showSkip =
    experiencePhase === EXPERIENCE_PHASE.ENVELOPE &&
    canSkipAnimation(state) &&
    state !== READING_STATE.ARRIVING

  const showEnvelopeStage =
    experiencePhase === EXPERIENCE_PHASE.ENVELOPE && !isReadingComplete(state)

  const isFlapOpen =
    state === READING_STATE.OPENING || state === READING_STATE.REVEALING

  return (
    <div style={pageStyle} className="reading-experience">
      <StarField animated={!reducedMotion} />

      {showSkip && (
        <button
          type="button"
          className="reading-skip-button"
          onClick={skipToReading}
          style={{ color: styleTokens.subtext, borderColor: styleTokens.border }}
        >
          Skip Animation →
        </button>
      )}

      {ThemeIntro && experiencePhase === EXPERIENCE_PHASE.THEME_INTRO && (
        <ThemeIntro onComplete={beginEnvelopeExperience} onSkip={skipToReading} />
      )}

      {isReadingComplete(state) && (
        <div className="relative z-10 w-full" style={{ maxWidth: "680px" }}>
          <div style={readingContainerStyle}>
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
        </div>
      )}

      {showEnvelopeStage && (
        <div className="reading-experience-stage relative z-10">
          <Envelope
            styleTokens={envelopePalette}
            experienceState={state}
            sealState={sealState}
            isProtected={isProtected}
            isShaking={isShaking}
            isFlapOpen={isFlapOpen}
            reducedMotion={reducedMotion}
            onActivate={handleEnvelopeActivate}
          >
            <PasswordPrompt
              visible={
                state === READING_STATE.PASSWORD || state === READING_STATE.VERIFYING
              }
              onSubmit={handlePasswordSubmit}
              onDismiss={handlePasswordDismiss}
              isVerifying={state === READING_STATE.VERIFYING}
              errorMessage={passwordError}
              styleTokens={envelopePalette}
              reducedMotion={reducedMotion}
            />
          </Envelope>

          {state === READING_STATE.REVEALING && (
            <PaperReveal
              phase={paperPhase}
              letter={letter}
              styleTokens={envelopePalette}
              reducedMotion={reducedMotion}
            />
          )}
        </div>
      )}
    </div>
  )
}
