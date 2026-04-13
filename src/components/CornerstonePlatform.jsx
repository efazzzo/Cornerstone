"use client";

import { useState, useEffect } from "react";
import { COLORS, getAllFarms } from "@/data/farms";
import DiscoverView from "@/components/DiscoverView";
import StorefrontView from "@/components/StorefrontView";
import AuthModal, { getCurrentUser, signOut } from "@/components/AuthModal";
import FarmerRegistration from "@/components/FarmerRegistration";

export default function CornerstonePlatform() {
  const [view, setView] = useState("discover");
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);

  // Auth state
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signup");

  // Farmer registration
  const [showRegistration, setShowRegistration] = useState(false);

  // Load farms + user on mount
  useEffect(() => {
    const all = getAllFarms();
    setFarms(all);
    setSelectedFarm(all[0]);
    setUser(getCurrentUser());
  }, []);

  function handleAuthSuccess(newUser) {
    setUser(newUser);
    setShowAuth(false);
    // If they signed up as a farmer, prompt registration
    if (newUser.role === "farmer") {
      setShowRegistration(true);
    }
  }

  function handleFarmRegistered(farmData) {
    // Refresh farm list to include the new farm
    const updated = getAllFarms();
    setFarms(updated);
    setShowRegistration(false);
  }

  function handleSignOut() {
    signOut();
    setUser(null);
  }

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: COLORS.navy, minHeight: "100vh", color: COLORS.cream }}>

      {/* ── Header ── */}
      <div style={{
        background: `linear-gradient(135deg, #0B1F3A 0%, #1B2A4A 100%)`,
        borderBottom: "1px solid rgba(201,149,42,0.25)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 56,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, #C9952A, #8B6914)`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⬡</div>
          <div>
            <div style={{ color: COLORS.cream, fontSize: 15, fontFamily: "Georgia, serif", fontWeight: 700, lineHeight: 1 }}>Cornerstone</div>
            <div style={{ color: COLORS.gold, fontSize: 9, letterSpacing: 2, lineHeight: 1.2 }}>AMERICAN LAND SOVEREIGNTY</div>
          </div>
        </div>

        {/* Center nav */}
        <div style={{ display: "flex", gap: 4 }}>
          {["discover", "storefront"].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              background: view === v ? "rgba(201,149,42,0.2)" : "transparent",
              border: `1px solid ${view === v ? COLORS.gold : "transparent"}`,
              borderRadius: 6,
              padding: "6px 14px",
              color: view === v ? COLORS.gold : "rgba(245,237,217,0.5)",
              fontSize: 12,
              cursor: "pointer",
              fontWeight: 600,
              textTransform: "capitalize",
            }}>
              {v === "discover" ? "🗺 Discover" : "🌾 Storefront"}
            </button>
          ))}
        </div>

        {/* Auth / user controls */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {user ? (
            <>
              {user.role === "farmer" && (
                <button onClick={() => setShowRegistration(true)} style={{ background: "rgba(201,149,42,0.15)", border: `1px solid rgba(201,149,42,0.4)`, borderRadius: 6, padding: "6px 12px", color: COLORS.gold, fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                  + List Farm
                </button>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,149,42,0.2)", borderRadius: 20, padding: "4px 12px 4px 6px" }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, #C9952A, #8B6914)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#0B1F3A" }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span style={{ color: COLORS.cream, fontSize: 12, fontWeight: 500 }}>{user.name.split(" ")[0]}</span>
              </div>
              <button onClick={handleSignOut} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "5px 10px", color: "rgba(245,237,217,0.4)", fontSize: 11, cursor: "pointer" }}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setAuthMode("signin"); setShowAuth(true); }} style={{ background: "transparent", border: "1px solid rgba(201,149,42,0.3)", borderRadius: 6, padding: "6px 12px", color: "rgba(245,237,217,0.7)", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>
                Sign In
              </button>
              <button onClick={() => { setAuthMode("signup"); setShowAuth(true); }} style={{ background: `linear-gradient(135deg, #C9952A, #8B6914)`, border: "none", borderRadius: 6, padding: "6px 14px", color: "#0B1F3A", fontSize: 12, cursor: "pointer", fontWeight: 700 }}>
                List Your Farm
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Views ── */}
      {view === "discover" ? (
        <DiscoverView
          farms={farms}
          selectedFarm={selectedFarm}
          setSelectedFarm={setSelectedFarm}
          onViewStorefront={() => setView("storefront")}
          onListFarm={() => {
            if (!user) { setAuthMode("signup"); setShowAuth(true); }
            else setShowRegistration(true);
          }}
        />
      ) : (
        <StorefrontView farm={selectedFarm} />
      )}

      {/* ── Modals ── */}
      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      {showRegistration && (
        <FarmerRegistration
          user={user}
          onClose={() => setShowRegistration(false)}
          onSuccess={handleFarmRegistered}
        />
      )}
    </div>
  );
}
