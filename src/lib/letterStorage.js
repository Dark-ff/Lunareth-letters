import { supabase } from "./supabase"
const LETTER_STORAGE_PREFIX = "lunareth-"

export function getLetterStorageKey(id) {
  return `${LETTER_STORAGE_PREFIX}${id}`
}

export function isLetterStorageKey(key) {
  return key?.startsWith(LETTER_STORAGE_PREFIX)
}

export async function saveLetter(letter) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User is not authenticated")
  }

  const password = (letter.password ?? "").trim()

const { error } = await supabase.from("letters").insert({
  user_id: user.id,
  title: letter.title,
  recipient: letter.recipient,
  content: letter.message,
  theme: letter.theme,
  style: letter.style,
  memory: letter.memory,
  hope: letter.hope,
  is_password_protected: password !== "",
  password_hash: password || null,
})


  if (error) {
    throw error
  }
}

export async function getLetter(id) {
  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    title: data.title,
    recipient: data.recipient,
    message: data.content,
    memory: data.memory,
    hope: data.hope,
    password: data.password_hash || "",
    theme: data.theme,
    style: data.style,
    createdAt: data.created_at,
  }
}

export async function getSavedLetters() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new Error("User is not authenticated")
  }

  const { data, error } = await supabase
    .from("letters")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data.map((letter) => ({
    id: letter.id,
    title: letter.title,
    recipient: letter.recipient,
    message: letter.content,
    memory: letter.memory,
    hope: letter.hope,
    password: "",
    theme: letter.theme,
    style: letter.style,
    createdAt: letter.created_at,
    isPasswordProtected: letter.is_password_protected,
  }))
}

export async function deleteLetter(id) {
  const { error } = await supabase
    .from("letters")
    .delete()
    .eq("id", id)

  if (error) {
    throw error
  }
}
