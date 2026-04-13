"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { COLORS, offeringIcons, offeringLabels } from "@/data/farms";
import FarmCard from "./FarmCard";

// Leaflet must be loaded client-side only
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false, loading: () => <MapPlaceholder /> });

function MapPlaceholder() {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at 30% 40%, rgba(74,103,65,0.15) 0%, transparent 50%), linear-gradient(160deg, #0B1F3A 0%, #0F2A1A 40%, #0B1F3A 100%)" }}>
      <div style={{ color: "rgba(201,149,42,0.5)", fontSize: 13, letterSpacing: 2 }}>LOADING MAP…</div>
    </div>
  );
}

export default function DiscoverView({ farms = [], selectedFarm, setSelectedFarm, onViewStorefront, onListFarm }) {
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFarms = useMemo(() =>
    farms.filter((f) => {
      const matchesType = filterType === "all" || (f.offerings || []).includes(filterType) || (f.planned || []).includes(filterType);
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    }),
    [farms, filterType, searchQuery]
  );

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)" }}>

      {/* ── Left Sidebar ── */}
      <div style={{ width: 320, borderRight: "1px solid rgba(201,149,42,0.15)", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Search */}
        <div style={{ padding: "16px 16px 8px" }}>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search farms, locations…"
            style={{ width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(201,149,42,0.25)", borderRadius: 8, padding: "10px 14px", color: COLORS.cream, fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        {/* Filters */}
        <div style={{ padding: "0 16px 12px", display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["all", "produce", "restaurant", "venue", "agritourism", "delivery", "development"].map((f) => (
            <button key={f} onClick={() => setFilterType(f)} style={{
              background: filterType === f ? "rgba(201,149,42,0.25)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${filterType === f ? COLORS.gold : "rgba(255,255,255,0.1)"}`,
              borderRadius: 20,
              padding: "4px 10px",
              color: filterType === f ? COLORS.gold : "rgba(245,237,217,0.6)",
              fontSize: 11,
              cursor: "pointer",
              fontWeight: 500,
            }}>
              {f === "all" ? "All Farms" : `${offeringIcons[f]} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </button>
          ))}
        </div>

        {/* Farm list */}
        <div style={{ flex: 1, overflow: "auto", padding: "0 16px 16px" }}>
          <div style={{ color: "rgba(245,237,217,0.4)", fontSize: 11, marginBottom: 8, letterSpacing: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{filteredFarms.length} FARM{filteredFarms.length !== 1 ? "S" : ""} FOUND</span>
            {farms.some(f => f.source === "registered") && (
              <span style={{ color: COLORS.gold, fontSize: 9, letterSpacing: 1 }}>+ {farms.filter(f => f.source === "registered").length} PENDING</span>
            )}
          </div>
          {filteredFarms.map((f) => (
            <FarmCard key={f.id} farm={f} isSelected={selectedFarm?.id === f.id} onClick={() => setSelectedFarm(f)} />
          ))}
        </div>

        {/* CTA footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(201,149,42,0.1)", background: "rgba(201,149,42,0.04)" }}>
          <button onClick={onListFarm} style={{ width: "100%", background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 8, padding: "10px", color: "#0B1F3A", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>
            🌾 List Your Farm — It&apos;s Free
          </button>
          <div style={{ color: "rgba(245,237,217,0.3)", fontSize: 10, textAlign: "center", marginTop: 6 }}>
            Free forever for farmers
          </div>
        </div>
      </div>

      {/* ── Map ── */}
      <LeafletMap
        farms={filteredFarms}
        selectedFarm={selectedFarm}
        onSelectFarm={setSelectedFarm}
        onViewStorefront={onViewStorefront}
      />
    </div>
  );
}
