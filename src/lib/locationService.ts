// Extended Location and Geocoding Service for Metro Cebu (Lapu-Lapu, Mandaue, Cebu City, Cordova, Talisay)
// Handles address lookup, device GPS retrieval, geodesic privacy obfuscation, and reverse geocoding.

export interface GeoLocationResult {
  exactCoords: { lat: number; lng: number };
  approxCoords: { lat: number; lng: number };
  offsetMeters: number;
  source: 'device_gps' | 'geocoded_landmark' | 'barangay_centroid' | 'default_center';
  matchedName: string;
}

export interface LandmarkEntry {
  name: string;
  barangay: string;
  city: string;
  category: 'landmark' | 'vet_clinic' | 'shelter' | 'transit_hub' | 'mall' | 'park';
  coords: { lat: number; lng: number };
  aliases: string[];
}

export const METRO_CEBU_LANDMARKS: LandmarkEntry[] = [
  // --- Lapu-Lapu City ---
  {
    name: 'Hoops Dome Arena & Sports Complex',
    barangay: 'Gun-ob',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.3080, lng: 123.9390 },
    aliases: ['hoops dome', 'gun-ob', 'humay-humay', 'humay humay', 'gun ob', 'poblacion west']
  },
  {
    name: 'Lapu-Lapu City Hall & Plaza Rizal',
    barangay: 'Poblacion',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.3142, lng: 123.9495 },
    aliases: ['city hall', 'plaza rizal', 'poblacion', 'public market', 'ferry terminal', 'wharf', 'lapu-lapu market']
  },
  {
    name: 'Marina Mall & Ibo Junction',
    barangay: 'Pusok',
    city: 'Lapu-Lapu City',
    category: 'mall',
    coords: { lat: 10.3288, lng: 123.9635 },
    aliases: ['marina mall', 'pusok', 'fernan bridge', 'marcelo fernan', 'airport road', 'mactan airport', 'mcia']
  },
  {
    name: 'Gaisano Grand Mall Mactan',
    barangay: 'Basak',
    city: 'Lapu-Lapu City',
    category: 'mall',
    coords: { lat: 10.2930, lng: 123.9615 },
    aliases: ['gaisano grand', 'basak', 'mactan doctors', 'pueblo verde', 'tamiya', 'outlet center']
  },
  {
    name: 'Mactan Shrine & Lapu-Lapu Monument',
    barangay: 'Mactan',
    city: 'Lapu-Lapu City',
    category: 'park',
    coords: { lat: 10.3110, lng: 124.0160 },
    aliases: ['mactan shrine', 'mactan newtown', 'punta engaño', 'punta engano', 'shrine', 'monument', 'newtown']
  },
  {
    name: 'Bluewater Maribago & Buyong Beach',
    barangay: 'Maribago',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.2890, lng: 123.9975 },
    aliases: ['maribago', 'buyong', 'bluewater', 'resort corridor', 'costabella', 'tambuli']
  },
  {
    name: 'Pajac Crossing & Maximo Patalinghug Ave',
    barangay: 'Pajac',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.2845, lng: 123.9740 },
    aliases: ['pajac', 'agus crossing', 'pajac crossing']
  },
  {
    name: 'Marigondon Crossing & Plantacion',
    barangay: 'Marigondon',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.2675, lng: 123.9635 },
    aliases: ['marigondon', 'suba-basbas', 'subabasbas', 'marigondon crossing']
  },
  {
    name: 'First Mactan-Mandaue Bridge (Pajo Foot)',
    barangay: 'Pajo',
    city: 'Lapu-Lapu City',
    category: 'transit_hub',
    coords: { lat: 10.3210, lng: 123.9450 },
    aliases: ['pajo', 'old bridge', 'mandaue bridge', 'first bridge']
  },
  {
    name: 'Agus Elementary & Gaisano Grand Mactan South',
    barangay: 'Agus',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.2790, lng: 123.9850 },
    aliases: ['agus', 'gaisano agus']
  },
  {
    name: 'Bankal National High School & Soong Road',
    barangay: 'Bankal',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.3010, lng: 123.9720 },
    aliases: ['bankal', 'soong']
  },
  {
    name: 'Mactan Economic Zone (MEZ 1)',
    barangay: 'Ibo',
    city: 'Lapu-Lapu City',
    category: 'landmark',
    coords: { lat: 10.3250, lng: 123.9790 },
    aliases: ['ibo', 'mez 1', 'mez', 'mactan economic zone']
  },
  {
    name: 'Canjulao Public Wharf & Coastal Road',
    barangay: 'Canjulao',
    city: 'Lapu-Lapu City',
    category: 'transit_hub',
    coords: { lat: 10.3015, lng: 123.9430 },
    aliases: ['canjulao', 'canjulao wharf']
  },
  {
    name: 'Mactan Animal Care Clinic & Vet Services',
    barangay: 'Pajo',
    city: 'Lapu-Lapu City',
    category: 'vet_clinic',
    coords: { lat: 10.3180, lng: 123.9480 },
    aliases: ['mactan animal care', 'vet clinic lapu lapu', 'lapu lapu vet', 'pet hospital mactan']
  },

  // --- Cordova Municipality ---
  {
    name: 'CCLEX Toll Plaza & Cordova Causeway',
    barangay: 'Pilipog',
    city: 'Cordova',
    category: 'transit_hub',
    coords: { lat: 10.2730, lng: 123.9420 },
    aliases: ['cclex', 'cordova bridge', 'third bridge', 'pilipog', 'gabi']
  },
  {
    name: '10,000 Roses Cafe & Day-as Marine Sanctuary',
    barangay: 'Day-as',
    city: 'Cordova',
    category: 'landmark',
    coords: { lat: 10.2560, lng: 123.9490 },
    aliases: ['10000 roses', 'day-as', 'dayas', 'cordova port', 'ro-ro cordova']
  },
  {
    name: 'Cordova Municipal Hall & Public Market',
    barangay: 'Poblacion',
    city: 'Cordova',
    category: 'landmark',
    coords: { lat: 10.2530, lng: 123.9520 },
    aliases: ['cordova town', 'cordova municipal hall', 'cordova market']
  },

  // --- Mandaue City ---
  {
    name: 'Mandaue City Hall & Heritage Plaza',
    barangay: 'Centro',
    city: 'Mandaue City',
    category: 'landmark',
    coords: { lat: 10.3235, lng: 123.9395 },
    aliases: ['mandaue city hall', 'mandaue centro', 'st joseph parish mandaue']
  },
  {
    name: 'Parkmall & Reclamation Hub',
    barangay: 'Subangdaku',
    city: 'Mandaue City',
    category: 'mall',
    coords: { lat: 10.3245, lng: 123.9290 },
    aliases: ['parkmall', 'mo2', 'reclamation', 'cdu', 'cebu doctors university']
  },
  {
    name: 'Pacific Mall Mandaue & Metro Supermarket',
    barangay: 'Ibabao-Estancia',
    city: 'Mandaue City',
    category: 'mall',
    coords: { lat: 10.3420, lng: 123.9400 },
    aliases: ['pacific mall', 'metro mandaue', 'ibabao', 'estancia']
  },
  {
    name: 'J Centre Mall / Tokyo Inn Area',
    barangay: 'Bakilid',
    city: 'Mandaue City',
    category: 'mall',
    coords: { lat: 10.3390, lng: 123.9310 },
    aliases: ['j centre', 'jmall', 'bakilid', 'a.s. fortuna']
  },
  {
    name: 'Mandaue Animal Clinic & Rescue Outreach',
    barangay: 'Subangdaku',
    city: 'Mandaue City',
    category: 'vet_clinic',
    coords: { lat: 10.3280, lng: 123.9260 },
    aliases: ['mandaue vet', 'mandaue animal clinic', 'mandaue shelter']
  },

  // --- Cebu City ---
  {
    name: 'SM City Cebu & North Reclamation Area',
    barangay: 'Mabolo',
    city: 'Cebu City',
    category: 'mall',
    coords: { lat: 10.3115, lng: 123.9180 },
    aliases: ['sm city cebu', 'sm cebu', 'mabolo', 'north bus terminal', 'pier 4']
  },
  {
    name: 'Ayala Center Cebu & Cebu Business Park',
    barangay: 'Luz',
    city: 'Cebu City',
    category: 'mall',
    coords: { lat: 10.3175, lng: 123.9055 },
    aliases: ['ayala center', 'ayala cebu', 'cebu business park', 'cardinal rosales']
  },
  {
    name: 'Cebu IT Park & Garden Bloc',
    barangay: 'Apas',
    city: 'Cebu City',
    category: 'landmark',
    coords: { lat: 10.3295, lng: 123.9065 },
    aliases: ['it park', 'cebu it park', 'apas', 'lahug', 'garden bloc', 'sugbo mercado']
  },
  {
    name: 'Fuente Osmeña Circle & Chong Hua Hospital',
    barangay: 'Capitol Site',
    city: 'Cebu City',
    category: 'landmark',
    coords: { lat: 10.3120, lng: 123.8940 },
    aliases: ['fuente', 'fuente osmena', 'capitol', 'chong hua', 'cebu doc', 'osmena blvd']
  },
  {
    name: 'SM Seaside City Cebu & South Road Properties (SRP)',
    barangay: 'Mambaling',
    city: 'Cebu City',
    category: 'mall',
    coords: { lat: 10.2820, lng: 123.8820 },
    aliases: ['sm seaside', 'seaside', 'srp', 'south road properties', 'il corso', 'nustar']
  },
  {
    name: 'Cebu Provincial Veterinary Office & Sanctuary',
    barangay: 'Guadalupe',
    city: 'Cebu City',
    category: 'vet_clinic',
    coords: { lat: 10.3200, lng: 123.8880 },
    aliases: ['cebu vet', 'guadalupe vet', 'provincial vet', 'island rescue', 'cebu animal shelter']
  },

  // --- Talisay City ---
  {
    name: 'Talisay City Hall & Poblacion Plaza',
    barangay: 'Poblacion',
    city: 'Talisay City',
    category: 'landmark',
    coords: { lat: 10.2570, lng: 123.8490 },
    aliases: ['talisay city hall', 'talisay plaza', 'talisay market', 'pooc', 'dumlog']
  },
  {
    name: 'Gaisano Grand Fiesta Mall Tabunok',
    barangay: 'Tabunok',
    city: 'Talisay City',
    category: 'mall',
    coords: { lat: 10.2680, lng: 123.8370 },
    aliases: ['tabunok', 'tabunok flyover', 'fiesta mall', 'talisay south']
  }
];

