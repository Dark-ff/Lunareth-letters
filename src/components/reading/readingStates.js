export const READING_STATE = {
  ARRIVING: "arriving",
  SEALED: "sealed",
  PASSWORD: "password",
  VERIFYING: "verifying",
  OPENING: "opening",
  REVEALING: "revealing",
  READING: "reading",
  SKIPPED: "skipped",
}

export const SEAL_STATE = {
  IDLE: "idle",
  SPARKLE: "sparkle",
  GLOW_CRIMSON: "glow-crimson",
  GLOW_LILAC: "glow-lilac",
  BREAKING: "breaking",
  BROKEN: "broken",
}

export const EXPERIENCE_PHASE = {
  THEME_INTRO: "theme-intro",
  ENVELOPE: "envelope",
  READING: "reading",
}

export function isTransitionLocked(state) {
  return [
    READING_STATE.ARRIVING,
    READING_STATE.VERIFYING,
    READING_STATE.OPENING,
    READING_STATE.REVEALING,
  ].includes(state)
}

export function isReadingComplete(state) {
  return state === READING_STATE.READING || state === READING_STATE.SKIPPED
}

export function canSkipAnimation(state) {
  return state !== READING_STATE.READING && state !== READING_STATE.SKIPPED
}

export function canActivateEnvelope(state) {
  return state === READING_STATE.SEALED
}
