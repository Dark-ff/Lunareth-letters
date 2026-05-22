import Navbar from "../components/Navbar"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.15),transparent_40%)]">
      <Navbar />

      <section className="flex flex-col items-center justify-center text-center px-6 py-40">
  <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
    Private Digital Letters
  </p>

  <h1 className="mb-6 max-w-4xl text-6xl font-bold leading-tight">
    Some words are easier written than spoken.
  </h1>

  <p className="mb-10 max-w-2xl text-lg text-[#d6ccff]">
    Create beautiful password-protected letters and share them privately with the people who matter.
  </p>

  <button className="rounded-full border border-[#b8a2ff]/40 px-8 py-4 text-sm transition hover:bg-white hover:text-black">
    Write a Letter
  </button>
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
      Lilac Letters lets you send private digital letters wrapped in atmosphere, memory, and intention.
    </p>
  </div>
</section>
<section className="px-6 pb-24">
  <div className="mx-auto max-w-4xl rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-10 backdrop-blur-sm">
    <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
      Random Thought
    </p>

    <blockquote className="text-2xl leading-relaxed text-[#ebe7ff]">
      “People remember how a letter made them feel long after they forget the words.”
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
      Lilac Letters is still growing. Your thoughts, ideas, and feedback genuinely help shape it.
    </p>

    <textarea
      placeholder="Share your thoughts..."
      className="mb-6 h-40 w-full rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-6 text-white outline-none placeholder:text-zinc-500"
    />

    <button className="rounded-full border border-[#b8a2ff]/30 px-8 py-4 text-sm transition hover:bg-white hover:text-black">
      Send Feedback
    </button>
  </div>
</section>
    </div>
  )
}