import { Link } from "react-router-dom"
import { useState } from "react"
import Navbar from "../components/Navbar"
import { formatLetterDate } from "../lib/letterConfig"
import { deleteLetter, getSavedLetters } from "../lib/letterStorage"

/* ---------------------------------------------------------------- */
/* Small inline icons (no new dependencies)                          */
/* ---------------------------------------------------------------- */

function IconArrowRight({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4.5 12h15M13 5.5l6.5 6.5-6.5 6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconTrash({ className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M5 7h14M9.5 7V5.2c0-.66.54-1.2 1.2-1.2h2.6c.66 0 1.2.54 1.2 1.2V7M7 7l.7 12.1c.05.98.86 1.75 1.84 1.75h4.92c.98 0 1.79-.77 1.84-1.75L17 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconSeal({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6.5 10.2V8.3a5.5 5.5 0 0 1 11 0v1.9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="5" y="10.2" width="14" height="9.6" rx="2.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="14.8" r="1.3" fill="currentColor" />
    </svg>
  )
}

function IconFeather({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 4c-6.5.5-11.5 3-14 9.5C4.8 17 5 19 5 19s2-.2 5.5-2C17 14.5 19.5 9.5 20 4Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M18.3 5.7 6 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M9.5 14.5 13 11M7 16.8l3-3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}

function IconWarning({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4.5 21 19.5H3L12 4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16.6" r="0.9" fill="currentColor" />
    </svg>
  )
}

/* ---------------------------------------------------------------- */
/* Badge — theme / style pill. `tone="paper"` is used on the         */
/* featured letter's parchment surface, default suits the dark grid. */
/* ---------------------------------------------------------------- */

function Badge({ children, tone = "dark" }) {
  if (tone === "paper") {
    return (
      <span className="rounded-full border border-black/10 bg-black/[0.05] px-3 py-1 text-xs tracking-wide text-[#4a3f33]">
        {children}
      </span>
    )
  }

  return (
    <span className="rounded-full border border-[#b8a2ff]/20 bg-[#b8a2ff]/10 px-3 py-1 text-xs text-[#d6ccff]">
      {children}
    </span>
  )
}

/* ---------------------------------------------------------------- */
/* SealBadge — replaces the emoji lock. A wax-seal-inspired mark for  */
/* password protected letters. Purely presentational.                */
/* ---------------------------------------------------------------- */

function SealBadge({ compact = false }) {
  return (
    <span
      role="img"
      aria-label="Password protected"
      title="Password protected"
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#c1594a] to-[#7a2318] text-[#f4e3c9] ring-1 ring-black/30 shadow-[0_3px_10px_-2px_rgba(193,89,74,0.55)] ${
        compact ? "h-8 w-8" : "h-10 w-10"
      }`}
    >
      <IconSeal className={compact ? "h-3.5 w-3.5" : "h-4.5 w-4.5"} />
    </span>
  )
}

export default function MyLetters() {
  const [letters, setLetters] = useState(() => getSavedLetters())
  const [letterToDelete, setLetterToDelete] = useState(null)
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")

  const closeDeleteDialog = () => {
    setLetterToDelete(null)
    setDeletePassword("")
    setDeleteError("")
  }

  const requestDelete = (letter) => {
    setLetterToDelete(letter)
    setDeletePassword("")
    setDeleteError("")
  }

  const deleteSelectedLetter = () => {
    if (!letterToDelete) return

    deleteLetter(letterToDelete.id)
    setLetters((currentLetters) =>
      currentLetters.filter((letter) => letter.id !== letterToDelete.id)
    )
    closeDeleteDialog()
  }

  const confirmDelete = () => {
    if (!letterToDelete) return

    if (letterToDelete.password && deletePassword !== letterToDelete.password) {
      setDeleteError("That password does not match this letter.")
      return
    }

    deleteSelectedLetter()
  }

  const isPasswordProtectedDelete = Boolean(letterToDelete?.password)

  /* -- Presentation only: pick the newest letter to feature. -- */
  const featuredLetter =
    letters.length > 0
      ? letters.reduce((latest, letter) => {
          if (!latest) return letter
          const latestTime = latest.createdAt ? new Date(latest.createdAt).getTime() : 0
          const letterTime = letter.createdAt ? new Date(letter.createdAt).getTime() : 0
          return letterTime > latestTime ? letter : latest
        }, null)
      : null

  const remainingLetters = featuredLetter
    ? letters.filter((letter) => letter.id !== featuredLetter.id)
    : []

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden bg-[#07060c] px-6 pt-24 pb-16 text-white">
        {/* Ambient glow, purely decorative */}
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#b8a2ff]/[0.07] blur-[140px]" />
        <div className="pointer-events-none absolute top-1/3 right-0 h-[360px] w-[360px] translate-x-1/2 rounded-full bg-[#b8a2ff]/[0.05] blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-[#b8a2ff]">
                Saved Letters
              </p>
              <h1 className="font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl">
                My Letters
              </h1>
              <p className="mt-3 max-w-md text-sm text-zinc-500">
                Every letter you've kept, held here exactly as you left it.
              </p>
            </div>

            <Link
              to="/create"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#b8a2ff] px-6 py-3 text-sm font-medium text-black transition-all duration-300 hover:shadow-[0_0_30px_-6px_rgba(184,162,255,0.6)] focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 focus:ring-offset-2 focus:ring-offset-[#07060c]"
            >
              Write New Letter
              <IconArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {letters.length === 0 ? (
            <div className="relative overflow-hidden rounded-[32px] border border-[#b8a2ff]/10 bg-white/[0.03] px-8 py-20 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,162,255,0.08),transparent_60%)]" />
              <div className="relative mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-[#b8a2ff]/20 bg-[#b8a2ff]/5 text-[#b8a2ff]">
                <IconFeather />
              </div>
              <h2 className="relative mb-3 font-serif text-3xl font-normal text-white">
                Your vault is waiting.
              </h2>
              <p className="relative mx-auto mb-8 max-w-md text-[#d6ccff]/80">
                Nothing's been written yet. The first letter you save will
                appear here, with its theme, style, and share link, ready
                whenever you want to return to it.
              </p>
              <Link
                to="/create"
                className="relative inline-flex items-center gap-2 rounded-full bg-[#b8a2ff] px-7 py-3.5 text-sm font-medium text-black transition-all duration-300 hover:shadow-[0_0_30px_-6px_rgba(184,162,255,0.6)] focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50"
              >
                Write Your First Letter
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-14">
              {/* ---------------- Featured letter ---------------- */}
              {featuredLetter && (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#b8a2ff]/40" />
                    <p className="text-xs font-medium uppercase tracking-[0.35em] text-[#b8a2ff]/80">
                      Newest Letter
                    </p>
                  </div>

                  <article className="group relative overflow-hidden rounded-[28px] border border-black/10 bg-gradient-to-br from-[#efe8d8] via-[#eae2cd] to-[#dfd3b6] p-8 text-[#2a241d] shadow-[0_30px_70px_-30px_rgba(184,162,255,0.35)] transition-shadow duration-500 hover:shadow-[0_34px_80px_-25px_rgba(184,162,255,0.45)] sm:p-10">
                    {/* subtle paper grain, decorative only */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-multiply"
                      style={{
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
                      }}
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#8a7a58]">
                          {featuredLetter.createdAt
                            ? formatLetterDate(featuredLetter.createdAt)
                            : "No date saved"}
                        </p>
                        <h2 className="truncate font-serif text-3xl font-normal leading-snug text-[#241f19] sm:text-4xl">
                          {featuredLetter.title || "Untitled Letter"}
                        </h2>
                        {featuredLetter.recipient && (
                          <p className="mt-2 line-clamp-1 text-sm text-[#5b5142]">
                            To {featuredLetter.recipient}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        {featuredLetter.password && <SealBadge />}
                        <button
                          type="button"
                          onClick={() => requestDelete(featuredLetter)}
                          aria-label="Delete letter"
                          title="Delete letter"
                          className="rounded-full p-2 text-[#6b5f4d] opacity-0 transition-all duration-200 hover:bg-black/[0.06] hover:text-[#8a2f22] focus:outline-none focus:ring-2 focus:ring-[#8a2f22]/30 group-hover:opacity-100 focus-visible:opacity-100"
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </div>

                    <div className="relative mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-black/10 pt-6">
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="paper">Theme: {featuredLetter.theme || "Friendship"}</Badge>
                        <Badge tone="paper">Style: {featuredLetter.style || "Moonlit"}</Badge>
                      </div>

                      <Link
                        to={`/letter/${featuredLetter.id}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[#241f19] px-6 py-2.5 text-sm font-medium text-[#f3ecda] transition-all duration-300 hover:bg-[#3a3226] focus:outline-none focus:ring-2 focus:ring-[#241f19]/40"
                      >
                        Open Letter
                        <IconArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                </section>
              )}

              {/* ---------------- Remaining letters ---------------- */}
              {remainingLetters.length > 0 && (
                <section>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-white/15" />
                    <p className="text-xs font-medium uppercase tracking-[0.35em] text-zinc-500">
                      Archive
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {remainingLetters.map((letter, index) => (
                      <article
                        key={letter.id}
                        style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
                        className="group relative overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#b8a2ff]/25 hover:bg-white/[0.05]"
                      >
                        <div className="mb-5 flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="truncate font-serif text-2xl font-normal text-white">
                              {letter.title || "Untitled Letter"}
                            </h3>
                            <p className="mt-2 text-sm text-zinc-500">
                              {letter.createdAt ? formatLetterDate(letter.createdAt) : "No date saved"}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            {letter.password && <SealBadge compact />}
                            <button
                              type="button"
                              onClick={() => requestDelete(letter)}
                              aria-label="Delete letter"
                              title="Delete letter"
                              className="rounded-full p-2 text-zinc-500 opacity-0 transition-all duration-200 hover:bg-red-400/10 hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-300/30 group-hover:opacity-100 focus-visible:opacity-100"
                            >
                              <IconTrash />
                            </button>
                          </div>
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

                        <div className="flex items-center justify-between border-t border-white/10 pt-5">
                          <Link
                            to={`/letter/${letter.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#b8a2ff]/30 px-5 py-2 text-sm transition-colors duration-300 hover:bg-white hover:text-black focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50"
                          >
                            Open Letter
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {letterToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#b8a2ff]/10 bg-[#09090f] p-7 text-white shadow-2xl">
            <div className="mb-5 flex items-center gap-3 text-[#e8a99c]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8a99c]/10">
                <IconWarning />
              </span>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#b8a2ff]">
                {isPasswordProtectedDelete ? "Password Required" : "Confirm Delete"}
              </p>
            </div>
            <h2 className="mb-3 font-serif text-2xl font-normal">Delete this letter?</h2>
            <p className="mb-6 text-[#d6ccff]">
              {isPasswordProtectedDelete
                ? `Enter the password for "${letterToDelete.title || "Untitled Letter"}" to delete it from this browser.`
                : `This will remove "${letterToDelete.title || "Untitled Letter"}" from this browser.`}
            </p>

            {isPasswordProtectedDelete && (
              <div className="mb-6">
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => {
                    setDeletePassword(e.target.value)
                    setDeleteError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      confirmDelete()
                    }
                  }}
                  placeholder="Letter password"
                  aria-invalid={Boolean(deleteError)}
                  className={`w-full rounded-2xl border bg-white/5 p-4 outline-none transition placeholder:text-zinc-500 focus:border-[#b8a2ff]/50 ${
                    deleteError ? "border-red-400/70" : "border-[#b8a2ff]/10"
                  }`}
                />
                {deleteError && <p className="mt-2 text-sm text-red-300">{deleteError}</p>}
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteDialog}
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