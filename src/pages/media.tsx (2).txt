import { useState } from "react";
import { useLocation } from "wouter";

const IMAGES = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/IMG_${1745 + i}.JPG`,
  alt: `Busy Hands ${i + 1}`,
}));

export default function Media() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<number | null>(null);

  function handleTap(i: number) {
    setSelected(selected === i ? null : i);
  }

  return (
    <div
      className="relative w-full min-h-screen flex flex-col"
      style={{ backgroundColor: "#FF2222" }}
    >
      {/* Top nav bar */}
      <div
        className="flex justify-between items-center px-6 py-3"
        style={{
          background: "#111",
          fontFamily: "'Arial Black', Arial, sans-serif",
          fontWeight: 900,
          fontSize: "0.85rem",
          letterSpacing: "0.1em",
          color: "#fff",
          zIndex: 10,
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

      {/* Grid container */}
      <div className="flex-1 flex items-start justify-center px-4" style={{ paddingTop: "28px", paddingBottom: "24px" }}>
        <div
          style={{
            background: "#D0D0D0",
            borderRadius: "20px",
            border: "3px solid #111",
            boxShadow: "6px 6px 0 #000",
            padding: "16px",
            width: "100%",
            maxWidth: "860px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
            }}
          >
            {IMAGES.map(({ src, alt }, i) => {
              const isSelected = selected === i;
              return (
                <div
                  key={src}
                  onClick={() => handleTap(i)}
                  style={{
                    gridColumn: isSelected ? "1 / -1" : undefined,
                    borderRadius: "14px",
                    border: isSelected ? "3px solid #FFB800" : "3px solid #111",
                    overflow: "hidden",
                    aspectRatio: isSelected ? "16 / 9" : "1 / 1",
                    background: "#e8e0f0",
                    boxShadow: isSelected ? "0 0 0 3px #FFB800, 3px 3px 0 #000" : "3px 3px 0 #000",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                  }}
                >
                  <img
                    src={src}
                    alt={alt}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: isSelected ? "contain" : "cover",
                      display: "block",
                      background: isSelected ? "#1a1a2e" : "transparent",
                    }}
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
