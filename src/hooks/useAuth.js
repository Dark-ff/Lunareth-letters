import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

/**
 * Exposes AuthContext to components. Throws early and clearly if used
 * outside an AuthProvider, rather than silently returning undefined and
 * failing later with a confusing "cannot read property of undefined" error
 * somewhere unrelated.
 */
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
