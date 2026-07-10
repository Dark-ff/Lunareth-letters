import { useContext } from "react"
import { AppThemeContext } from "../context/AppThemeContext"

export function useAppTheme() {
  const context = useContext(AppThemeContext)

  if (context === undefined) {
    throw new Error("useAppTheme must be used within an AppThemeProvider")
  }

  return context
}
