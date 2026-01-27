interface LocationData {
  coords: [number, number];
  name: string;
}

// NCR (Metro Manila) location coordinates
export const NCR_LOCATIONS: Record<string, LocationData> = {
  // Cities
  QC: { coords: [14.676, 121.0437], name: "Quezon City" },
  CALOOCAN: { coords: [14.6488, 120.9664], name: "Caloocan" },
  PASAY: { coords: [14.5378, 121.0014], name: "Pasay" },
  MAKATI: { coords: [14.5547, 121.0244], name: "Makati" },
  MANILA: { coords: [14.5995, 120.9842], name: "Manila" },
  TAGUIG: { coords: [14.5176, 121.0509], name: "Taguig" },
  PASIG: { coords: [14.5764, 121.0851], name: "Pasig" },
  MANDALUYONG: { coords: [14.5794, 121.0359], name: "Mandaluyong" },
  MARIKINA: { coords: [14.6507, 121.1029], name: "Marikina" },
  PARANAQUE: { coords: [14.4793, 121.0198], name: "Parañaque" },
  "LAS PINAS": { coords: [14.4445, 120.9939], name: "Las Piñas" },
  MUNTINLUPA: { coords: [14.4081, 121.0415], name: "Muntinlupa" },
  VALENZUELA: { coords: [14.6942, 120.9632], name: "Valenzuela" },
  MALABON: { coords: [14.6625, 120.9567], name: "Malabon" },
  NAVOTAS: { coords: [14.6673, 120.9414], name: "Navotas" },
  "SAN JUAN": { coords: [14.6019, 121.0355], name: "San Juan" },
  PATEROS: { coords: [14.5446, 121.0686], name: "Pateros" },

  // Major roads/areas
  EDSA: { coords: [14.5896, 121.0563], name: "EDSA" },
  "GIL PUYAT": { coords: [14.5547, 121.0144], name: "Gil Puyat Ave" },
  "ROXAS BLVD": { coords: [14.5565, 120.9822], name: "Roxas Boulevard" },
  C5: { coords: [14.5341, 121.0556], name: "C5 Road" },
  SLEX: { coords: [14.4516, 121.0364], name: "SLEX" },
  NLEX: { coords: [14.7565, 120.9689], name: "NLEX" },
  SKYWAY: { coords: [14.5176, 121.0309], name: "Skyway" },
  "COMMONWEALTH AVE": { coords: [14.6815, 121.0774], name: "Commonwealth Ave" },
  "KATIPUNAN AVE": { coords: [14.6395, 121.0764], name: "Katipunan Ave" },
  "ORTIGAS AVE": { coords: [14.5873, 121.0615], name: "Ortigas Ave" },
  "AURORA BLVD": { coords: [14.6198, 121.0275], name: "Aurora Boulevard" },
  "ESPAÑA BLVD": { coords: [14.6104, 120.9915], name: "España Boulevard" },
  "QUEZON AVE": { coords: [14.6345, 121.0166], name: "Quezon Avenue" },
  R10: { coords: [14.6488, 120.9564], name: "R10 / Navotas" },
  "DAANG HARI": { coords: [14.4293, 121.0127], name: "Daang Hari" },
  "QUIRINO AVE": { coords: [14.5436, 120.9914], name: "Quirino Avenue" },
};

// Keywords to help match location strings
const LOCATION_KEYWORDS: Record<string, string[]> = {
  QC: ["QC", "QUEZON CITY", "CUBAO", "FAIRVIEW", "NOVALICHES", "DILIMAN", "COMMONWEALTH", "BALARA"],
  CALOOCAN: ["CALOOCAN", "MONUMENTO"],
  PASAY: ["PASAY", "MOA", "MALL OF ASIA"],
  MAKATI: ["MAKATI", "AYALA", "BGC", "BONIFACIO"],
  MANILA: ["MANILA", "ERMITA", "MALATE", "INTRAMUROS", "TONDO", "SAMPALOC", "BINONDO", "QUIAPO"],
  TAGUIG: ["TAGUIG", "BGC", "FORT BONIFACIO", "MCKINLEY"],
  PASIG: ["PASIG", "ORTIGAS", "KAPITOLYO"],
  MANDALUYONG: ["MANDALUYONG", "SHAW", "GREENFIELD"],
  MARIKINA: ["MARIKINA"],
  PARANAQUE: ["PARANAQUE", "SUCAT", "BF HOMES"],
  "LAS PINAS": ["LAS PINAS", "LAS PIÑAS", "ALABANG-ZAPOTE", "LPC"],
  MUNTINLUPA: ["MUNTINLUPA", "ALABANG"],
  VALENZUELA: ["VALENZUELA"],
  MALABON: ["MALABON"],
  NAVOTAS: ["NAVOTAS"],
  "SAN JUAN": ["SAN JUAN"],
  EDSA: ["EDSA", "EPIFANIO DE LOS SANTOS"],
  "GIL PUYAT": ["GIL PUYAT", "BUENDIA"],
  "ROXAS BLVD": ["ROXAS BLVD", "ROXAS BOULEVARD"],
  C5: ["C5", "C-5"],
  R10: ["R10", "R-10"],
  "DAANG HARI": ["DAANG HARI"],
  "QUIRINO AVE": ["QUIRINO AVE", "QUIRINO AVENUE"],
};

/**
 * Normalize a place string to a known location key
 */
export function normalizeLocation(place: string): string | null {
  if (!place) return null;

  const upperPlace = place.toUpperCase().trim();

  // Direct match
  if (NCR_LOCATIONS[upperPlace]) {
    return upperPlace;
  }

  // Keyword match
  for (const [key, keywords] of Object.entries(LOCATION_KEYWORDS)) {
    for (const keyword of keywords) {
      if (upperPlace.includes(keyword)) {
        return key;
      }
    }
  }

  return null;
}

/**
 * Get coordinates for a place string
 */
export function getLocationCoords(place: string): [number, number] | null {
  const normalized = normalizeLocation(place);
  if (normalized && NCR_LOCATIONS[normalized]) {
    return NCR_LOCATIONS[normalized].coords;
  }
  return null;
}

/**
 * Get display name for a place string
 */
export function getLocationName(place: string): string {
  const normalized = normalizeLocation(place);
  if (normalized && NCR_LOCATIONS[normalized]) {
    return NCR_LOCATIONS[normalized].name;
  }
  return place;
}