// Re-export original reference for backward compatibility
export const LAPU_LAPU_LANDMARKS = METRO_CEBU_LANDMARKS;

/**
 * Geocode text address against comprehensive Metro Cebu landmarks, barangays, and hubs
 */
export function geocodeAddress(query: string): {
  coords: { lat: number; lng: number };
  matchedName: string;
  source: 'geocoded_landmark' | 'barangay_centroid' | 'default_center';
} {
  if (!query || query.trim() === '') {
    return {
      coords: { lat: 10.3157, lng: 123.9511 },
      matchedName: 'Lapu-Lapu City Center',
      source: 'default_center'
    };
  }

  const normalized = query.toLowerCase().trim();

  // Try matching against comprehensive landmark list
  for (const item of METRO_CEBU_LANDMARKS) {
    if (normalized.includes(item.name.toLowerCase()) || normalized.includes(item.barangay.toLowerCase())) {
      return {
        coords: { ...item.coords },
        matchedName: `${item.name}, ${item.barangay}, ${item.city}`,
        source: 'geocoded_landmark'
      };
    }
    for (const alias of item.aliases) {
      if (normalized.includes(alias)) {
        return {
          coords: { ...item.coords },
          matchedName: `${item.name} (${item.barangay}, ${item.city})`,
          source: 'geocoded_landmark'
        };
      }
    }
  }

  // Broad Regional checks
  if (normalized.includes('cebu city') || normalized.includes('cebu')) {
    return {
      coords: { lat: 10.3157, lng: 123.8854 },
      matchedName: 'Cebu City Central District',
      source: 'barangay_centroid'
    };
  }
  if (normalized.includes('mandaue')) {
    return {
      coords: { lat: 10.3320, lng: 123.9350 },
      matchedName: 'Mandaue City Central Zone',
      source: 'barangay_centroid'
    };
  }
  if (normalized.includes('cordova')) {
    return {
      coords: { lat: 10.2550, lng: 123.9500 },
      matchedName: 'Cordova Municipality Center',
      source: 'barangay_centroid'
    };
  }
  if (normalized.includes('talisay')) {
    return {
      coords: { lat: 10.2600, lng: 123.8400 },
      matchedName: 'Talisay City Urban Area',
      source: 'barangay_centroid'
    };
  }

  return {
    coords: { lat: 10.3157, lng: 123.9511 },
    matchedName: 'Lapu-Lapu City Center (General Zone)',
    source: 'barangay_centroid'
  };
}

