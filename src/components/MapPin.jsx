"use client";

import { COLORS, offeringIcons } from "@/data/farms";

export default function MapPin({ farm, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${farm.x}%`,
        top: `${farm.y}%`,
        transform: "translate(-50%, -50%)",
        background: isSelected ? COLORS.gold : COLORS.navy,
        border: `2px solid ${isSelected ? COLORS.goldLight : COLORS.gold}`,
        borderRadius: "50% 50% 50% 0",
        width: 32, height: 32,
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14,
        boxShadow: isSelected ? "0 0 0 4px rgba(201,149,42,0.3)" : "0 2px 8px rgba(0,0,0,0.4)",
        transition: "all 0.2s ease",
        zIndex: isSelected ? 10 : 5,
      }}
    >
      {farm.offerings[0] && offeringIcons[farm.offerings[0]]}
    </button>
  );
}
