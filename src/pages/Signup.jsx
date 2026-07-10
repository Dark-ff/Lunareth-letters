import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useAuth } from "../hooks/useAuth"

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setInfo("")

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const data = await signUp({ email, password })

      // If email confirmation is enabled on the Supabase project, signUp
      // succeeds but returns no session until the user confirms their
      // email — handle both configurations rather than assuming one.
      if (data.session) {
        navigate("/my-letters", { replace: true })
      } else {
        setInfo("Check your email to confirm your account, then log in.")
      }
    } catch (err) {
      setError(err?.message || "Unable to create an account.")
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
            Get Started
          </p>
          <h1 className="mb-8 text-4xl font-bold">Create Account</h1>

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
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-2xl border border-[#b8a2ff]/10 bg-white/5 p-4 outline-none transition placeholder:text-zinc-500 focus:border-[#b8a2ff]/50"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="mb-2 block text-sm text-zinc-400">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-[#b8a2ff]/10 bg-white/5 p-4 outline-none transition placeholder:text-zinc-500 focus:border-[#b8a2ff]/50"
              />
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}
            {info && <p className="text-sm text-[#d6ccff]">{info}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-[#b8a2ff] px-6 py-3 text-black transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-sm text-zinc-400">
            Already have an account?{" "}
            <Link to="/login" className="text-[#b8a2ff] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
