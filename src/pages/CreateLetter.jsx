import LetterPreview from "../components/LetterPreview"
import Navbar from "../components/Navbar"
import { useState } from "react"
import { LETTER_STYLE_NAMES, LETTER_THEMES } from "../lib/letterConfig"
import { saveLetter } from "../lib/letterStorage"

const fieldBaseClass =
  "w-full border border-[#b8a2ff]/10 bg-white/5 outline-none transition placeholder:text-zinc-500 focus:border-[#b8a2ff]/40"
const fieldErrorClass = "border-red-400/70 focus:border-red-300"

function ChoiceButton({ isActive, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-5 py-3 transition focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 ${
        isActive
          ? "bg-[#b8a2ff] text-black"
          : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
      }`}
    >
      {children}
    </button>
  )
}

function FieldError({ children }) {
  if (!children) return null

  return <p className="mt-2 text-sm text-red-300">{children}</p>
}

export default function CreateLetter() {
  const [theme, setTheme] = useState("Friendship")
  const [style, setStyle] = useState("Moonlit")
  const [title, setTitle] = useState("")
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [memory, setMemory] = useState("")
  const [hope, setHope] = useState("")
  const [password, setPassword] = useState("")
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  const titleError = title.trim() ? "" : "Add a title before saving."
  const messageError = message.trim() ? "" : "Write a message before saving."
  const canSave = !titleError && !messageError && !isSaving
  const showTitleError = (touched.title || submitted) && titleError
  const showMessageError = (touched.message || submitted) && messageError

  const markTouched = (field) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSave = async () => {
  setSubmitted(true)
  setSaveMessage("")

  if (!canSave) {
    return
  }

  setIsSaving(true)

  const letter = {
    id: crypto.randomUUID(),
    title: title.trim(),
    recipient: recipient.trim(),
    message: message.trim(),
    memory: memory.trim(),
    hope: hope.trim(),
    password: password.trim(),
    theme,
    style,
    createdAt: new Date().toISOString(),
  }

  try {
    await saveLetter(letter)

    const link = `${window.location.origin}/letter/${letter.id}`

    try {
      await navigator.clipboard.writeText(link)
      setSaveMessage(`Letter saved. Share link copied: ${link}`)
    } catch {
      setSaveMessage(`Letter saved. Copy this share link: ${link}`)
    }
  } catch (error) {
    console.error(error)
    setSaveMessage(error.message || "Failed to save letter. Please try again.")
  } finally {
    setIsSaving(false)
  }
}

  return (
    <>
      <Navbar />
      <div className="lunareth-themed-page min-h-screen bg-black px-6 pt-24 pb-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
            Create Letter
          </p>

          <h1 className="mb-6 text-5xl font-bold">Write something meaningful.</h1>

          <p className="mb-12 text-lg text-[#d6ccff]">
            Some words deserve more care than a text message.
          </p>

          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-8">
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
                  Choose a Letter Theme
                </p>

                <div className="mb-10 flex flex-wrap gap-4">
                  {LETTER_THEMES.map((letterTheme) => (
                    <ChoiceButton
                      key={letterTheme}
                      isActive={theme === letterTheme}
                      onClick={() => setTheme(letterTheme)}
                    >
                      {letterTheme}
                    </ChoiceButton>
                  ))}
                </div>

                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
                  Choose a Visual Style
                </p>

                <div className="flex flex-wrap gap-4">
                  {LETTER_STYLE_NAMES.map((letterStyle) => (
                    <ChoiceButton
                      key={letterStyle}
                      isActive={style === letterStyle}
                      onClick={() => setStyle(letterStyle)}
                    >
                      {letterStyle}
                    </ChoiceButton>
                  ))}
                </div>

                <p className="mt-6 text-sm text-[#d6ccff]">
                  Themes shape the feeling of your letter. Visual styles shape how it is experienced.
                </p>
              </div>

              <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => markTouched("title")}
                  placeholder="Letter title"
                  aria-invalid={Boolean(showTitleError)}
                  className={`${fieldBaseClass} rounded-2xl p-5 ${showTitleError ? fieldErrorClass : ""}`}
                />
                <FieldError>{showTitleError}</FieldError>
              </div>

              <div className="space-y-5">
                <textarea
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Who is this letter for?"
                  className={`${fieldBaseClass} h-28 rounded-3xl p-6`}
                />

                <div>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={() => markTouched("message")}
                    placeholder="What have you been wanting to say?"
                    aria-invalid={Boolean(showMessageError)}
                    className={`${fieldBaseClass} h-48 rounded-3xl p-6 ${
                      showMessageError ? fieldErrorClass : ""
                    }`}
                  />
                  <FieldError>{showMessageError}</FieldError>
                </div>

                <textarea
                  value={memory}
                  onChange={(e) => setMemory(e.target.value)}
                  placeholder="What memory still stays with you?"
                  className={`${fieldBaseClass} h-40 rounded-3xl p-6`}
                />

                <textarea
                  value={hope}
                  onChange={(e) => setHope(e.target.value)}
                  placeholder="What do you hope they feel after reading this?"
                  className={`${fieldBaseClass} h-32 rounded-3xl p-6`}
                />
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password"
                className={`${fieldBaseClass} rounded-2xl p-5`}
              />
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-8">
                <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
                  Live Preview
                </p>

                <LetterPreview
                  title={title}
                  recipient={recipient}
                  message={message}
                  memory={memory}
                  hope={hope}
                  theme={theme}
                  style={style}
                  password={password}
                />
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="rounded-full border border-[#b8a2ff]/30 px-8 py-4 transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  {isSaving ? "Saving..." : "Save Letter"}
                </button>

                {saveMessage && (
                  <p className="max-w-xl break-words text-sm text-[#d6ccff]">{saveMessage}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
