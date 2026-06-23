import { useParams } from "react-router-dom"
import { useState } from "react"
export default function ViewLetter() {
  const { id } = useParams()

  const letter = JSON.parse(
    localStorage.getItem(`lunareth-${id}`)
  )
  const [enteredPassword, setEnteredPassword] = useState("")
  const [unlocked, setUnlocked] = useState(false)

  if (!letter) {
    return (
      <div className="min-h-screen bg-black text-white p-10">
        <h1>Letter not found</h1>
      </div>
    )
  }
  if (letter.password && !unlocked) {
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl mb-6">
        This letter is protected
      </h1>

      <input
        type="password"
        value={enteredPassword}
        onChange={(e) =>
          setEnteredPassword(e.target.value)
        }
        placeholder="Enter password"
        className="p-4 rounded-xl bg-zinc-900 border border-zinc-700"
      />

    <button
        onClick={() => {
          if (enteredPassword === letter.password) {
            setUnlocked(true)
          } else {
            alert("Wrong password")
          }
        }}
        className="ml-4 px-6 py-4 border rounded-xl"
    >
        Unlock
      </button>
    </div>
  )
}
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-4xl font-bold">
        {letter.title}
      </h1>

      <p className="mt-4 text-zinc-400">
        To: {letter.recipient}
      </p>

      <p className="mt-8 whitespace-pre-wrap">
        {letter.message}
      </p>
    </div>
  )
}