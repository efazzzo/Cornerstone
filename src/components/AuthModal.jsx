"use client";

import { useState } from "react";
import { COLORS } from "@/data/farms";

// ⚠️  PROTOTYPE AUTH — NOT FOR PRODUCTION
// Passwords are stored in plain text in localStorage.
// Before launching, replace this with Supabase, Firebase Auth, or another
// real auth provider. Never ship plain-text password storage to users.

function getUsers() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem("cornerstone_users") || "[]"); } catch { return []; }
}

function saveUser(user) {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("cornerstone_users", JSON.stringify(users));
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("cornerstone_current_user") || "null"); } catch { return null; }
}

export function signOut() {
  if (typeof window !== "undefined") localStorage.removeItem("cornerstone_current_user");
}

export default function AuthModal({ mode: initialMode = "signup", onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode); // "signup" | "signin"
  const [role, setRole] = useState("farmer"); // "farmer" | "buyer"
  const [step, setStep] = useState(1); // signup step 1=role, 2=details
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSignUp() {
    setError("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }

    const users = getUsers();
    if (users.find((u) => u.email === form.email)) { setError("An account with that email already exists."); return; }

    setLoading(true);
    const user = { id: Date.now(), name: form.name, email: form.email, password: form.password, role, createdAt: new Date().toISOString() };
    saveUser(user);
    localStorage.setItem("cornerstone_current_user", JSON.stringify(user));
    setLoading(false);
    onSuccess(user);
  }

  async function handleSignIn() {
    setError("");
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    const users = getUsers();
    const user = users.find((u) => u.email === form.email && u.password === form.password);
    if (!user) { setError("Incorrect email or password."); return; }
    localStorage.setItem("cornerstone_current_user", JSON.stringify(user));
    onSuccess(user);
  }

  const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(201,149,42,0.3)",
    borderRadius: 8,
    padding: "11px 14px",
    color: COLORS.cream,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  };

  const labelStyle = { color: "rgba(245,237,217,0.5)", fontSize: 11, letterSpacing: 1, marginBottom: 5, display: "block" };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: `linear-gradient(135deg, #1B2A4A 0%, #0B1F3A 100%)`, border: `1px solid rgba(201,149,42,0.35)`, borderRadius: 16, padding: 32, width: "100%", maxWidth: 420, position: "relative" }} onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(245,237,217,0.4)", fontSize: 20, cursor: "pointer", lineHeight: 1 }}>×</button>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, background: `linear-gradient(135deg, #C9952A, #8B6914)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⬡</div>
          <div>
            <div style={{ color: COLORS.cream, fontSize: 16, fontFamily: "Georgia, serif", fontWeight: 700 }}>Cornerstone</div>
            <div style={{ color: COLORS.gold, fontSize: 9, letterSpacing: 2 }}>AMERICAN LAND SOVEREIGNTY</div>
          </div>
        </div>

        {mode === "signup" && (
          <>
            <div style={{ color: COLORS.cream, fontSize: 20, fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: 4 }}>Create your account</div>
            <div style={{ color: "rgba(245,237,217,0.5)", fontSize: 13, marginBottom: 24 }}>Join the network protecting America&apos;s family farms.</div>

            {/* Role selector */}
            <div style={{ marginBottom: 20 }}>
              <div style={labelStyle}>I AM A</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ key: "farmer", label: "🌾 Farmer / Landowner", desc: "List my farm & get resources" }, { key: "buyer", label: "🛒 Buyer / Partner", desc: "Source from local farms" }].map((r) => (
                  <button key={r.key} onClick={() => setRole(r.key)} style={{ flex: 1, background: role === r.key ? "rgba(201,149,42,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${role === r.key ? COLORS.gold : "rgba(201,149,42,0.2)"}`, borderRadius: 8, padding: "10px 8px", cursor: "pointer", textAlign: "center", transition: "all 0.15s" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: role === r.key ? COLORS.gold : COLORS.cream, marginBottom: 2 }}>{r.label}</div>
                    <div style={{ fontSize: 10, color: "rgba(245,237,217,0.4)" }}>{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>FULL NAME</label>
              <input value={form.name} onChange={update("name")} placeholder="Robert Halley" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>EMAIL</label>
              <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>PASSWORD</label>
              <input type="password" value={form.password} onChange={update("password")} placeholder="At least 6 characters" style={inputStyle} />
            </div>

            {error && <div style={{ color: "#E87070", fontSize: 12, marginBottom: 14 }}>{error}</div>}

            <button onClick={handleSignUp} disabled={loading} style={{ width: "100%", background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 8, padding: "12px", color: "#0B1F3A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", opacity: loading ? 0.6 : 1 }}>
              {loading ? "Creating account…" : role === "farmer" ? "Join as a Farmer →" : "Join as a Buyer →"}
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ color: "rgba(245,237,217,0.4)", fontSize: 12 }}>Already have an account? </span>
              <button onClick={() => { setMode("signin"); setError(""); }} style={{ background: "none", border: "none", color: COLORS.gold, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Sign in</button>
            </div>
          </>
        )}

        {mode === "signin" && (
          <>
            <div style={{ color: COLORS.cream, fontSize: 20, fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: 4 }}>Welcome back</div>
            <div style={{ color: "rgba(245,237,217,0.5)", fontSize: 13, marginBottom: 24 }}>Sign in to your Cornerstone account.</div>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>EMAIL</label>
              <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>PASSWORD</label>
              <input type="password" value={form.password} onChange={update("password")} placeholder="Your password" style={inputStyle} onKeyDown={(e) => e.key === "Enter" && handleSignIn()} />
            </div>

            {error && <div style={{ color: "#E87070", fontSize: 12, marginBottom: 14 }}>{error}</div>}

            <button onClick={handleSignIn} style={{ width: "100%", background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 8, padding: "12px", color: "#0B1F3A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>
              Sign In →
            </button>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <span style={{ color: "rgba(245,237,217,0.4)", fontSize: 12 }}>No account yet? </span>
              <button onClick={() => { setMode("signup"); setError(""); }} style={{ background: "none", border: "none", color: COLORS.gold, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Sign up free</button>
            </div>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(201,149,42,0.1)", color: "rgba(245,237,217,0.25)", fontSize: 10, letterSpacing: 1 }}>
          Psalm 118:22 · Your Land. Your Legacy.
        </div>
      </div>
    </div>
  );
}
