import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createClient } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const FOLLOW_URL = "https://x.com/busyhandonchain";
const PINNED_TWEET_URL = "https://x.com/busyhandonchain";
const LOCAL_KEY = "busyhands_submitted";
const LOCAL_ACTIONS_KEY = "busyhands_actions";

function isValidUrl(val: string) {
  try {
    const u = new URL(val.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  background: "#111",
  border: hasError ? "2px solid #FF4444" : "2px solid transparent",
  borderRadius: "10px",
  color: "#ccc",
  fontFamily: "'Arial', sans-serif",
  fontSize: "1rem",
  padding: "16px 18px",
  width: "100%",
  outline: "none",
  boxSizing: "border-box",
  transition: "border 0.2s",
});

const labelStyle: React.CSSProperties = {
  fontFamily: "'Arial Black', Arial, sans-serif",
  fontWeight: 900,
  fontSize: "0.85rem",
  letterSpacing: "0.05em",
  color: "#111",
  marginBottom: "6px",
  display: "block",
};

const socialRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#111",
  borderRadius: "10px",
  padding: "14px 18px",
};

const DoneChip = () => (
  <span
    style={{
      background: "#16A34A",
      color: "#fff",
      borderRadius: "8px",
      fontFamily: "'Arial Black', Arial, sans-serif",
      fontWeight: 900,
      fontSize: "0.85rem",
      padding: "8px 18px",
      display: "inline-flex",
      alignItems: "center",
      gap: "5px",
      minWidth: "80px",
      justifyContent: "center",
    }}
  >
    ✓ done
  </span>
);

