import LetterRenderer from "./LetterRenderer"
import { getLetterStyle } from "../lib/letterConfig"

export default function LetterPreview({
  title,
  recipient,
  message,
  memory,
  hope,
  password,
  style,
}) {
  const s = getLetterStyle(style)

  const wrapperStyle = {
    background: s.bg,
    fontFamily: s.fontFamily,
    borderRadius: "8px",
    overflow: "hidden",
    padding: "1.5rem",
    ...s.pageExtra,
  }

  const containerStyle = {
    ...s.containerStyle,
    width: "100%",
    padding: "2rem 2.25rem",
    boxSizing: "border-box",
  }

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <LetterRenderer
          title={title}
          recipient={recipient}
          message={message}
          memory={memory}
          hope={hope}
          password={password}
          style={style}
          showPasswordBadge
        />
      </div>
    </div>
  )
}
