import { useState } from "react";
import { useLocation } from "wouter";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

type CheckStatus = "idle" | "loading" | "found" | "not_found" | "error";

export default function Checker() {
  const [, navigate] = useLocation();
  const [wallet, setWallet] = useState("");
  const [status, setStatus] = useState<CheckStatus>("idle");

  async function handleCheck() {
    if (!wallet.trim()) return;
    setStatus("loading");

    try {
      const { data, error } = await supabase
        .from("busyhands")
        .select("wallet")
        .ilike("wallet", wallet.trim())
        .limit(1);

      if (error) throw error;

      setStatus(data && data.length > 0 ? "found" : "not_found");
    } catch {
      setStatus("error");
    }
  }

  const statusMessage: Record<string, { text: string; color: string }> = {
    found: { text: "✓ Wallet registered!", color: "#22C55E" },
    not_found: { text: "✗ Wallet not found.", color: "#FF4444" },
    error: { text: "Error checking. Try again.", color: "#FF8C00" },
  };

  return (
    <div
      className="w-full min-h-screen flex flex-col"
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
        }}
      >
        <button
          onClick={() => navigate("/register")}
          style={{
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 900,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
          }}
        >
          REGISTER
        </button>
        <button
          onClick={() => navigate("/media")}
          style={{
            color: "#fff",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontWeight: 900,
            fontSize: "0.85rem",
            letterSpacing: "0.1em",
          }}
        >
          MEDIA
        </button>
      </div>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div
          style={{
            background: "#D9D9D9",
            borderRadius: "20px",
            border: "3px solid #111",
            boxShadow: "6px 6px 0 #000",
            padding: "24px 24px 28px",
            width: "100%",
            maxWidth: "460px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Wallet input */}
          <input
            style={{
              background: "#111",
              border: "none",
              borderRadius: "10px",
              color: "#888",
              fontFamily: "'Arial', sans-serif",
              fontSize: "1rem",
              padding: "16px 18px",
              width: "100%",
              outline: "none",
              boxSizing: "border-box",
            }}
            type="text"
            placeholder="0x........................"
            value={wallet}
            onChange={(e) => {
              setWallet(e.target.value);
              setStatus("idle");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
          />

          {/* Status message */}
          {status in statusMessage && (
            <div
              style={{
                fontFamily: "'Arial Black', Arial, sans-serif",
                fontWeight: 900,
                fontSize: "0.95rem",
                color: statusMessage[status].color,
                textAlign: "center",
                letterSpacing: "0.04em",
              }}
            >
              {statusMessage[status].text}
            </div>
          )}

          {/* Check button */}
          <button
            onClick={handleCheck}
            disabled={status === "loading" || !wallet.trim()}
            style={{
              background:
                status === "loading" || !wallet.trim()
                  ? "#aaa"
                  : "linear-gradient(180deg, #FFB800 0%, #FF8C00 100%)",
              border: "3px solid #000",
              borderRadius: "12px",
              fontFamily: "'Arial Black', Arial, sans-serif",
              fontWeight: 900,
              fontSize: "1.1rem",
              letterSpacing: "0.1em",
              color: "#000",
              padding: "14px",
              cursor:
                status === "loading" || !wallet.trim()
                  ? "not-allowed"
                  : "pointer",
              boxShadow: "3px 3px 0 #000",
              width: "100%",
              transition: "transform 0.08s, box-shadow 0.08s",
            }}
            onMouseDown={(e) => {
              if (status !== "loading" && wallet.trim()) {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translate(2px, 2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "1px 1px 0 #000";
              }
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "3px 3px 0 #000";
            }}
          >
            {status === "loading" ? "CHECKING..." : "CHECK"}
          </button>
        </div>
      </div>
    </div>
  );
}