export default function Register() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [qtUrl, setQtUrl] = useState("");
  const [commentUrl, setCommentUrl] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);

  // Track which social actions were clicked
  const [followed, setFollowed] = useState(false);
  const [liked, setLiked] = useState(false);

  // Field-level errors
  const [qtError, setQtError] = useState(false);
  const [commentError, setCommentError] = useState(false);
  const [walletError, setWalletError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setAlreadySubmitted(true);
      const data = JSON.parse(saved);
      setQtUrl(data.qt_url || "");
      setCommentUrl(data.comment_url || "");
      setWallet(data.wallet || "");
      setFollowed(true);
      setLiked(true);
    }
    const actions = localStorage.getItem(LOCAL_ACTIONS_KEY);
    if (actions) {
      const a = JSON.parse(actions);
      if (a.followed) setFollowed(true);
      if (a.liked) setLiked(true);
    }
  }, []);

  function saveAction(key: "followed" | "liked") {
    const existing = localStorage.getItem(LOCAL_ACTIONS_KEY);
    const current = existing ? JSON.parse(existing) : {};
    current[key] = true;
    localStorage.setItem(LOCAL_ACTIONS_KEY, JSON.stringify(current));
  }

  function handleFollow() {
    window.open(FOLLOW_URL, "_blank", "noopener,noreferrer");
    setFollowed(true);
    saveAction("followed");
  }

  function handleLike() {
    window.open(PINNED_TWEET_URL, "_blank", "noopener,noreferrer");
    setLiked(true);
    saveAction("liked");
  }

  async function handleSubmit() {
    if (alreadySubmitted) return;

    // Validate all fields
    const qtValid = isValidUrl(qtUrl);
    const commentValid = isValidUrl(commentUrl);
    const walletValid = wallet.trim().startsWith("0x") && wallet.trim().length >= 10;

    setQtError(!qtValid);
    setCommentError(!commentValid);
    setWalletError(!walletValid);

    if (!qtValid || !commentValid || !walletValid) {
      toast({
        title: "Check your entries",
        description: "Please fill all fields with valid URLs and a valid EVM wallet address.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("busyhands").insert([
        {
          wallet: wallet.trim(),
          qt_url: qtUrl.trim(),
          comment_url: commentUrl.trim(),
          submitted_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      const payload = { wallet: wallet.trim(), qt_url: qtUrl.trim(), comment_url: commentUrl.trim() };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
      setAlreadySubmitted(true);

      toast({
        title: "Application submitted!",
        description: "You're registered. Stay tuned.",
      });
    } catch (err: any) {
      toast({
        title: "Submission failed",
        description: err.message || "Something went wrong. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
          onClick={() => navigate("/")}
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

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div
          style={{
            background: "#D9D9D9",
            borderRadius: "20px",
            border: "3px solid #111",
            boxShadow: "6px 6px 0 #000",
            padding: "24px",
            width: "100%",
            maxWidth: "520px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          {/* Follow row */}
          <div style={socialRowStyle}>
            <span style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: "0.9rem", color: "#fff", letterSpacing: "0.04em" }}>
              FOLLOW BUSY HANDS
            </span>
            {followed ? (
              <DoneChip />
            ) : (
              <button
                onClick={handleFollow}
                style={{
                  background: "#22C55E",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "'Arial Black', Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  padding: "8px 22px",
                  cursor: "pointer",
                  minWidth: "80px",
                }}
              >
                follow
              </button>
            )}
          </div>

          {/* Like & RT row */}
          <div style={socialRowStyle}>
            <span style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontWeight: 900, fontSize: "0.9rem", color: "#fff", letterSpacing: "0.04em" }}>
              Like &amp; RT pinned tweet
            </span>
            {liked ? (
              <DoneChip />
            ) : (
              <button
                onClick={handleLike}
                style={{
                  background: "#22C55E",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "'Arial Black', Arial, sans-serif",
                  fontWeight: 900,
                  fontSize: "0.85rem",
                  padding: "8px 22px",
                  cursor: "pointer",
                  minWidth: "80px",
                }}
              >
                Like
              </button>
            )}
          </div>

          {/* QT field */}
          <div>
            <span style={labelStyle}>QT with 'Busy hands are coming'</span>
            <input
              style={inputStyle(qtError)}
              type="url"
              placeholder="https://x.com/..../status...."
              value={qtUrl}
              onChange={(e) => {
                if (!alreadySubmitted) {
                  setQtUrl(e.target.value);
                  setQtError(false);
                }
              }}
              readOnly={alreadySubmitted}
            />
            {qtError && (
              <span style={{ color: "#FF4444", fontSize: "0.78rem", fontFamily: "Arial, sans-serif", marginTop: "4px", display: "block" }}>
                Enter a valid https:// link
              </span>
            )}
          </div>

          {/* Comment field */}
          <div>
            <span style={labelStyle}>Tag 2 friends in pinned post comment</span>
            <input
              style={inputStyle(commentError)}
              type="url"
              placeholder="https://x.com/..../status...."
              value={commentUrl}
              onChange={(e) => {
                if (!alreadySubmitted) {
                  setCommentUrl(e.target.value);
                  setCommentError(false);
                }
              }}
              readOnly={alreadySubmitted}
            />
            {commentError && (
              <span style={{ color: "#FF4444", fontSize: "0.78rem", fontFamily: "Arial, sans-serif", marginTop: "4px", display: "block" }}>
                Enter a valid https:// link
              </span>
            )}
          </div>

          {/* Wallet field */}
          <div>
            <span style={labelStyle}>SUBMIT EVM WALLET ADDRESS</span>
            <input
              style={inputStyle(walletError)}
              type="text"
              placeholder="0x........................"
              value={wallet}
              onChange={(e) => {
                if (!alreadySubmitted) {
                  setWallet(e.target.value);
                  setWalletError(false);
                }
              }}
              readOnly={alreadySubmitted}
            />
            {walletError && (
              <span style={{ color: "#FF4444", fontSize: "0.78rem", fontFamily: "Arial, sans-serif", marginTop: "4px", display: "block" }}>
                Enter a valid EVM wallet (starts with 0x)
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || alreadySubmitted}
            style={{
              background: alreadySubmitted
                ? "#22C55E"
                : "linear-gradient(180deg, #FFB800 0%, #FF8C00 100%)",
              border: "3px solid #000",
              borderRadius: "12px",
              fontFamily: "'Arial Black', Arial, sans-serif",
              fontWeight: 900,
              fontSize: "1rem",
              letterSpacing: "0.08em",
              color: alreadySubmitted ? "#fff" : "#000",
              padding: "16px",
              cursor: alreadySubmitted || loading ? "default" : "pointer",
              boxShadow: "3px 3px 0 #000",
              width: "100%",
              marginTop: "4px",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.3s",
            }}
          >
            {alreadySubmitted
              ? "✓ APPLICATION SUBMITTED"
              : loading
              ? "SUBMITTING..."
              : "SUBMIT APPLICATION"}
          </button>
        </div>
      </div>
    </div>
  );
}
