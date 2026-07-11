import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ReadingExperience from "../components/reading/ReadingExperience"
import { getLetter } from "../lib/letterStorage"

export default function ViewLetter() {
  const { id } = useParams()

const [letter, setLetter] = useState(null)
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  let isMounted = true

  async function loadLetter() {
    try {
      const fetchedLetter = await getLetter(id)

      if (isMounted) {
        setLetter(fetchedLetter)
      }
    } catch (error) {
      console.error(error)
    } finally {
      if (isMounted) {
        setIsLoading(false)
      }
    }
  }

  loadLetter()

  return () => {
    isMounted = false
  }
}, [id])

  if (isLoading) {
  return null
}

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
