// Real-Time Cross-User & Cross-Tab Synchronization Service
// Syncs sightings, lost pet registrations, and matches across multiple browser tabs,
// windows, and sessions via BroadcastChannel, LocalStorage, and Supabase (if configured).

import { Sighting, LostPet, PetMatch } from '../types';
import { INITIAL_SIGHTINGS, INITIAL_LOST_PETS, INITIAL_MATCHES } from '../data/mockPets';
import { supabase, isSupabaseConfigured } from './supabase';

const SIGHTINGS_STORAGE_KEY = 'furtrace_sightings_store_v1';
const LOST_PETS_STORAGE_KEY = 'furtrace_lostpets_store_v1';
const MATCHES_STORAGE_KEY = 'furtrace_matches_store_v1';
const CHANNEL_NAME = 'furtrace_realtime_sync_channel';

export type SyncEventType =
  | 'SIGHTING_ADDED'
  | 'LOST_PET_ADDED'
  | 'MATCH_UPDATED'
  | 'STORE_RESET';

export interface SyncEventPayload {
  type: SyncEventType;
  data: any;
  originTabId: string;
  timestamp: number;
}

export type SyncListener = (event: SyncEventPayload) => void;

/**
 * Robust coordinate sanitizer
 */
export function sanitizeCoordinates(coords: any): { lat: number; lng: number } {
  if (!coords) return { lat: 10.3157, lng: 123.9511 };
  
  let rawLat = coords.lat ?? coords.latitude ?? coords.y;
  let rawLng = coords.lng ?? coords.longitude ?? coords.x;
  
  // Handle GeoJSON array format [lng, lat]
  if (Array.isArray(coords) && coords.length >= 2) {
    rawLng = coords[0];
    rawLat = coords[1];
  }

  const lat = typeof rawLat === 'number' ? rawLat : parseFloat(String(rawLat));
  const lng = typeof rawLng === 'number' ? rawLng : parseFloat(String(rawLng));

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return { lat: 10.3157, lng: 123.9511 };
  }

  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6))
  };
}

/**
 * Transforms database record (snake_case) or raw object into strongly-typed client Sighting
 */
