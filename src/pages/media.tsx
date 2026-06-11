import { useState } from "react";
import { useLocation } from "wouter";

const IMAGES = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/IMG_${1745 + i}.JPG`,
  alt: `Busy Hands ${i + 1}`,
}));

export default function Media() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      style={{
        backgroundColor: "#FF2222",
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Top nav bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 24px",
          background: "#111",
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          color: "#fff",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => navigate("/register")}
          style={{ color: "#fff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.1em" }}
        >
          REGISTER
        </button>
        <button
          onClick={() => navigate("/media")}
          style={{ color: "#fff", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 900, fontSize: "0.85rem", letterSpacing: "0.1em" }}
        >
          MEDIA
        </button>
      </div>

      {/* Preview area — fills remaining space above grid */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px 16px 8px",
          overflow: "hidden",
        }}
      >
        {selected !== null ? (
          <div
            style={{
              width: "100%",
              maxWidth: "500px",
              aspectRatio: "1 / 1",
              borderRadius: "18px",
              border: "3px solid #FFB800",
              boxShadow: "4px 4px 0 #000",
              overflow: "hidden",
              background: "#e8e0f0",
            }}
          >
            <img
              src={IMAGES[selected].src}
              alt={IMAGES[selected].alt}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ) : null}
      </div>

      {/* Grid — fixed at bottom, always visible */}
      <div
        style={{
          flexShrink: 0,
          padding: "0 12px 16px",
        }}
      >
        <div
          style={{
            background: "#D0D0D0",
            borderRadius: "20px",
            border: "3px solid #111",
            boxShadow: "6px 6px 0 #000",
            padding: "12px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
            }}
          >
            {IMAGES.map(({ src, alt }, i) => {
              const isSelected = selected === i;
              return (
                <div
                  key={src}
                  onClick={() => setSelected(isSelected ? null : i)}
                  style={{
                    borderRadius: "12px",
                    border: isSelected ? "3px solid #FFB800" : "3px solid #111",
                    overflow: "hidden",
                    aspectRatio: "1 / 1",
                    background: "#e8e0f0",
                    boxShadow: isSelected ? "0 0 0 2px #FFB800, 2px 2px 0 #000" : "2px 2px 0 #000",
                    cursor: "pointer",
                    opacity: selected !== null && !isSelected ? 0.6 : 1,
                    transform: isSelected ? "scale(0.93)" : "scale(1)",
                    transition: "all 0.18s ease",
                  }}
                >
                  <img
                    src={src}
                    alt={alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
