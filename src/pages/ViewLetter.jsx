import { useParams } from "react-router-dom"
import ReadingExperience from "../components/reading/ReadingExperience"
import { getLetter } from "../lib/letterStorage"

export default function ViewLetter() {
  const { id } = useParams()
  const letter = getLetter(id)

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

  return <ReadingExperience letter={letter} />
}