export function normalizeSightingRecord(raw: any): Sighting {
  const approx = sanitizeCoordinates(raw.approxCoords || raw.approx_coords);
  const exact = sanitizeCoordinates(raw.exactCoordsProtected || raw.exact_coords_protected || approx);
  const radius = typeof (raw.privacyRadiusMeters ?? raw.privacy_radius_meters) === 'number'
    ? (raw.privacyRadiusMeters ?? raw.privacy_radius_meters)
    : parseInt(String(raw.privacyRadiusMeters ?? raw.privacy_radius_meters ?? '300'), 10) || 300;

  return {
    id: String(raw.id || `sighting-${Date.now()}`),
    reporterName: String(raw.reporterName || raw.reporter_name || 'Community Spotter'),
    reporterIsAnonymous: Boolean(raw.reporterIsAnonymous ?? raw.reporter_is_anonymous ?? false),
    species: raw.species === 'Dog' ? 'Dog' : 'Cat',
    photoUrl: String(raw.photoUrl || raw.photo_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80'),
    spottedAddress: String(raw.spottedAddress || raw.spotted_address || 'Lapu-Lapu City, Cebu'),
    approxCoords: approx,
    exactCoordsProtected: exact,
    privacyRadiusMeters: radius,
    spottedAt: String(raw.spottedAt || raw.spotted_at || raw.created_at || 'Just now'),
    conditionNotes: String(raw.conditionNotes || raw.condition_notes || ''),
    hasCollar: Boolean(raw.hasCollar ?? raw.has_collar ?? false),
    collarDescription: raw.collarDescription || raw.collar_description || undefined,
    exifStripped: Boolean(raw.exifStripped ?? raw.exif_stripped ?? true),
    embeddingVectorPreview: Array.isArray(raw.embeddingVectorPreview || raw.embedding_vector_preview)
      ? (raw.embeddingVectorPreview || raw.embedding_vector_preview)
      : [0.82, -0.41, 0.19, 0.65, -0.33],
    moderationStatus: (raw.moderationStatus || raw.moderation_status || 'approved') as any,
    flagsCount: typeof raw.flagsCount === 'number' ? raw.flagsCount : 0
  };
}

class RealtimeSyncService {
  private channel: BroadcastChannel | null = null;
  private tabId: string;
  private listeners: Set<SyncListener> = new Set();

  constructor() {
    this.tabId = `tab_${Math.random().toString(36).substring(2, 9)}`;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CHANNEL_NAME);
        this.channel.onmessage = (msgEvent: MessageEvent<SyncEventPayload>) => {
          if (msgEvent.data && msgEvent.data.originTabId !== this.tabId) {
            const normalizedData = msgEvent.data.type === 'SIGHTING_ADDED' && msgEvent.data.data
              ? normalizeSightingRecord(msgEvent.data.data)
              : msgEvent.data.data;
            this.notifyListeners({
              ...msgEvent.data,
              data: normalizedData
            });
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization fallback:', err);
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (storageEvent) => {
        if (
          storageEvent.key === SIGHTINGS_STORAGE_KEY ||
          storageEvent.key === LOST_PETS_STORAGE_KEY ||
          storageEvent.key === MATCHES_STORAGE_KEY
        ) {
          try {
            const rawData = storageEvent.newValue ? JSON.parse(storageEvent.newValue) : null;
            if (rawData) {
              this.notifyListeners({
                type: storageEvent.key === SIGHTINGS_STORAGE_KEY ? 'SIGHTING_ADDED' : 'LOST_PET_ADDED',
                data: rawData,
                originTabId: 'storage_sync',
                timestamp: Date.now()
              });
            }
          } catch {
            // ignore
          }
        }
      });
    }

    // Connect Supabase real-time if configured
    if (isSupabaseConfigured && supabase) {
      this.initSupabaseRealtime();
    }
  }

  private initSupabaseRealtime() {
    try {
      supabase!
        .channel('public_sightings_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'sightings' },
          (payload) => {
            if (payload.new) {
              const normalized = normalizeSightingRecord(payload.new);
              this.notifyListeners({
                type: 'SIGHTING_ADDED',
                data: normalized,
                originTabId: 'supabase_realtime',
                timestamp: Date.now()
              });
            }
          }
        )
        .subscribe();
    } catch (err) {
      console.warn('Supabase real-time channel setup warning:', err);
    }
  }

  private notifyListeners(payload: SyncEventPayload) {
    this.listeners.forEach((fn) => {
      try {
        fn(payload);
      } catch (e) {
        console.error('Error notifying sync listener:', e);
      }
    });
  }

  /**
   * Subscribe to incoming cross-user and cross-tab events
   */
  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Load initial sightings from localStorage, merging with defaults
   */
  public getSightings(): Sighting[] {
    if (typeof window === 'undefined') return INITIAL_SIGHTINGS;
    try {
      const stored = localStorage.getItem(SIGHTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map(normalizeSightingRecord);
          const userSightings = normalized.filter(
            p => !INITIAL_SIGHTINGS.some(init => init.id === p.id)
          );
          return [...userSightings, ...INITIAL_SIGHTINGS];
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored sightings:', err);
    }
    return INITIAL_SIGHTINGS;
  }

  /**
   * Fetch all remote public sightings from database
   */
  public async fetchRemoteSightings(): Promise<Sighting[]> {
    if (!isSupabaseConfigured || !supabase) {
      return this.getSightings();
    }

    try {
      const { data, error } = await supabase
        .from('sightings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching remote sightings from Supabase:', error);
        return this.getSightings();
      }

      if (data && Array.isArray(data)) {
        const remoteList = data.map(normalizeSightingRecord);
        const merged = [...remoteList];
        INITIAL_SIGHTINGS.forEach(init => {
          if (!merged.some(m => m.id === init.id)) {
            merged.push(init);
          }
        });
        if (typeof window !== 'undefined') {
          localStorage.setItem(SIGHTINGS_STORAGE_KEY, JSON.stringify(merged));
        }
        return merged;
      }
    } catch (e) {
      console.warn('Network exception while fetching remote sightings:', e);
    }

    return this.getSightings();
  }

  /**
   * Save a newly posted sighting to local storage, broadcast across tabs, and sync with Supabase
   */
  public async saveSighting(newSighting: Sighting, allSightings: Sighting[]): Promise<void> {
    const normalized = normalizeSightingRecord(newSighting);
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(SIGHTINGS_STORAGE_KEY, JSON.stringify(allSightings.map(normalizeSightingRecord)));
      } catch (err) {
        console.warn('Storage write error:', err);
      }
    }

    const payload: SyncEventPayload = {
      type: 'SIGHTING_ADDED',
      data: normalized,
      originTabId: this.tabId,
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.warn('Broadcast channel post message error:', err);
      }
    }

    // If Supabase is active, persist in database with public visibility
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('sightings').insert([{
          id: normalized.id,
          reporter_name: normalized.reporterName,
          reporter_is_anonymous: normalized.reporterIsAnonymous,
          species: normalized.species,
          photo_url: normalized.photoUrl,
          spotted_address: normalized.spottedAddress,
          approx_coords: normalized.approxCoords,
          exact_coords_protected: normalized.exactCoordsProtected,
          privacy_radius_meters: normalized.privacyRadiusMeters,
          condition_notes: normalized.conditionNotes,
          has_collar: normalized.hasCollar,
          moderation_status: 'approved',
          created_at: new Date().toISOString()
        }]);
      } catch (dbErr) {
        console.warn('Supabase DB insert notice (fallback to local state):', dbErr);
      }
    }
  }

  /**
   * Load lost pets from localStorage
   */
  public getLostPets(): LostPet[] {
    if (typeof window === 'undefined') return INITIAL_LOST_PETS;
    try {
      const stored = localStorage.getItem(LOST_PETS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LostPet[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const userPets = parsed.filter(
            p => !INITIAL_LOST_PETS.some(init => init.id === p.id)
          );
          return [...userPets, ...INITIAL_LOST_PETS];
        }
      }
    } catch (err) {
      console.warn('Failed to parse stored pets:', err);
    }
    return INITIAL_LOST_PETS;
  }

  /**
   * Save a newly registered lost pet
   */
  public saveLostPet(newPet: LostPet, allPets: LostPet[]): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOST_PETS_STORAGE_KEY, JSON.stringify(allPets));
      } catch (err) {
        console.warn('Storage write error:', err);
      }
    }

    const payload: SyncEventPayload = {
      type: 'LOST_PET_ADDED',
      data: newPet,
      originTabId: this.tabId,
      timestamp: Date.now()
    };

    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.warn('Broadcast channel post message error:', err);
      }
    }
  }

  /**
   * Reset storage to initial state
   */
  public resetToDefaults(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SIGHTINGS_STORAGE_KEY);
      localStorage.removeItem(LOST_PETS_STORAGE_KEY);
      localStorage.removeItem(MATCHES_STORAGE_KEY);
    }
    if (this.channel) {
      this.channel.postMessage({
        type: 'STORE_RESET',
        data: null,
        originTabId: this.tabId,
        timestamp: Date.now()
      });
    }
  }
}

