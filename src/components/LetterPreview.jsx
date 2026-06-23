export default function LetterPreview({
  title,
  message,
  theme,
  style,
  password,
}) {
  const styles = {
    Moonlit: {
      bg: "#111827",
      text: "#F3F4F6",
      border: "#A594E0",
    },

    "Old Paper": {
      bg: "#F5E6C8",
      text: "#3B2F2F",
      border: "#C8A97E",
    },

    "Dark Aesthetic": {
      bg: "#090909",
      text: "#D1D5DB",
      border: "#444",
    },

    Minimal: {
      bg: "#FFFFFF",
      text: "#111111",
      border: "#D1D5DB",
    },
  }

  const current = styles[style] || styles.Moonlit

  return (
    <div
      className="rounded-3xl border p-10 transition-all duration-300"
      style={{
        backgroundColor: current.bg,
        color: current.text,
        borderColor: current.border,
      }}
    >
      <h2 className="mb-4 text-3xl font-semibold">
        {title || "Untitled Letter"}
      </h2>

      <p className="whitespace-pre-wrap leading-relaxed">
        {message || "Your letter will appear here as you write..."}
      </p>

      <div className="mt-10 border-t pt-6">
        <p className="text-sm">
          Theme: {theme} • Style: {style}
        </p>

        <p className="mt-2 text-sm opacity-70">
          {password
            ? "Password protection enabled"
            : "No password set"}
        </p>
      </div>
    </div>
  )
}