/**
 * Calculates a genuine geodesic offset within the chosen privacy radius (e.g. 200m–500m).
 * Ensures the exact coordinate is protected by offsetting the public pin between 40% and 80%
 * of the privacy radius in a pseudo-random or seedable angle.
 */
export function calculateObfuscatedLocation(
  exact: { lat: number; lng: number },
  radiusMeters: number,
  seed?: string
): { approxCoords: { lat: number; lng: number }; offsetMeters: number } {
  let angle = Math.random() * 2 * Math.PI;
  let distanceRatio = 0.4 + Math.random() * 0.4; // between 40% and 80% of radius

  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const positiveHash = Math.abs(hash);
    angle = ((positiveHash % 360) * Math.PI) / 180;
    distanceRatio = 0.45 + ((positiveHash % 100) / 100) * 0.35;
  }

  const offsetMeters = Math.round(radiusMeters * distanceRatio);

  // 1 degree latitude ≈ 111,111 meters
  const deltaLat = (offsetMeters * Math.cos(angle)) / 111111;
  // 1 degree longitude ≈ 111,111 * cos(latitude) meters
  const deltaLng = (offsetMeters * Math.sin(angle)) / (111111 * Math.cos((exact.lat * Math.PI) / 180));

  const approxCoords = {
    lat: Number((exact.lat + deltaLat).toFixed(5)),
    lng: Number((exact.lng + deltaLng).toFixed(5))
  };

  return { approxCoords, offsetMeters };
}

