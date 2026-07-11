import { supabase } from "../lib/supabase"

/**
 * Auth service layer.
 *
 * This module is the ONLY place in the app allowed to call `supabase.auth.*`
 * directly, mirroring the abstraction-boundary pattern already established by
 * `lib/letterStorage.js` (see ARCHITECTURE.md §4, §11). AuthContext consumes
 * these functions; it never talks to the Supabase client itself. Pages never
 * talk to either the client or this module directly except through
 * `useAuth()`.
 *
 * Every function here either returns useful data or throws the Supabase
 * error as-is, so callers can decide how to present it (see Login.jsx /
 * Signup.jsx for the calling convention).
 */


export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/`,
    },
  })

  if (error) {
    throw error
  }
}

export async function signUpWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) throw error

  return data
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) throw error

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession()

  if (error) throw error

  return data.session
}

/**
 * Subscribes to Supabase auth state changes (sign in, sign out, token
 * refresh, session restored on page load, etc).
 *
 * `callback` is invoked with the current session (or null) any time it
 * changes. Returns the subscription object so the caller can unsubscribe on
 * unmount.
 */
export function subscribeToAuthChanges(callback) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return data.subscription
}
