import { AnimatePresence, motion } from "framer-motion"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useAppTheme } from "../hooks/useAppTheme"
import { getLetterStyle } from "../lib/letterConfig"

const baseLinks = [{ label: "Home", to: "/" }]

const loggedOutLinks = [
  ...baseLinks,
  { label: "Write", to: "/create" },
  { label: "Login", to: "/login" },
  { label: "Sign Up", to: "/signup", isPrimary: true },
]

const loggedInLinks = [
  ...baseLinks,
  { label: "Write", to: "/create" },
  { label: "My Letters", to: "/my-letters" },
  { label: "Profile", to: "/my-letters", isProfile: true },
]

function MoonMark({ className = "h-5 w-5" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M16.6 3.5a8.4 8.4 0 1 0 3.7 12.6A9.4 9.4 0 0 1 16.6 3.5Z"
        fill="currentColor"
      />
      <path
        d="M7.4 15.8c2.7-.5 5.1-1.9 7.1-4.1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

function MenuIcon({ isOpen }) {
  return (
    <span className="relative block h-4 w-5" aria-hidden="true">
      <motion.span
        className="absolute left-0 top-0 h-px w-5 bg-current"
        animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
      />
      <motion.span
        className="absolute left-0 top-2 h-px w-5 bg-current"
        animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
      />
      <motion.span
        className="absolute left-0 top-4 h-px w-5 bg-current"
        animate={isOpen ? { rotate: -45, y: -9 } : { rotate: 0, y: 0 }}
      />
    </span>
  )
}

function NavLink({ link, isActive, onClick }) {
  return (
    <Link
      to={link.to}
      onClick={onClick}
      className={`relative rounded-full px-4 py-2 text-sm transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 ${
        link.isPrimary
          ? "bg-[#b8a2ff] text-black shadow-[0_0_28px_-10px_rgba(184,162,255,0.9)]"
          : isActive
            ? "text-white"
            : "text-[#d6ccff]/75 hover:text-white"
      }`}
    >
      {isActive && !link.isPrimary && (
        <motion.span
          layoutId="lunareth-active-nav"
          className="absolute inset-0 -z-10 rounded-full border border-[#b8a2ff]/25 bg-white/[0.08]"
          transition={{ type: "spring", stiffness: 360, damping: 32 }}
        />
      )}
      <span className="relative">{link.label}</span>
    </Link>
  )
}

function ThemeSelector({ isCompact = false }) {
  const { appTheme, setAppTheme, themeNames } = useAppTheme()
  const [isOpen, setIsOpen] = useState(false)
  const currentTokens = getLetterStyle(appTheme)

  const chooseTheme = (themeName) => {
    setAppTheme(themeName)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className={`flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] text-sm text-[#d6ccff] transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 ${
          isCompact ? "w-full justify-between px-4 py-2" : "px-3 py-2"
        }`}
      >
        <span
          className="h-3 w-3 rounded-full ring-1 ring-white/30"
          style={{ background: currentTokens.accent }}
          aria-hidden="true"
        />
        <span>{isCompact ? `Theme: ${appTheme}` : appTheme}</span>
        <motion.span
          aria-hidden="true"
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-xs text-[#d6ccff]/70"
        >
          v
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`absolute right-0 z-20 mt-2 overflow-hidden rounded-3xl border border-white/10 bg-black/85 p-2 shadow-[0_24px_80px_-36px_rgba(184,162,255,0.75)] backdrop-blur-xl ${
              isCompact ? "left-0 right-0" : "w-56"
            }`}
          >
            <div className="grid gap-1">
              {themeNames.map((themeName) => {
                const tokens = getLetterStyle(themeName)
                const isActive = appTheme === themeName

                return (
                  <button
                    key={themeName}
                    type="button"
                    onClick={() => chooseTheme(themeName)}
                    className={`relative flex items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 ${
                      isActive ? "text-white" : "text-[#d6ccff]/75 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`lunareth-theme-option-${isCompact ? "mobile" : "desktop"}`}
                        className="absolute inset-0 -z-10 rounded-2xl border border-[#b8a2ff]/20 bg-white/[0.08]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span
                      className="h-3.5 w-3.5 rounded-full ring-1 ring-white/30"
                      style={{ background: tokens.accent }}
                      aria-hidden="true"
                    />
                    <span>{themeName}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Navbar() {
  const { user, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isLoggedIn = Boolean(user)
  const links = isLoggedIn ? loggedInLinks : loggedOutLinks
  const userLabel = user?.email?.split("@")[0] || "Profile"

  const closeMobileNav = () => setIsMobileOpen(false)

  const isActivePath = (to) => {
    if (to === "/") return location.pathname === "/"
    return location.pathname.startsWith(to)
  }

  const handleLogout = async () => {
    closeMobileNav()
    await signOut()
    navigate("/", { replace: true })
  }

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-4 z-50 px-4 text-white sm:top-5">
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="lunareth-glass-nav pointer-events-auto mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-black/45 px-4 py-3 shadow-[0_24px_80px_-36px_rgba(184,162,255,0.65)] backdrop-blur-xl sm:px-5"
      >
        <Link
          to="/"
          onClick={closeMobileNav}
          className="group flex items-center gap-3 rounded-full focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b8a2ff]/25 bg-[#b8a2ff]/10 text-[#d6ccff] transition-colors duration-300 group-hover:text-white">
            <MoonMark />
          </span>
          <span className="hidden font-serif text-lg font-normal tracking-wide text-white sm:block">
            Lunareth
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={`${link.label}-${link.to}`}
              link={link.isProfile ? { ...link, label: userLabel } : link}
              isActive={link.isProfile ? false : isActivePath(link.to)}
            />
          ))}

          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-full px-4 py-2 text-sm text-[#d6ccff]/75 transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Logout
            </button>
          )}

          <ThemeSelector />
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((current) => !current)}
          aria-expanded={isMobileOpen}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#b8a2ff]/20 bg-white/[0.04] text-[#d6ccff] transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 md:hidden"
        >
          <MenuIcon isOpen={isMobileOpen} />
        </button>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="lunareth-glass-panel pointer-events-auto mx-auto mt-3 max-w-6xl overflow-hidden rounded-[28px] border border-white/10 bg-black/75 p-3 shadow-[0_28px_90px_-40px_rgba(184,162,255,0.7)] backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-1">
              {links.map((link) => (
                <NavLink
                  key={`${link.label}-${link.to}-mobile`}
                  link={link.isProfile ? { ...link, label: userLabel } : link}
                  isActive={link.isProfile ? false : isActivePath(link.to)}
                  onClick={closeMobileNav}
                />
              ))}

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="rounded-full px-4 py-2 text-left text-sm text-[#d6ccff]/75 transition-colors duration-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#b8a2ff]/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Logout
                </button>
              )}

              <ThemeSelector isCompact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
