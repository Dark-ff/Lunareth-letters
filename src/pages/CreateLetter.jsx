import LetterPreview from "../components/LetterPreview"
import { useState } from "react"

export default function CreateLetter() {
  const [theme, setTheme] = useState("Friendship")
  const [style, setStyle] = useState("Moonlit")

  const [title, setTitle] = useState("")
  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [memory, setMemory] = useState("")
  const [hope, setHope] = useState("")
  const [password, setPassword] = useState("")

  const handleSave = () => {
    const letter = {
      id: crypto.randomUUID(),
      title,
      recipient,
      message,
      memory,
      hope,
      password,
      theme,
      style,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem(
      `lunareth-${letter.id}`,
      JSON.stringify(letter)
    )

    alert(`Letter saved!\nID: ${letter.id}`)
  }
  return (
    <div className="min-h-screen bg-black px-6 py-20 text-white">
      <div className="mx-auto max-w-7xl">

        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
          Create Letter
        </p>

        <h1 className="mb-6 text-5xl font-bold">
          Write something meaningful.
        </h1>

        <p className="mb-12 text-lg text-[#d6ccff]">
          Some words deserve more care than a text message.
        </p>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* LEFT SIDE */}

          <div className="space-y-6">

            <div className="rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-8">

              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
                Choose a Letter Theme
              </p>

              <div className="mb-10 flex flex-wrap gap-4">

              <button
                  onClick={() => setTheme("Birthday")}
                  className={`rounded-full px-5 py-3 transition ${
                    theme === "Birthday"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Birthday
                </button>

                <button
                  onClick={() => setTheme("Friendship")}
                  className={`rounded-full px-5 py-3 transition ${
                    theme === "Friendship"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Friendship
                </button>

                <button
                  onClick={() => setTheme("Farewell")}
                  className={`rounded-full px-5 py-3 transition ${
                    theme === "Farewell"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Farewell
                </button>

                <button
                  onClick={() => setTheme("Confession")}
                  className={`rounded-full px-5 py-3 transition ${
                    theme === "Confession"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Confession
                </button>

              </div>

              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
                Choose a Visual Style
              </p>

              <div className="flex flex-wrap gap-4">

                <button
                  onClick={() => setStyle("Old Paper")}
                  className={`rounded-full px-5 py-3 transition ${
                    style === "Old Paper"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Old Paper
                </button>

                <button
                  onClick={() => setStyle("Dark Aesthetic")}
                  className={`rounded-full px-5 py-3 transition ${
                    style === "Dark Aesthetic"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Dark Aesthetic
                </button>

                <button
                  onClick={() => setStyle("Moonlit")}
                  className={`rounded-full px-5 py-3 transition ${
                    style === "Moonlit"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Moonlit
                </button>

                <button
                  onClick={() => setStyle("Minimal")}
                  className={`rounded-full px-5 py-3 transition ${
                    style === "Minimal"
                      ? "bg-[#b8a2ff] text-black"
                      : "border border-[#b8a2ff]/30 hover:bg-white hover:text-black"
                  }`}
                >
                  Minimal
                </button>

              </div>

              <p className="mt-6 text-sm text-[#d6ccff]">
                Themes shape the feeling of your letter. Visual styles shape how it is experienced.
              </p>

            </div>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Letter title"
              className="w-full rounded-2xl border border-[#b8a2ff]/10 bg-white/5 p-5 outline-none placeholder:text-zinc-500"
            />

            <div className="space-y-5">

              <textarea
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Who is this letter for?"
                className="h-28 w-full rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-6 outline-none placeholder:text-zinc-500"
              />

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What have you been wanting to say?"
                className="h-48 w-full rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-6 outline-none placeholder:text-zinc-500"
              />

              <textarea
                value={memory}
                onChange={(e) => setMemory(e.target.value)}
                placeholder="What memory still stays with you?"
                className="h-40 w-full rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-6 outline-none placeholder:text-zinc-500"
              />

              <textarea
                value={hope}
                onChange={(e) => setHope(e.target.value)}
                placeholder="What do you hope they feel after reading this?"
                className="h-32 w-full rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-6 outline-none placeholder:text-zinc-500"
              />
            </div>

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Set a password"
                className="w-full rounded-2xl border border-[#b8a2ff]/10 bg-white/5 p-5 outline-none placeholder:text-zinc-500"
              />

          </div>

          {/* RIGHT SIDE */}

          <div className="space-y-6">

          <div className="rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-8">

            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
              Live Preview
            </p>

            <LetterPreview
              title={title}
              message={message}
              theme={theme}
              style={style}
              password={password}
            />

          </div>

          <button
          onClick={handleSave}
          className="rounded-full border border-[#b8a2ff]/30 px-8 py-4 transition hover:bg-white hover:text-black">
          Save Letter
        </button>

          </div>

        </div>

      </div>
    </div>
  )
}