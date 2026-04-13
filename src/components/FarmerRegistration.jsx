"use client";

import { useState } from "react";
import { COLORS, offeringIcons, offeringLabels, registerFarm } from "@/data/farms";

// ─── Formspree endpoint ───────────────────────────────────────────────────────
// Set NEXT_PUBLIC_FORMSPREE_ID in your .env.local file.
// See .env.local.example for reference.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID || "mlgovjzq";
// ─────────────────────────────────────────────────────────────────────────────

const STEPS = ["Farm Basics", "Offerings", "Contact & Submit"];

export default function FarmerRegistration({ user, onClose, onSuccess }) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    // Step 1
    farmName: "",
    ownerName: user?.name || "",
    location: "",
    acres: "",
    description: "",
    generation: "",
    // Step 2
    offerings: [],
    // Step 3
    email: user?.email || "",
    phone: "",
    lat: "",
    lng: "",
  });

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const toggleOffering = (key) => {
    const curr = form.offerings;
    setForm({ ...form, offerings: curr.includes(key) ? curr.filter((o) => o !== key) : [...curr, key] });
  };

  async function handleSubmit() {
    setSubmitting(true);

    // Save to localStorage so it appears on the map immediately
    const farmData = {
      name: form.farmName,
      owner: form.ownerName,
      location: form.location,
      generation: form.generation || "1st Generation",
      tagline: form.description || "A family farm joining the Cornerstone network.",
      acres: parseInt(form.acres) || 0,
      lat: parseFloat(form.lat) || null,
      lng: parseFloat(form.lng) || null,
      offerings: form.offerings,
      planned: [],
      score: 60,
      contactEmail: form.email,
      contactPhone: form.phone,
    };

    registerFarm(farmData);

    // Send email notification via Formspree
    if (FORMSPREE_ID !== "YOUR_FORMSPREE_ID") {
      try {
        await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            subject: `New Farm Registration: ${form.farmName}`,
            farmName: form.farmName,
            owner: form.ownerName,
            location: form.location,
            acres: form.acres,
            offerings: form.offerings.join(", "),
            email: form.email,
            phone: form.phone,
            description: form.description,
          }),
        });
      } catch (err) {
        // Fail silently — farm still saved locally
        console.error("Formspree error:", err);
      }
    }

    setSubmitting(false);
    setSubmitted(true);
    onSuccess?.(farmData);
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

  const labelStyle = {
    color: "rgba(245,237,217,0.5)",
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 5,
    display: "block",
  };

  if (submitted) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: `linear-gradient(135deg, #1B2A4A 0%, #0B1F3A 100%)`, border: `1px solid ${COLORS.gold}`, borderRadius: 16, padding: 40, maxWidth: 420, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌾</div>
          <div style={{ color: COLORS.gold, fontSize: 22, fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: 8 }}>You&apos;re on the map.</div>
          <div style={{ color: "rgba(245,237,217,0.7)", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
            <strong style={{ color: COLORS.cream }}>{form.farmName}</strong> has been added to the Cornerstone network. The team will reach out to complete your profile within 48 hours.
          </div>
          <div style={{ background: "rgba(201,149,42,0.1)", border: "1px solid rgba(201,149,42,0.25)", borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 12, color: "rgba(245,237,217,0.6)", lineHeight: 1.6 }}>
            📬 A confirmation has been sent to <strong style={{ color: COLORS.cream }}>{form.email}</strong>
          </div>
          <button onClick={onClose} style={{ background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 8, padding: "12px 32px", color: "#0B1F3A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            View My Farm on the Map →
          </button>
          <div style={{ marginTop: 20, color: "rgba(245,237,217,0.25)", fontSize: 10, letterSpacing: 1 }}>Psalm 118:22 · Your Land. Your Legacy.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <div style={{ background: `linear-gradient(135deg, #1B2A4A 0%, #0B1F3A 100%)`, border: `1px solid rgba(201,149,42,0.35)`, borderRadius: 16, padding: 32, width: "100%", maxWidth: 500, maxHeight: "90vh", overflow: "auto", position: "relative" }} onClick={(e) => e.stopPropagation()}>

        {/* Close */}
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: "rgba(245,237,217,0.4)", fontSize: 22, cursor: "pointer", lineHeight: 1 }}>×</button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "rgba(201,149,42,0.7)", fontSize: 10, letterSpacing: 2, marginBottom: 6 }}>STEP {step + 1} OF {STEPS.length} — {STEPS[step].toUpperCase()}</div>
          <div style={{ color: COLORS.cream, fontSize: 20, fontFamily: "Georgia, serif", fontWeight: 700 }}>List Your Farm</div>
          <div style={{ color: "rgba(245,237,217,0.5)", fontSize: 13, marginTop: 4 }}>Free forever for farmers. Cornerstone earns through the marketplace, not from you.</div>

          {/* Step progress */}
          <div style={{ display: "flex", gap: 4, marginTop: 16 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? COLORS.gold : "rgba(201,149,42,0.2)", transition: "background 0.3s" }} />
            ))}
          </div>
        </div>

        {/* Step 1: Farm Basics */}
        {step === 0 && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>FARM NAME *</label>
              <input value={form.farmName} onChange={update("farmName")} placeholder="e.g. Belle Meade Farms" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>OWNER / OPERATOR NAME *</label>
              <input value={form.ownerName} onChange={update("ownerName")} placeholder="Your full name" style={inputStyle} />
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 2 }}>
                <label style={labelStyle}>LOCATION (City, State) *</label>
                <input value={form.location} onChange={update("location")} placeholder="Culpeper County, VA" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>ACRES</label>
                <input value={form.acres} onChange={update("acres")} placeholder="780" style={inputStyle} type="number" />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>GENERATION / HISTORY</label>
              <input value={form.generation} onChange={update("generation")} placeholder="e.g. 3rd Generation · Est. 1952" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>SHORT DESCRIPTION</label>
              <textarea value={form.description} onChange={update("description")} placeholder="Tell us about your farm in one or two sentences…" rows={3} style={{ ...inputStyle, resize: "vertical" }} />
            </div>
            <button onClick={() => { if (!form.farmName || !form.ownerName || !form.location) return; setStep(1); }}
              disabled={!form.farmName || !form.ownerName || !form.location}
              style={{ width: "100%", background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 8, padding: "12px", color: "#0B1F3A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", opacity: (!form.farmName || !form.ownerName || !form.location) ? 0.5 : 1 }}>
              Next: Select Offerings →
            </button>
          </div>
        )}

        {/* Step 2: Offerings */}
        {step === 1 && (
          <div>
            <div style={{ color: "rgba(245,237,217,0.6)", fontSize: 13, marginBottom: 16, lineHeight: 1.6 }}>
              Select everything your farm offers or plans to offer. Each section creates a dedicated listing buyers can browse.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
              {Object.entries(offeringIcons).map(([key, icon]) => {
                const selected = form.offerings.includes(key);
                return (
                  <button key={key} onClick={() => toggleOffering(key)} style={{ background: selected ? "rgba(201,149,42,0.15)" : "rgba(255,255,255,0.04)", border: `1px solid ${selected ? COLORS.gold : "rgba(201,149,42,0.2)"}`, borderRadius: 8, padding: "12px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                    <div style={{ color: selected ? COLORS.gold : COLORS.cream, fontSize: 12, fontWeight: 700 }}>{offeringLabels[key]}</div>
                    {selected && <div style={{ color: COLORS.gold, fontSize: 10, marginTop: 2 }}>✓ Selected</div>}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setStep(0)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,149,42,0.2)", borderRadius: 8, padding: "11px", color: COLORS.cream, fontSize: 13, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(2)} disabled={form.offerings.length === 0} style={{ flex: 2, background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 8, padding: "12px", color: "#0B1F3A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", opacity: form.offerings.length === 0 ? 0.5 : 1 }}>
                Next: Contact Info →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Contact & Submit */}
        {step === 2 && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>EMAIL ADDRESS *</label>
              <input type="email" value={form.email} onChange={update("email")} placeholder="you@example.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>PHONE NUMBER</label>
              <input type="tel" value={form.phone} onChange={update("phone")} placeholder="(555) 000-0000" style={inputStyle} />
            </div>

            {/* Optional coordinates for map accuracy */}
            <div style={{ marginBottom: 6 }}>
              <label style={{ ...labelStyle, color: "rgba(201,149,42,0.6)" }}>FARM COORDINATES (optional — for precise map pin)</label>
            </div>
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <input value={form.lat} onChange={update("lat")} placeholder="Latitude e.g. 38.47" style={{ ...inputStyle, fontSize: 12 }} />
              </div>
              <div style={{ flex: 1 }}>
                <input value={form.lng} onChange={update("lng")} placeholder="Longitude e.g. -77.99" style={{ ...inputStyle, fontSize: 12 }} />
              </div>
            </div>

            <div style={{ background: "rgba(201,149,42,0.08)", border: "1px solid rgba(201,149,42,0.2)", borderRadius: 8, padding: "12px 14px", marginBottom: 20, fontSize: 12, color: "rgba(245,237,217,0.6)", lineHeight: 1.6 }}>
              ✅ Your farm will appear on the map immediately. A Cornerstone team member will contact you within 48 hours to complete your full profile.
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,149,42,0.2)", borderRadius: 8, padding: "11px", color: COLORS.cream, fontSize: 13, cursor: "pointer" }}>← Back</button>
              <button onClick={handleSubmit} disabled={!form.email || submitting}
                style={{ flex: 2, background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 8, padding: "12px", color: "#0B1F3A", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", opacity: (!form.email || submitting) ? 0.6 : 1 }}>
                {submitting ? "Submitting…" : "List My Farm on Cornerstone →"}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20, color: "rgba(245,237,217,0.2)", fontSize: 10, letterSpacing: 1 }}>
          Free for farmers · Psalm 118:22
        </div>
      </div>
    </div>
  );
}
