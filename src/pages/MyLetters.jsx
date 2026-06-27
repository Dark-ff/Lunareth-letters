import { Link } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/Navbar"
import { formatLetterDate } from "../lib/letterConfig"
import { deleteLetter, getSavedLetters } from "../lib/letterStorage"

function Badge({ children }) {
  return (
    <span className="rounded-full border border-[#b8a2ff]/20 bg-[#b8a2ff]/10 px-3 py-1 text-xs text-[#d6ccff]">
      {children}
    </span>
  )
}

export default function MyLetters() {
  const [letters, setLetters] = useState(() => getSavedLetters())
  const [letterToDelete, setLetterToDelete] = useState(null)

  const confirmDelete = () => {
    if (!letterToDelete) return

    deleteLetter(letterToDelete.id)
    setLetters((currentLetters) =>
      currentLetters.filter((letter) => letter.id !== letterToDelete.id)
    )
    setLetterToDelete(null)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black px-6 pt-24 pb-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
                Saved Letters
              </p>
              <h1 className="text-4xl font-bold">My Letters</h1>
            </div>

            <Link
              to="/create"
              className="w-fit rounded-full border border-[#b8a2ff]/30 px-5 py-3 text-sm transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50"
            >
              Write New Letter
            </Link>
          </div>

          {letters.length === 0 ? (
            <div className="rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-10 text-center">
              <h2 className="mb-3 text-2xl font-semibold">No letters yet.</h2>
              <p className="mx-auto mb-6 max-w-md text-[#d6ccff]">
                When you save a letter, it will appear here with its theme, style, and share link.
              </p>
              <Link
                to="/create"
                className="inline-block rounded-full bg-[#b8a2ff] px-6 py-3 text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50"
              >
                Create Your First Letter
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {letters.map((letter) => (
                <article
                  key={letter.id}
                  className="rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-6 transition hover:border-[#b8a2ff]/25"
                >
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-2xl font-semibold">
                        {letter.title || "Untitled Letter"}
                      </h2>

                      <p className="mt-2 text-sm text-zinc-500">
                        {letter.createdAt ? formatLetterDate(letter.createdAt) : "No date saved"}
                      </p>
                    </div>

                    {letter.password && (
                      <span
                        aria-label="Password protected"
                        title="Password protected"
                        className="rounded-full border border-[#b8a2ff]/20 bg-[#b8a2ff]/10 px-3 py-2 text-sm text-[#d6ccff]"
                      >
                        {"\uD83D\uDD12"}
                      </span>
                    )}
                  </div>

                  <div className="mb-6 flex flex-wrap gap-2">
                    <Badge>Theme: {letter.theme || "Friendship"}</Badge>
                    <Badge>Style: {letter.style || "Moonlit"}</Badge>
                  </div>

                  {letter.recipient && (
                    <p className="mb-5 line-clamp-2 text-sm text-zinc-400">
                      To: {letter.recipient}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/letter/${letter.id}`}
                      className="rounded-full border border-[#b8a2ff]/30 px-5 py-2 text-sm transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50"
                    >
                      Open Letter
                    </Link>

                    <button
                      type="button"
                      onClick={() => setLetterToDelete(letter)}
                      className="rounded-full border border-red-400/50 px-5 py-2 text-sm text-red-200 transition hover:bg-red-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-red-300/50"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {letterToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-md rounded-3xl border border-[#b8a2ff]/10 bg-[#09090f] p-7 text-white shadow-2xl">
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
              Confirm Delete
            </p>
            <h2 className="mb-3 text-2xl font-semibold">Delete this letter?</h2>
            <p className="mb-6 text-[#d6ccff]">
              This will remove "{letterToDelete.title || "Untitled Letter"}" from this browser.
            </p>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setLetterToDelete(null)}
                className="rounded-full border border-[#b8a2ff]/30 px-5 py-2 text-sm transition hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-full border border-red-400 bg-red-400 px-5 py-2 text-sm text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-red-300/50"
              >
                Delete Letter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