/**
 * Finds the nearest landmark in Metro Cebu to given coordinates
 */
export function findNearestLandmark(coords: { lat: number; lng: number }): { name: string; distanceMeters: number } | null {
  let closest: { name: string; distanceMeters: number } | null = null;
  for (const item of METRO_CEBU_LANDMARKS) {
    const dist = calculateDistanceMeters(coords, item.coords);
    if (!closest || dist < closest.distanceMeters) {
      closest = {
        name: `${item.name}, Barangay ${item.barangay}, ${item.city}`,
        distanceMeters: dist
      };
    }
  }
  return closest;
}

/**
 * Requests device GPS location via HTML5 Geolocation API with multi-stage fallback.
 * Stage 1: High accuracy GPS satellite fix (10s)
 * Stage 2: Standard cellular/Wi-Fi positioning (12s)
 * Stage 3: Network IP-based geolocation fallback
 */
export async function getDeviceGPSLocation(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
  source: 'gps_satellite' | 'network_cellular' | 'ip_geolocation';
  resolvedAddress?: string;
}> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return getIPGeolocationFallback();
  }

  // Attempt Stage 1: High Accuracy GPS
  const tryPosition = (options: PositionOptions): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  try {
    const position = await tryPosition({
      enableHighAccuracy: true,
      timeout: 9000,
      maximumAge: 15000
    });
    const lat = Number(position.coords.latitude.toFixed(6));
    const lng = Number(position.coords.longitude.toFixed(6));
    const nearest = findNearestLandmark({ lat, lng });
    return {
      lat,
      lng,
      accuracy: Math.round(position.coords.accuracy || 10),
      source: 'gps_satellite',
      resolvedAddress: nearest && nearest.distanceMeters < 1200 ? nearest.name : undefined
    };
  } catch (err1: any) {
    // Stage 2: Fallback to standard cellular / Wi-Fi tower triangulation
    try {
      const position = await tryPosition({
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 120000
      });
      const lat = Number(position.coords.latitude.toFixed(6));
      const lng = Number(position.coords.longitude.toFixed(6));
      const nearest = findNearestLandmark({ lat, lng });
      return {
        lat,
        lng,
        accuracy: Math.round(position.coords.accuracy || 50),
        source: 'network_cellular',
        resolvedAddress: nearest && nearest.distanceMeters < 1500 ? nearest.name : undefined
      };
    } catch (err2: any) {
      // Stage 3: Fallback to IP geolocation lookup
      return getIPGeolocationFallback();
    }
  }
}

/**
 * Stage 3 Fallback: IP-based Geolocation
 */
async function getIPGeolocationFallback(): Promise<{
  lat: number;
  lng: number;
  accuracy: number;
  source: 'ip_geolocation';
  resolvedAddress?: string;
}> {
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const lat = Number(data.latitude.toFixed(6));
        const lng = Number(data.longitude.toFixed(6));
        const nearest = findNearestLandmark({ lat, lng });
        const cityDesc = data.city ? `${data.city}, ${data.region || 'Cebu'}` : 'Lapu-Lapu City';
        return {
          lat,
          lng,
          accuracy: 500,
          source: 'ip_geolocation',
          resolvedAddress: nearest && nearest.distanceMeters < 3000 ? nearest.name : `Near ${cityDesc}`
        };
      }
    }
  } catch {
    // Ignore IP fetch error and proceed to default fallback
  }

  // Final fallback to Lapu-Lapu City Center
  return {
    lat: 10.3157,
    lng: 123.9511,
    accuracy: 1000,
    source: 'ip_geolocation',
    resolvedAddress: 'Lapu-Lapu City Center, Cebu'
  };
}

/**
 * Approximate distance in meters between two lat/lng coordinates (Haversine formula)
 */
export function calculateDistanceMeters(
  loc1: { lat: number; lng: number },
  loc2: { lat: number; lng: number }
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (loc1.lat * Math.PI) / 180;
  const φ2 = (loc2.lat * Math.PI) / 180;
  const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
