"use client";

import { useEffect, useRef } from "react";
import { COLORS, offeringIcons } from "@/data/farms";

// Shared icon factory — extracted to module scope to avoid duplication
function makePinIcon(L, status) {
  const active = status === "active";
  const pending = status === "pending";
  const fill = pending ? "rgba(201,149,42,0.45)" : active ? COLORS.gold : "rgba(201,149,42,0.4)";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z"
        fill="${fill}" stroke="${COLORS.gold}" stroke-width="1.5"/>
      <circle cx="14" cy="14" r="5" fill="#0B1F3A"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
    className: "",
  });
}

// Dynamically loaded only on client — avoids SSR issues with Leaflet
export default function LeafletMap({ farms, selectedFarm, onSelectFarm, onViewStorefront }) {
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    async function initMap() {
      const L = (await import("leaflet")).default;

      // Fix default icon paths broken by webpack
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (!mapRef.current) return;

      // Remove previous map instance if it exists
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [37.5, -85],
        zoom: 5,
        zoomControl: true,
        attributionControl: true,
      });

      leafletRef.current = map;

      // Dark-styled tiles via CartoDB Dark Matter
      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Add markers
      farms.forEach((farm) => {
        if (!farm.lat || !farm.lng) return;
        const marker = L.marker([farm.lat, farm.lng], { icon: makePinIcon(L, farm.status) }).addTo(map);
        marker.on("click", () => onSelectFarm(farm));
        markersRef.current[farm.id] = marker;
      });

      // Style the Leaflet attribution to match theme
      const attr = map.getContainer().querySelector(".leaflet-control-attribution");
      if (attr) {
        attr.style.background = "rgba(11,31,58,0.8)";
        attr.style.color = "rgba(245,237,217,0.4)";
        attr.style.fontSize = "9px";
      }
    }

    initMap();

    return () => {
      if (leafletRef.current) {
        leafletRef.current.remove();
        leafletRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentional: map initializes once on mount; farms/callbacks handled by separate effect

  // Update markers when farms list changes (new registrations)
  useEffect(() => {
    if (!leafletRef.current || typeof window === "undefined") return;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;

      farms.forEach((farm) => {
        if (!farm.lat || !farm.lng) return;
        if (markersRef.current[farm.id]) return; // already on map

        const marker = L.marker([farm.lat, farm.lng], { icon: makePinIcon(L, farm.status) }).addTo(leafletRef.current);
        marker.on("click", () => onSelectFarm(farm));
        markersRef.current[farm.id] = marker;
      });
    }

    updateMarkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [farms]); // onSelectFarm intentionally omitted — stable prop, avoids re-registering all markers

  // Pan to selected farm
  useEffect(() => {
    if (!leafletRef.current || !selectedFarm?.lat) return;
    leafletRef.current.panTo([selectedFarm.lat, selectedFarm.lng], { animate: true, duration: 0.5 });
  }, [selectedFarm]);

  return (
    <div style={{ position: "relative", flex: 1, height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Selected farm popup overlay */}
      {selectedFarm && (
        <div style={{
          position: "absolute",
          bottom: 80,
          right: 20,
          background: `linear-gradient(135deg, #1B2A4A, #0B1F3A)`,
          border: `1px solid ${COLORS.gold}`,
          borderRadius: 12,
          padding: "14px 16px",
          width: 240,
          zIndex: 1000,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        }}>
          {selectedFarm.status === "pending" && (
            <div style={{ background: "rgba(201,149,42,0.15)", border: "1px dashed rgba(201,149,42,0.5)", borderRadius: 4, padding: "3px 8px", fontSize: 10, color: COLORS.gold, marginBottom: 8, display: "inline-block", letterSpacing: 1 }}>
              PENDING REVIEW
            </div>
          )}
          <div style={{ color: COLORS.gold, fontSize: 13, fontFamily: "Georgia, serif", fontWeight: 700, marginBottom: 2 }}>{selectedFarm.name}</div>
          <div style={{ color: "rgba(245,237,217,0.5)", fontSize: 11, marginBottom: 8 }}>
            {selectedFarm.location} · {selectedFarm.acres} acres
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 12 }}>
            {(selectedFarm.offerings || []).map((o) => (
              <span key={o} style={{ background: "rgba(201,149,42,0.15)", border: "1px solid rgba(201,149,42,0.3)", borderRadius: 4, padding: "2px 6px", fontSize: 10, color: COLORS.cream }}>
                {offeringIcons[o]}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: "rgba(245,237,217,0.4)", fontSize: 9, letterSpacing: 1 }}>READINESS</div>
              <div style={{ color: COLORS.gold, fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700 }}>{selectedFarm.score}</div>
            </div>
            {selectedFarm.status !== "pending" && (
              <button onClick={onViewStorefront} style={{ background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 6, padding: "6px 12px", color: "#0B1F3A", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "Georgia, serif" }}>
                View Farm →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ position: "absolute", bottom: 16, left: 16, background: "rgba(11,31,58,0.9)", border: "1px solid rgba(201,149,42,0.2)", borderRadius: 8, padding: "10px 14px", zIndex: 1000 }}>
        <div style={{ color: "rgba(245,237,217,0.4)", fontSize: 9, letterSpacing: 1, marginBottom: 6 }}>MAP LEGEND</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <svg width="12" height="16" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill={COLORS.gold} stroke={COLORS.gold} strokeWidth="1.5"/></svg>
          <span style={{ color: "rgba(245,237,217,0.6)", fontSize: 10 }}>Active Farm</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="12" height="16" viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22S28 24.5 28 14C28 6.27 21.73 0 14 0z" fill="rgba(201,149,42,0.4)" stroke={COLORS.gold} strokeWidth="1.5" strokeDasharray="3 2"/></svg>
          <span style={{ color: "rgba(245,237,217,0.6)", fontSize: 10 }}>Pending Review</span>
        </div>
      </div>
    </div>
  );
}
