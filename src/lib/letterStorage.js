const LETTER_STORAGE_PREFIX = "lunareth-"

export function getLetterStorageKey(id) {
  return `${LETTER_STORAGE_PREFIX}${id}`
}

export function isLetterStorageKey(key) {
  return key?.startsWith(LETTER_STORAGE_PREFIX)
}

export function saveLetter(letter) {
  localStorage.setItem(getLetterStorageKey(letter.id), JSON.stringify(letter))
}

export function getLetter(id) {
  try {
    const storedLetter = localStorage.getItem(getLetterStorageKey(id))
    return storedLetter ? JSON.parse(storedLetter) : null
  } catch {
    return null
  }
}

export function getSavedLetters() {
  const letters = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (isLetterStorageKey(key)) {
      try {
        const letter = JSON.parse(localStorage.getItem(key))

        if (letter?.id) {
          letters.push(letter)
        }
      } catch {
        // Ignore malformed stored entries so one bad record does not break the dashboard.
      }
    }
  }

  return letters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function deleteLetter(id) {
  localStorage.removeItem(getLetterStorageKey(id))
}
