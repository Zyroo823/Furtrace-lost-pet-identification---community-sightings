export type PetSpecies = 'Dog' | 'Cat';

export type PetGender = 'Male' | 'Female' | 'Unknown';

export type MatchStatus = 'Pending' | 'Reviewing' | 'Verified' | 'Unrelated' | 'Reunited';

export type ModerationStatus = 'approved' | 'pending' | 'flagged' | 'hidden' | 'removed';

export interface FlagReport {
  id: string;
  targetId: string;
  targetType: 'sighting' | 'lost_pet' | 'match';
  targetTitle: string;
  reason: 'troll_image' | 'fake_location' | 'misinformation' | 'spam' | 'inappropriate';
  details?: string;
  explanation?: string;
  reporterUserId?: string;
  reporterName: string;
  timestamp: string;
  status?: ModerationStatus;
}

export interface KeypointMatch {
  id: string;
  name: string;
  confidence: number; // e.g. 0.94
  description: string;
  petCoord: { x: number; y: number }; // percentage 0-100
  sightingCoord: { x: number; y: number }; // percentage 0-100
  category: 'facial' | 'marking' | 'ear' | 'tail' | 'collar';
}

export interface LostPet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  primaryColor: string;
  secondaryColor?: string;
  gender: PetGender;
  ageYears?: number;
  microchipId?: string;
  lastSeenAddress: string;
  lastSeenCoords: { lat: number; lng: number };
  lastSeenDate: string;
  photoUrl: string;
  additionalPhotos?: string[];
  distinctiveFeatures: string[];
  contactName: string;
  contactPhoneProtected: string;
  reward?: number;
  status: 'Lost' | 'Found' | 'Reunited';
  embeddingVectorPreview: number[]; // 512-d sample
  flagsCount?: number;
  flagReasons?: string[];
  moderationStatus?: ModerationStatus;
  trustScore?: number;
}

export interface Sighting {
  id: string;
  reporterName: string;
  reporterIsAnonymous: boolean;
  species: PetSpecies;
  photoUrl: string;
  spottedAddress: string;
  approxCoords: { lat: number; lng: number }; // Obfuscated by 200-500m for privacy
  exactCoordsProtected?: { lat: number; lng: number };
  privacyRadiusMeters: number; // e.g. 350
  spottedAt: string;
  conditionNotes: string;
  hasCollar: boolean;
  collarDescription?: string;
  exifStripped: boolean;
  rawExifData?: {
    cameraMake?: string;
    lens?: string;
    originalGpsLat?: number;
    originalGpsLng?: number;
    timestamp?: string;
  };
  embeddingVectorPreview: number[];
  flagsCount?: number;
  flagReasons?: string[];
  moderationStatus?: ModerationStatus;
  trustScore?: number;
}

export interface PetMatch {
  id: string;
  lostPetId: string;
  sightingId: string;
  overallScore: number; // 0 to 100
  facialGeometryScore: number;
  colorHistogramScore: number;
  markingPatternScore: number;
  distanceKm: number;
  status: MatchStatus;
  createdAt: string;
  keypoints: KeypointMatch[];
  aiAnalysisNotes: string;
  heatMapUrl?: string;
}

export interface SystemMetric {
  totalLostPets: number;
  totalSightings: number;
  successfulMatches: number;
  avgMatchTimeHours: number;
  reunitedPets: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: 'google' | 'email';
  createdAt: string;
  phone?: string;
  notificationsEnabled: boolean;
  myLostPetIds: string[];
  mySightingIds: string[];
}

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  mapStorage: boolean;
}

export type LegalModalType = 'terms' | 'privacy' | null;
