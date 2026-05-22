export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-6 border-b border-[#b8a2ff]/10 bg-black text-white">
      <h1 className="text-xl font-semibold tracking-wide">
        Lilac Letters
      </h1>

      <button className="rounded-full border border-zinc-700 px-5 py-2 text-sm transition hover:bg-white hover:text-black">
        Create Letter
      </button>
    </nav>
  )
}