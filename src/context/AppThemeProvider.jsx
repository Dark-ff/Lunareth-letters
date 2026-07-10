import { useEffect, useMemo, useState } from "react"
import { DEFAULT_LETTER_STYLE, getLetterStyle, LETTER_STYLE_NAMES } from "../lib/letterConfig"
import { AppThemeContext } from "./AppThemeContext"

const APP_THEME_STORAGE_KEY = "lunareth-app-theme"

function getStoredTheme() {
  try {
    const storedTheme = localStorage.getItem(APP_THEME_STORAGE_KEY)
    return LETTER_STYLE_NAMES.includes(storedTheme) ? storedTheme : DEFAULT_LETTER_STYLE
  } catch {
    return DEFAULT_LETTER_STYLE
  }
}

export function AppThemeProvider({ children }) {
  const [appTheme, setAppTheme] = useState(getStoredTheme)

  useEffect(() => {
    document.documentElement.dataset.lunarethTheme = appTheme

    try {
      localStorage.setItem(APP_THEME_STORAGE_KEY, appTheme)
    } catch {
      // Theme persistence should never block the app if localStorage is unavailable.
    }
  }, [appTheme])

  const value = useMemo(
    () => ({
      appTheme,
      appThemeTokens: getLetterStyle(appTheme),
      setAppTheme,
      themeNames: LETTER_STYLE_NAMES,
    }),
    [appTheme]
  )

  return <AppThemeContext.Provider value={value}>{children}</AppThemeContext.Provider>
}
