import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"
import { signInWithGoogle } from "../services/auth"

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

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

  const handleGoogleSignIn = async () => {
    setError("")
    setIsGoogleSubmitting(true)

    try {
      await signInWithGoogle()
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || "Unable to sign in with Google.")
    } finally {
      setIsGoogleSubmitting(false)
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

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isGoogleSubmitting || isSubmitting}
            className="mb-5 flex w-full items-center justify-center gap-3 rounded-full border border-[#b8a2ff]/10 bg-white/5 px-6 py-3 text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.09V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.85z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.85C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            {isGoogleSubmitting ? "Signing In..." : "Continue with Google"}
          </button>

          <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-zinc-500">
            <span className="h-px flex-1 bg-white/10" />
            or
            <span className="h-px flex-1 bg-white/10" />
          </div>

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
