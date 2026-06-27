import { useParams } from "react-router-dom"
import { useState } from "react"
import LetterRenderer from "../components/LetterRenderer"
import { getLetterStyle } from "../lib/letterConfig"
import { getLetter } from "../lib/letterStorage"

export default function ViewLetter() {
  const { id } = useParams()
  const letter = getLetter(id)
  const [enteredPassword, setEnteredPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)

  if (!letter) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          padding: "2.5rem",
        }}
      >
        <p>Letter not found.</p>
      </div>
    )
  }

  const unlockLetter = () => {
    if (enteredPassword === letter.password) {
      setUnlocked(true)
    } else {
      alert("Wrong password")
    }
  }

  const s = getLetterStyle(letter.style)

  const pageStyle = {
    minHeight: "100vh",
    background: s.bg,
    color: s.text,
    fontFamily: s.fontFamily,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    ...s.pageExtra,
  }

  if (letter.password && !unlocked) {
    return (
      <div style={pageStyle}>
        <div
          style={{
            ...s.containerStyle,
            width: "100%",
            maxWidth: "440px",
            padding: "2.5rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "2rem",
              marginBottom: "0.5rem",
            }}
          >
            {"\uD83D\uDD12"}
          </p>

          <h2
            style={{
              color: s.text,
              fontSize: "1.25rem",
              marginBottom: "0.5rem",
            }}
          >
            This letter is protected
          </h2>

          <p
            style={{
              color: s.subtext,
              fontSize: "0.85rem",
              marginBottom: "1.5rem",
            }}
          >
            Enter the password to read it.
          </p>

          <input
            type="password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                unlockLetter()
              }
            }}
            placeholder="Password"
            style={{
              width: "100%",
              background: s.inputBg,
              color: s.text,
              border: `1px solid ${s.border}`,
              fontFamily: s.fontFamily,
              padding: "0.75rem 1rem",
              borderRadius: "4px",
              outline: "none",
              marginBottom: "0.75rem",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={unlockLetter}
            style={{
              width: "100%",
              padding: "0.75rem",
              border: `1px solid ${s.accent}`,
              color: s.accent,
              background: "transparent",
              fontFamily: s.fontFamily,
              fontSize: "0.9rem",
              borderRadius: "4px",
              cursor: "pointer",
              letterSpacing: "0.05em",
            }}
          >
            Unlock
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div
        style={{
          ...s.containerStyle,
          width: "100%",
          maxWidth: "680px",
          padding: "3rem 3.5rem",
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
    </div>
  )
}
