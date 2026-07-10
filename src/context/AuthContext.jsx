import { createContext, useEffect, useState } from "react"
import {
  getCurrentSession,
  signInWithEmail,
  signOut as signOutRequest,
  signUpWithEmail,
  subscribeToAuthChanges,
} from "../services/auth"

/**
 * AuthContext owns exactly three pieces of state — session, user, and
 * loading — following the same "smallest necessary scope, single owner"
 * rule used elsewhere in the app for page-level state (see ARCHITECTURE.md
 * §9). `user` is always derived from `session` (never set independently),
 * so the two can never drift out of sync with each other.
 *
 * This context does not call the Supabase client directly — it only calls
 * functions from `services/auth.js`, keeping that module the single
 * abstraction boundary for authentication (ARCHITECTURE.md §4, §11).
 */

export const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Restore any existing session on first load (page refresh, new tab,
    // etc). This is what makes sessions persist across a refresh — the
    // Supabase client itself persists the underlying token, this just reads
    // it back into React state on mount.
    getCurrentSession()
      .then((currentSession) => {
        if (!isMounted) return
        setSession(currentSession)
      })
      .catch(() => {
        if (!isMounted) return
        setSession(null)
      })
      .finally(() => {
        if (!isMounted) return
        setLoading(false)
      })

    // Keep session in sync with sign in, sign out, and token refresh events
    // for the lifetime of the app.
    const subscription = subscribeToAuthChanges((nextSession) => {
      if (!isMounted) return
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const signUp = async ({ email, password }) => {
    return signUpWithEmail({ email, password })
  }

  const signIn = async ({ email, password }) => {
    return signInWithEmail({ email, password })
  }

  const signOut = async () => {
    await signOutRequest()
  }

  const value = {
    user: session?.user ?? null,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
