"use client";

import { useState } from "react";
import { COLORS, sectionDetails } from "@/data/farms";

export default function StorefrontSection({ sectionKey, isActive, isPlanned }) {
  const [expanded, setExpanded] = useState(false);
  const detail = sectionDetails[sectionKey];

  return (
    <div style={{
      border: `1px solid ${isActive ? `${detail.color}60` : isPlanned ? "rgba(201,149,42,0.2)" : "rgba(255,255,255,0.06)"}`,
      borderRadius: 10,
      overflow: "hidden",
      opacity: isActive ? 1 : isPlanned ? 0.75 : 0.4,
      marginBottom: 8,
      transition: "all 0.2s ease",
    }}>
      <button
        onClick={() => isActive && setExpanded(!expanded)}
        style={{
          width: "100%", background: isActive ? `${detail.color}18` : "transparent",
          border: "none", padding: "12px 16px", cursor: isActive ? "pointer" : "default",
          display: "flex", alignItems: "center", gap: 10, textAlign: "left",
        }}
      >
        <span style={{ fontSize: 18 }}>{detail.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: isActive ? COLORS.cream : "rgba(245,237,217,0.5)", fontSize: 13, fontWeight: 600, fontFamily: "Georgia, serif" }}>
            {detail.label}
          </div>
          <div style={{ color: "rgba(245,237,217,0.4)", fontSize: 11 }}>
            {isActive ? `For: ${detail.buyerType}` : isPlanned ? "🔧 Build Now — Coming Soon" : "Not Listed"}
          </div>
        </div>
        {isActive && (
          <div style={{ background: `${detail.color}30`, border: `1px solid ${detail.color}60`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: COLORS.cream }}>
            ACTIVE
          </div>
        )}
        {isPlanned && !isActive && (
          <div style={{ background: "rgba(201,149,42,0.15)", border: "1px dashed rgba(201,149,42,0.4)", borderRadius: 4, padding: "2px 8px", fontSize: 10, color: COLORS.gold }}>
            PLANNED
          </div>
        )}
        {isActive && <span style={{ color: COLORS.gold, fontSize: 12 }}>{expanded ? "▲" : "▼"}</span>}
      </button>

      {isActive && expanded && (
        <div style={{ padding: "0 16px 14px", borderTop: `1px solid ${detail.color}30` }}>
          <div style={{ color: "rgba(245,237,217,0.5)", fontSize: 11, marginTop: 10, marginBottom: 8 }}>PROFILE FIELDS</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {detail.fields.map((f) => (
              <span key={f} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, padding: "4px 10px", fontSize: 11, color: COLORS.cream }}>
                {f}
              </span>
            ))}
          </div>
          {sectionKey === "reaprise" && (
            <div style={{ marginTop: 12, background: "rgba(139,69,19,0.2)", border: "1px solid rgba(201,149,42,0.3)", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ color: COLORS.gold, fontSize: 12, fontWeight: 700, marginBottom: 2 }}>🚜 ReapRise by Cornerstone</div>
              <div style={{ color: "rgba(245,237,217,0.6)", fontSize: 11 }}>Farm-to-home delivery. You reap, they rise.</div>
            </div>
          )}
        </div>
      )}

      {isPlanned && !isActive && (
        <div style={{ padding: "0 16px 14px" }}>
          <button style={{
            background: `linear-gradient(135deg, #C9952A, #8B6914)`,
            border: "none", borderRadius: 6, padding: "8px 16px",
            color: "#0B1F3A", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif", marginTop: 4,
          }}>
            Build Now → Connect with Cornerstone
          </button>
        </div>
      )}
    </div>
  );
}
