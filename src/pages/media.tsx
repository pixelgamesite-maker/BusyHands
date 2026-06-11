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

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", padding: "20px 16px 24px" }}>

        {/* Preview box — top, square, only visible when image selected */}
        {selected !== null && (
          <div style={{ display: "flex", justifyContent: "center" }}>
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
          </div>
        )}

        {/* Grid */}
        <div style={{ display: "flex", justifyContent: "center" }}>
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
                    onClick={() => setSelected(isSelected ? null : i)}
                    style={{
                      borderRadius: "14px",
                      border: isSelected ? "3px solid #FFB800" : "3px solid #111",
                      overflow: "hidden",
                      aspectRatio: "1 / 1",
                      background: "#e8e0f0",
                      boxShadow: isSelected ? "0 0 0 2px #FFB800, 2px 2px 0 #000" : "3px 3px 0 #000",
                      cursor: "pointer",
                      opacity: selected !== null && !isSelected ? 0.65 : 1,
                      transform: isSelected ? "scale(0.94)" : "scale(1)",
                      transition: "all 0.2s ease",
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
    </div>
  );
}
            
