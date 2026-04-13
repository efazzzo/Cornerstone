"use client";

import { COLORS, offeringIcons, offeringLabels } from "@/data/farms";
import ScoreRing from "./ScoreRing";

export default function FarmCard({ farm, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: isSelected
          ? `linear-gradient(135deg, #1B2A4A, #0B1F3A)`
          : "rgba(255,255,255,0.04)",
        border: `1px solid ${isSelected ? COLORS.gold : "rgba(201,149,42,0.2)"}`,
        borderRadius: 12,
        padding: "16px",
        cursor: "pointer",
        textAlign: "left",
        width: "100%",
        transition: "all 0.2s ease",
        marginBottom: 8,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ color: COLORS.gold, fontSize: 13, fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: 2 }}>
            {farm.name}
          </div>
          <div style={{ color: "rgba(245,237,217,0.6)", fontSize: 11, marginBottom: 8 }}>
            {farm.location} · {farm.acres} acres
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {farm.offerings.map((o) => (
              <span key={o} style={{
                background: "rgba(201,149,42,0.15)",
                border: "1px solid rgba(201,149,42,0.3)",
                borderRadius: 4, padding: "2px 6px", fontSize: 10, color: COLORS.cream,
              }}>
                {offeringIcons[o]} {o === "delivery" ? "ReapRise" : offeringLabels[o].split(" ")[0]}
              </span>
            ))}
            {farm.planned.map((o) => (
              <span key={o} style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px dashed rgba(201,149,42,0.3)",
                borderRadius: 4, padding: "2px 6px", fontSize: 10, color: "rgba(245,237,217,0.4)",
              }}>
                {offeringIcons[o]} Coming Soon
              </span>
            ))}
          </div>
        </div>
        <ScoreRing score={farm.score} size={48} />
      </div>
    </button>
  );
}
