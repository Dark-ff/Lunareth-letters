import StarField from "../components/background/StarField"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="lunareth-themed-page relative min-h-screen bg-[#05060D] text-[#E8E4F4]">
      <StarField />
      <div className="relative z-10">
      <Navbar />

      <section className="flex flex-col items-center justify-center px-6 py-40 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-[#A594E0]">
          Intentional Digital Letters
        </p>

        <h1 className="mx-auto mb-6 max-w-4xl text-6xl font-light italic leading-tight">
          Some words deserve more than{" "}
          <span className="text-[#A594E0]">a notification</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg text-[#B8B2D4]">
          Lunareth lets you write password-protected letters wrapped in memory,
          intention and emotion — meant to be opened, not scrolled past.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/create"
            className="rounded-full bg-[#A594E0] px-8 py-4 text-white transition hover:opacity-90"
          >
            Write a Letter
          </Link>

          <Link
            to="/my-letters"
            className="rounded-full border border-[#A594E0]/30 px-8 py-4 text-[#E8E4F4] transition hover:border-[#A594E0]"
          >
            My Letters
          </Link>
        </div>
      </section>

      <section className="border-t border-[#b8a2ff]/10 px-6 py-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
            A Different Way To Speak
          </p>

          <h2 className="mb-6 text-4xl font-semibold">
            Not every feeling belongs in a chat bubble.
          </h2>

          <p className="mx-auto max-w-2xl text-lg text-[#d6ccff]">
            Lunareth is a space for words that carry weight — crafted with care,
            protected with intention, and shared through a private link.
          </p>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-10 backdrop-blur-sm">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
            Random Thought
          </p>

          <blockquote className="text-2xl leading-relaxed text-[#ebe7ff]">
            “People remember how a letter made them feel long after they forget
            the words.”
          </blockquote>
        </div>
      </section>

      <section className="border-t border-[#b8a2ff]/10 px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
            Feedback
          </p>

          <h2 className="mb-6 text-4xl font-semibold">
            Tell me what this made you feel.
          </h2>

          <p className="mb-10 text-lg text-[#d6ccff]">
            Lunareth is still taking shape. Your feedback will help me make it
            better.
          </p>

          <textarea
            placeholder="Share your thoughts..."
            className="mb-6 h-40 w-full rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-6 text-white outline-none placeholder:text-zinc-500"
          />

          <button className="rounded-full border border-[#b8a2ff]/30 px-8 py-4 text-sm transition hover:bg-white hover:text-black">
            Send Feedback
          </button>
        </div>

        <footer className="mt-24 border-t border-[#b8a2ff]/10 px-6 py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
            <div>
              <h3 className="mb-3 text-2xl font-semibold">
                Lunareth
              </h3>

              <p className="max-w-md text-[#d6ccff]">
                A quiet space for words that deserve more than a notification
                bubble.
              </p>
            </div>

            <div className="space-y-2 text-[#d6ccff]">
              <p>Instagram</p>
              <p>LinkedIn</p>
              <p>Email</p>
            </div>
          </div>
        </footer>
      </section>
      </div>
    </div>
  )
}
