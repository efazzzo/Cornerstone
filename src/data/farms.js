export const COLORS = {
  navy: "#0B1F3A",
  navyLight: "#1B2A4A",
  gold: "#C9952A",
  goldLight: "#E8B84B",
  cream: "#F5EDD9",
  creamLight: "#FDFAF4",
  earth: "#8B6914",
  sage: "#4A6741",
  rust: "#8B3A1A",
};

export const offeringIcons = {
  produce: "🌾",
  restaurant: "🍽️",
  venue: "💒",
  agritourism: "🌿",
  development: "🏗️",
  delivery: "🚜",
};

export const offeringLabels = {
  produce: "Direct Market Produce",
  restaurant: "Restaurant Sourcing",
  venue: "Wedding & Events",
  agritourism: "Agritourism",
  development: "Land & Development",
  delivery: "ReapRise Delivery",
};

export const sectionDetails = {
  produce: {
    label: "Direct Market Produce",
    icon: "🌾",
    buyerType: "Regional Grocers & Food Hubs",
    fields: ["Crops & Seasons", "Certifications", "Volume Capacity", "Delivery Logistics", "Pricing", "Product Photos"],
    color: "#4A6741",
  },
  restaurant: {
    label: "Restaurant Sourcing",
    icon: "🍽️",
    buyerType: "Restaurant Groups & Food Service",
    fields: ["Specialty Crops", "Custom Grow Willingness", "Lead Times", "Minimum Orders", "Sourcing Contact"],
    color: "#8B3A1A",
  },
  venue: {
    label: "Wedding & Events",
    icon: "💒",
    buyerType: "Wedding & Event Planners",
    fields: ["Capacity", "Indoor/Outdoor Spaces", "Amenities", "Availability Calendar", "Pricing Packages", "Venue Photos"],
    color: "#C9952A",
  },
  agritourism: {
    label: "Agritourism & Experiences",
    icon: "🌿",
    buyerType: "Tourists & Experience Seekers",
    fields: ["Activity Types", "Capacity", "Seasonal Availability", "Pricing", "Booking Calendar"],
    color: "#4A7C59",
  },
  development: {
    label: "Land & Development",
    icon: "🏗️",
    buyerType: "Real Estate & Developers",
    fields: ["Acreage Breakdown", "Zoning", "Land Quality", "Water Access", "Farm Clause Openness"],
    color: "#1B2A4A",
  },
  reaprise: {
    label: "ReapRise Delivery",
    icon: "🚜",
    buyerType: "Direct-to-Consumer Buyers",
    fields: ["Delivery Zones", "Product List", "Delivery Frequency", "Pricing", "Scheduling"],
    color: "#8B4513",
  },
};

// Seed farms — real lat/lng coordinates
export const seedFarms = [
  {
    id: 1,
    name: "Belle Meade Farms",
    owner: "Robert Halley",
    location: "Culpeper County, VA",
    generation: "3rd Generation · Est. 1952",
    tagline: "Row crops rooted in Virginia soil for over 70 years.",
    acres: 780,
    lat: 38.4738,
    lng: -77.9954,
    // legacy CSS map position kept for fallback
    x: 38,
    y: 44,
    status: "active",
    offerings: ["produce", "development", "delivery"],
    planned: ["venue"],
    score: 82,
    sections: {
      produce: true,
      restaurant: false,
      venue: false,
      agritourism: false,
      development: true,
      reaprise: true,
    },
    planned_sections: { venue: true },
    source: "seed",
  },
  {
    id: 2,
    name: "Price Family Ranch",
    owner: "Jayden Price",
    location: "Hill Country, TX",
    generation: "3rd Generation · Est. 1961",
    tagline: "Cattle country with deep Texas roots.",
    acres: 1200,
    lat: 30.3069,
    lng: -99.0128,
    x: 28,
    y: 68,
    status: "active",
    offerings: ["venue", "agritourism", "delivery"],
    planned: ["produce"],
    score: 74,
    sections: {
      produce: false,
      restaurant: false,
      venue: true,
      agritourism: true,
      development: false,
      reaprise: true,
    },
    planned_sections: { produce: true },
    source: "seed",
  },
  {
    id: 3,
    name: "Atkinson Farm",
    owner: "Margaret Atkinson",
    location: "Shenandoah Valley, VA",
    generation: "2nd Generation · Est. 1978",
    tagline: "Virginia's premier farm wedding destination.",
    acres: 340,
    lat: 38.7298,
    lng: -78.8681,
    x: 42,
    y: 36,
    status: "active",
    offerings: ["venue", "agritourism"],
    planned: ["delivery"],
    score: 91,
    sections: {
      produce: false,
      restaurant: false,
      venue: true,
      agritourism: true,
      development: false,
      reaprise: false,
    },
    planned_sections: { reaprise: true },
    source: "seed",
  },
  {
    id: 4,
    name: "Sunrise Organic Co-op",
    owner: "Dale & Karen Brooks",
    location: "Lancaster, PA",
    generation: "1st Generation · Est. 2004",
    tagline: "Certified organic produce for the Mid-Atlantic.",
    acres: 210,
    lat: 40.0379,
    lng: -76.3055,
    x: 55,
    y: 30,
    status: "active",
    offerings: ["produce", "restaurant", "delivery"],
    planned: [],
    score: 88,
    sections: {
      produce: true,
      restaurant: true,
      venue: false,
      agritourism: false,
      development: false,
      reaprise: true,
    },
    planned_sections: {},
    source: "seed",
  },
];

// Load farms including any registered via the prototype
export function getAllFarms() {
  if (typeof window === "undefined") return seedFarms;
  try {
    const stored = JSON.parse(localStorage.getItem("cornerstone_farms") || "[]");
    return [...seedFarms, ...stored];
  } catch {
    return seedFarms;
  }
}

// Save a new farm from registration
export function registerFarm(farmData) {
  if (typeof window === "undefined") return;
  try {
    const existing = JSON.parse(localStorage.getItem("cornerstone_farms") || "[]");
    const newFarm = {
      ...farmData,
      id: Date.now(),
      status: "pending",
      score: 60,
      source: "registered",
      sections: {},
      planned_sections: {},
    };
    localStorage.setItem("cornerstone_farms", JSON.stringify([...existing, newFarm]));
    return newFarm;
  } catch {
    return null;
  }
}

// Legacy export for components that still import `farms`
export const farms = seedFarms;
