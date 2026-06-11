import { useState } from "react";
import { useLocation } from "wouter";

const IMAGES = Array.from({ length: 12 }, (_, i) => ({
  src: `/images/IMG_${1745 + i}.JPG`,
  alt: `Busy Hands ${i + 1}`,
}));

export default function Media() {
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<string | null>(null);

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

      {/* Preview box — top area */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "24px 16px 0",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            aspectRatio: "16 / 9",
            background: selected ? "transparent" : "#BB1111",
            borderRadius: "16px",
            border: "3px solid #111",
            boxShadow: "4px 4px 0 #000",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selected ? (
            <img
              src={selected}
              alt="Preview"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <span
              style={{
                fontFamily: "'Arial Black', Arial, sans-serif",
                fontWeight: 900,
                fontSize: "0.9rem",
                color: "#FF6666",
                letterSpacing: "0.05em",
                textAlign: "center",
                padding: "0 16px",
              }}
            >
              TAP AN IMAGE TO PREVIEW
            </span>
          )}
        </div>
      </div>

      {/* Grid container — shifted down with top margin */}
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
            {IMAGES.map(({ src, alt }) => (
              <div
                key={src}
                onClick={() => setSelected(src)}
                style={{
                  borderRadius: "14px",
                  border: selected === src ? "3px solid #FFB800" : "3px solid #111",
                  overflow: "hidden",
                  aspectRatio: "1 / 1",
                  background: "#e8e0f0",
                  boxShadow: selected === src ? "0 0 0 3px #FFB800, 3px 3px 0 #000" : "3px 3px 0 #000",
                  cursor: "pointer",
                  transition: "border 0.15s, box-shadow 0.15s",
                  transform: selected === src ? "scale(0.96)" : "scale(1)",
                }}
              >
                <img
                  src={src}
                  alt={alt}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen lightbox overlay */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "16px",
              border: "3px solid #FFB800",
              boxShadow: "0 0 40px rgba(255,184,0,0.3)",
              overflow: "hidden",
            }}
          >
            <img
              src={selected}
              alt="Full preview"
              style={{ display: "block", maxWidth: "90vw", maxHeight: "85vh", objectFit: "contain" }}
            />
            {/* Close button */}
            <button
              onClick={() => setSelected(null)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "#FFB800",
                border: "2px solid #000",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                fontFamily: "'Arial Black', Arial, sans-serif",
                fontWeight: 900,
                fontSize: "1rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
