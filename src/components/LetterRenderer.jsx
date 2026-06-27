import { formatLetterDate, getLetterStyle } from "../lib/letterConfig"

const previewLayout = {
  titleTag: "h2",
  titleSize: "1.4rem",
  titleMargin: "0.4rem",
  recipientSize: "0.72rem",
  recipientMargin: "0.2rem",
  dateSize: "0.7rem",
  dateMargin: "1.25rem",
  dividerMargin: "1.25rem",
  messageSize: "0.95rem",
  messageLineHeight: "1.9",
  sectionDividerMargin: "1.5rem 0 1.25rem",
  sectionGap: "1rem",
  sectionLabelSize: "0.65rem",
  sectionLabelMargin: "0.3rem",
  sectionTextSize: "0.88rem",
}

const fullLayout = {
  titleTag: "h1",
  titleSize: "2rem",
  titleMargin: "0.5rem",
  recipientSize: "0.8rem",
  recipientMargin: "0.25rem",
  dateSize: "0.78rem",
  dateMargin: "1.5rem",
  dividerMargin: "1.75rem",
  messageSize: "1.05rem",
  messageLineHeight: "1.95",
  sectionDividerMargin: "2rem 0 1.5rem",
  sectionGap: "1.25rem",
  sectionLabelSize: "0.7rem",
  sectionLabelMargin: "0.35rem",
  sectionTextSize: "0.95rem",
}

export default function LetterRenderer({
  title,
  recipient,
  message,
  memory,
  hope,
  password,
  style,
  createdAt,
  variant = "preview",
  showPasswordBadge = false,
}) {
  const s = getLetterStyle(style)
  const layout = variant === "full" ? fullLayout : previewLayout
  const TitleTag = layout.titleTag
  const hasMessage = Boolean(message?.trim())
  const hasHeader = Boolean(title?.trim() || recipient?.trim() || message?.trim())
  const letterDate = createdAt ? formatLetterDate(createdAt) : formatLetterDate(new Date())

  return (
    <>
      <TitleTag
        style={{
          fontSize: layout.titleSize,
          fontWeight: "bold",
          color: s.text,
          marginBottom: layout.titleMargin,
          lineHeight: 1.3,
        }}
      >
        {title?.trim() || "Untitled Letter"}
      </TitleTag>

      {recipient?.trim() && (
        <p
          style={{
            color: s.subtext,
            fontSize: layout.recipientSize,
            marginBottom: layout.recipientMargin,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          To: {recipient}
        </p>
      )}

      {hasHeader && (
        <p
          style={{
            color: s.subtext,
            fontSize: layout.dateSize,
            marginBottom: layout.dateMargin,
          }}
        >
          {letterDate}
        </p>
      )}

      {hasHeader && (
        <div
          style={{
            borderTop: `1px solid ${s.divider}`,
            marginBottom: layout.dividerMargin,
          }}
        />
      )}

      <p
        style={{
          color: hasMessage ? s.text : s.subtext,
          lineHeight: layout.messageLineHeight,
          fontSize: layout.messageSize,
          whiteSpace: "pre-wrap",
          opacity: hasMessage ? 0.92 : 0.5,
          fontStyle: hasMessage ? "normal" : "italic",
        }}
      >
        {hasMessage ? message : "What have you been wanting to say?"}
      </p>

      {(memory?.trim() || hope?.trim()) && (
        <>
          <div
            style={{
              borderTop: `1px solid ${s.divider}`,
              margin: layout.sectionDividerMargin,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: layout.sectionGap }}>
            {memory?.trim() && (
              <div>
                <p
                  style={{
                    color: s.accent,
                    fontSize: layout.sectionLabelSize,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: layout.sectionLabelMargin,
                  }}
                >
                  A memory I hold
                </p>
                <p
                  style={{
                    color: s.text,
                    fontSize: layout.sectionTextSize,
                    lineHeight: "1.7",
                    opacity: 0.8,
                  }}
                >
                  {memory}
                </p>
              </div>
            )}

            {hope?.trim() && (
              <div>
                <p
                  style={{
                    color: s.accent,
                    fontSize: layout.sectionLabelSize,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: layout.sectionLabelMargin,
                  }}
                >
                  A hope I carry
                </p>
                <p
                  style={{
                    color: s.text,
                    fontSize: layout.sectionTextSize,
                    lineHeight: "1.7",
                    opacity: 0.8,
                  }}
                >
                  {hope}
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {showPasswordBadge && password?.trim() && (
        <p
          style={{
            marginTop: "1.5rem",
            color: s.subtext,
            fontSize: "0.7rem",
            letterSpacing: "0.08em",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <span aria-hidden="true">{"\uD83D\uDD12"}</span>
          <span style={{ textTransform: "uppercase" }}>Password protection enabled</span>
        </p>
      )}
    </>
  )
}

