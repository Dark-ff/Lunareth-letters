import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || "/my-letters"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await signIn({ email, password })
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || "Unable to sign in. Check your email and password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="lunareth-themed-page min-h-screen bg-black px-6 pt-24 pb-16 text-white">
        <div className="mx-auto max-w-md">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-[#b8a2ff]">
            Welcome Back
          </p>
          <h1 className="mb-8 text-4xl font-bold">Log In</h1>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-3xl border border-[#b8a2ff]/10 bg-white/5 p-7"
          >
            <div>
              <label htmlFor="email" className="mb-2 block text-sm text-zinc-400">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-[#b8a2ff]/10 bg-white/5 p-4 outline-none transition placeholder:text-zinc-500 focus:border-[#b8a2ff]/50"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm text-zinc-400">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#b8a2ff]/10 bg-white/5 p-4 outline-none transition placeholder:text-zinc-500 focus:border-[#b8a2ff]/50"
              />
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#b8a2ff] px-6 py-3 text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Signing In..." : "Log In"}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#b8a2ff] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
