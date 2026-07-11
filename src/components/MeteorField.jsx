import { useEffect, useRef, useState } from "react"

const MAX_ACTIVE_METEORS = 3
const MIN_SPAWN_INTERVAL_MS = 12000
const MAX_SPAWN_INTERVAL_MS = 25000
const MIN_DURATION_MS = 2500
const MAX_DURATION_MS = 4500

function randomBetween(min, max) {
  return min + Math.random() * (max - min)
}

function createMeteor(id) {
  return {
    id,
    angle: randomBetween(18, 32), // degrees, traveling down-right
    startLeft: randomBetween(5, 85), // vw, near-random horizontal start
    startTop: randomBetween(-5, 30), // vh, upper portion of the screen
    travelDistance: randomBetween(700, 1200), // px
    duration: randomBetween(MIN_DURATION_MS, MAX_DURATION_MS),
  }
}

function prefersReducedMotionNow() {
  if (typeof window === "undefined" || !window.matchMedia) return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export default function MeteorField() {
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotionNow)
  const [meteors, setMeteors] = useState([])
  const idRef = useRef(0)
  const activeCountRef = useRef(0)
  const timeoutsRef = useRef([])

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handleChange = () => setReducedMotion(mediaQuery.matches)

    handleChange()
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return

    let isCancelled = false

    function scheduleNextMeteor() {
      const delay = randomBetween(MIN_SPAWN_INTERVAL_MS, MAX_SPAWN_INTERVAL_MS)

      const spawnTimeoutId = setTimeout(() => {
        if (isCancelled) return

        if (activeCountRef.current < MAX_ACTIVE_METEORS) {
          const id = idRef.current++
          const meteor = createMeteor(id)
          activeCountRef.current += 1

          setMeteors((current) => [...current, meteor])

          const removeTimeoutId = setTimeout(() => {
            if (isCancelled) return
            activeCountRef.current = Math.max(0, activeCountRef.current - 1)
            setMeteors((current) => current.filter((m) => m.id !== id))
          }, meteor.duration)

          timeoutsRef.current.push(removeTimeoutId)
        }

        scheduleNextMeteor()
      }, delay)

      timeoutsRef.current.push(spawnTimeoutId)
    }

    scheduleNextMeteor()

    return () => {
      isCancelled = true
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
      activeCountRef.current = 0
    }
  }, [reducedMotion])

  if (reducedMotion) return null

  return (
    <div
      aria-hidden="true"
      className="meteor-field pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {meteors.map((meteor) => (
        <span
          key={meteor.id}
          className="meteor-field-meteor"
          style={{
            left: `${meteor.startLeft}vw`,
            top: `${meteor.startTop}vh`,
            "--meteor-angle": `${meteor.angle}deg`,
            "--meteor-distance": `${meteor.travelDistance}px`,
            "--meteor-duration": `${meteor.duration}ms`,
          }}
        />
      ))}
    </div>
  )
}
