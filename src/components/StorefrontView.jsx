"use client";

import { COLORS, sectionDetails } from "@/data/farms";
import ScoreRing from "./ScoreRing";
import StorefrontSection from "./StorefrontSection";

export default function StorefrontView({ farm }) {
  if (!farm) return null;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
      <div style={{
        background: `linear-gradient(135deg, #1B2A4A 0%, #0B1F3A 100%)`,
        border: "1px solid rgba(201,149,42,0.3)",
        borderRadius: 16, padding: "24px", marginBottom: 20,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 200, height: 200, background: "radial-gradient(circle, rgba(201,149,42,0.08) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "rgba(201,149,42,0.6)", fontSize: 10, letterSpacing: 2, marginBottom: 4, fontWeight: 600 }}>
              {farm.generation}
            </div>
            <h1 style={{ color: COLORS.cream, fontSize: 26, fontFamily: "Georgia, serif", margin: "0 0 4px", fontWeight: 700 }}>
              {farm.name}
            </h1>
            <div style={{ color: COLORS.gold, fontSize: 13, marginBottom: 10 }}>
              {farm.owner} · {farm.location}
            </div>
            <p style={{ color: "rgba(245,237,217,0.7)", fontSize: 14, margin: "0 0 16px", lineHeight: 1.6, fontStyle: "italic" }}>
              &ldquo;{farm.tagline}&rdquo;
            </p>
            <div style={{ display: "flex", gap: 16 }}>
              <div>
                <div style={{ color: "rgba(245,237,217,0.4)", fontSize: 10, letterSpacing: 1 }}>ACREAGE</div>
                <div style={{ color: COLORS.cream, fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700 }}>{farm.acres.toLocaleString()}</div>
              </div>
              <div>
                <div style={{ color: "rgba(245,237,217,0.4)", fontSize: 10, letterSpacing: 1 }}>READINESS SCORE</div>
                <div style={{ color: COLORS.gold, fontSize: 18, fontFamily: "Georgia, serif", fontWeight: 700 }}>{farm.score}/100</div>
              </div>
            </div>
          </div>
          <ScoreRing score={farm.score} size={72} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ color: COLORS.gold, fontSize: 12, letterSpacing: 2, fontWeight: 600, marginBottom: 4 }}>FARM STOREFRONT</div>
        <div style={{ color: "rgba(245,237,217,0.5)", fontSize: 12 }}>
          Toggle sections on to list your offerings. Grayed out = not listed. Use &ldquo;Build Now&rdquo; to plan future offerings with Cornerstone.
        </div>
      </div>

      {Object.keys(sectionDetails).map((key) => (
        <StorefrontSection key={key} sectionKey={key} isActive={farm.sections[key]} isPlanned={farm.planned_sections?.[key]} farmName={farm.name} />
      ))}

      <div style={{ textAlign: "center", marginTop: 32, padding: "20px", borderTop: "1px solid rgba(201,149,42,0.15)" }}>
        <div style={{ color: "rgba(201,149,42,0.5)", fontSize: 11, letterSpacing: 1 }}>Psalm 118:22 · You Reap What You Sow</div>
      </div>
    </div>
  );
}