export const syncService = new RealtimeSyncService();

/**
 * Recommended Postgres Row Level Security (RLS) policies for cross-user sighting visibility
 */
export const SUPABASE_RLS_POLICIES_SQL = `-- Supabase Row Level Security (RLS) for Furtrace Sightings
-- 1. Enable RLS on sightings table
ALTER TABLE sightings ENABLE ROW LEVEL SECURITY;

-- 2. Allow ALL users (public anon & authenticated) to read public sightings
-- Notice: approx_coords is publicly visible, ensuring real-time map rendering across all clients
CREATE POLICY "Public Read Sightings" ON sightings
  FOR SELECT
  USING (moderation_status IS NULL OR moderation_status != 'hidden');

-- 3. Allow community users and anonymous spotters to insert new sightings
CREATE POLICY "Community Insert Sightings" ON sightings
  FOR INSERT
  WITH CHECK (true);

-- 4. Restrict exact coordinate access: only verified owner of matching pet or reporter can view exact_coords_protected
CREATE POLICY "Verified Owner Read Exact Coordinates" ON sightings
  FOR SELECT
  USING (
    auth.uid() = reporter_user_id 
    OR EXISTS (
      SELECT 1 FROM pet_matches 
      JOIN lost_pets ON pet_matches.lost_pet_id = lost_pets.id
      WHERE pet_matches.sighting_id = sightings.id 
      AND lost_pets.owner_user_id = auth.uid()
      AND pet_matches.status IN ('Verified', 'Reviewing')
    )
  );
`;
