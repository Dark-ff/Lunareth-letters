import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

/**
 * Wraps a route's content and redirects unauthenticated users to /login.
 *
 * Usage:
 *   <Route path="/create" element={<ProtectedRoute><CreateLetter /></ProtectedRoute>} />
 *
 * The current location is passed along in redirect state so Login.jsx can
 * send the user back to whichever protected page they originally tried to
 * reach, instead of always dropping them on a fixed default page.
 *
 * While the initial session restore is in flight (see AuthContext), this
 * renders a minimal, neutral loading state rather than redirecting
 * prematurely — redirecting before `loading` resolves would incorrectly
 * bounce a genuinely signed-in user to /login on every page refresh.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="lunareth-themed-page flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-500">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
