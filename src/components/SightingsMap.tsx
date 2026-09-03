import React, { useState, useEffect, useCallback } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  MapCameraChangedEvent
} from '@vis.gl/react-google-maps';
import { LostPet, Sighting, PetMatch } from '../types';
import { LAPU_LAPU_CENTER, LAPU_LAPU_BARANGAYS } from '../data/mockPets';
import { MapCircle } from './MapCircle';
import { MapPolyline } from './MapPolyline';
import { METRO_CEBU_LANDMARKS, getDeviceGPSLocation } from '../lib/locationService';
import {
  MapPin,
  Shield,
  Eye,
  Search,
  Filter,
  Navigation,
  Compass,
  Sparkles,
  Info,
  Calendar,
  AlertCircle,
  Key,
  ExternalLink,
  Layers,
  ChevronRight,
  Radio,
  CheckCircle2,
  Lock,
  Building,
  Camera,
  Crosshair,
  X
} from 'lucide-react';

interface SightingsMapProps {
  lostPets: LostPet[];
  sightings: Sighting[];
  matches: PetMatch[];
  onSelectMatch: (match: PetMatch) => void;
  onOpenReport: () => void;
}

// Controller component to smoothly pan/zoom to selected barangays
const MapController: React.FC<{
  targetCenter: { lat: number; lng: number } | null;
  targetZoom: number;
}> = ({ targetCenter, targetZoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !targetCenter) return;
    map.panTo(targetCenter);
    map.setZoom(targetZoom);
  }, [map, targetCenter, targetZoom]);

  return null;
};

export const SightingsMap: React.FC<SightingsMapProps> = ({
  lostPets,
  sightings,
  matches,
  onSelectMatch,
  onOpenReport
}) => {
  // Environment API key with optional manual override for user testing
  const envApiKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const envMapId = ((import.meta as any).env?.VITE_GOOGLE_MAPS_MAP_ID as string) || 'b23756c2d1b822d';
  const [customApiKey, setCustomApiKey] = useState<string>(envApiKey);
  const [customMapId, setCustomMapId] = useState<string>(envMapId);
  const [showKeyModal, setShowKeyModal] = useState<boolean>(false);
  const [tempKeyInput, setTempKeyInput] = useState<string>('');
  const [tempMapIdInput, setTempMapIdInput] = useState<string>('');

  const [selectedSpecies, setSelectedSpecies] = useState<string>('All');
  const [selectedCityFilter, setSelectedCityFilter] = useState<string>('All');
  const [showPrivacyZones, setShowPrivacyZones] = useState<boolean>(true);
  const [showLostPetRadii, setShowLostPetRadii] = useState<boolean>(true);
  const [showSightings, setShowSightings] = useState<boolean>(true);
  const [ownerPrecisePinUnlocked, setOwnerPrecisePinUnlocked] = useState<boolean>(false);
  const [selectedBarangayIdx, setSelectedBarangayIdx] = useState<number>(0);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');

  // Active selected item for InfoWindow / Drawer
  const [selectedSightingId, setSelectedSightingId] = useState<string | null>('sight-001');
  const [selectedLostPetId, setSelectedLostPetId] = useState<string | null>(null);

  // Target camera location for smooth panning
  const [cameraTarget, setCameraTarget] = useState<{ lat: number; lng: number } | null>(LAPU_LAPU_CENTER);
  const [cameraZoom, setCameraZoom] = useState<number>(13);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; accuracy: number; label: string } | null>(null);
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [locateStatus, setLocateStatus] = useState<string | null>(null);

  const handleLocateUser = async () => {
    setIsLocatingUser(true);
    setLocateStatus('Acquiring your location...');
    try {
      const pos = await getDeviceGPSLocation();
      setUserLocation({
        lat: pos.lat,
        lng: pos.lng,
        accuracy: pos.accuracy,
        label: pos.resolvedAddress || `Your GPS Location (±${pos.accuracy}m)`
      });
      setCameraTarget({ lat: pos.lat, lng: pos.lng });
      setCameraZoom(16);
      setLocateStatus(pos.resolvedAddress ? `Located: ${pos.resolvedAddress}` : `GPS Locked (±${pos.accuracy}m)`);
      setTimeout(() => setLocateStatus(null), 5000);
    } catch {
      setLocateStatus('Could not read GPS. Please check browser location permissions.');
      setTimeout(() => setLocateStatus(null), 5000);
    } finally {
      setIsLocatingUser(false);
    }
  };

  // Safely parse and validate coordinates across diverse backends
  const normalizeCoords = (coords: any): { lat: number; lng: number } | null => {
    if (!coords) return null;
    const lat = typeof coords.lat === 'number' ? coords.lat : parseFloat(coords.lat);
    const lng = typeof coords.lng === 'number' ? coords.lng : parseFloat(coords.lng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
    return { lat, lng };
  };

  // Filtered lists with robust coordinate and null-check validation
  const filteredSightings = sightings.filter(s => {
    if (!s) return false;
    const validCoords = normalizeCoords(s.approxCoords);
    if (!validCoords) return false;
    const matchSpecies = selectedSpecies === 'All' ? true : s.species === selectedSpecies;
    const addr = (s.spottedAddress || '').toLowerCase();
    const matchCity = selectedCityFilter === 'All' ? true : addr.includes(selectedCityFilter.toLowerCase());
    return matchSpecies && matchCity;
  });

  const filteredLostPets = lostPets.filter(p => {
    if (!p) return false;
    const validCoords = normalizeCoords(p.lastSeenCoords);
    if (!validCoords) return false;
    const matchSpecies = selectedSpecies === 'All' ? true : p.species === selectedSpecies;
    const addr = (p.lastSeenAddress || '').toLowerCase();
    const matchCity = selectedCityFilter === 'All' ? true : addr.includes(selectedCityFilter.toLowerCase());
    return matchSpecies && matchCity;
  });

  const activeSighting = sightings.find(s => s.id === selectedSightingId);
  const activeLostPet = lostPets.find(p => p.id === selectedLostPetId);
  const activeMatch = activeSighting ? matches.find(m => m.sightingId === activeSighting.id) : null;
  const matchedLostPet = activeMatch ? lostPets.find(p => p.id === activeMatch.lostPetId) : null;

  const handleSelectLandmark = (item: (typeof METRO_CEBU_LANDMARKS)[0]) => {
    setCameraTarget(item.coords);
    setCameraZoom(16);
  };

  const handleSelectBarangay = (idx: number) => {
    setSelectedBarangayIdx(idx);
    const target = LAPU_LAPU_BARANGAYS[idx];
    if (target) {
      setCameraTarget(target.coords);
      setCameraZoom(target.zoom);
    }
  };

  const handleSightingClick = (sighting: Sighting) => {
    setSelectedSightingId(sighting.id);
    setSelectedLostPetId(null);
    setCameraTarget(sighting.approxCoords);
    setCameraZoom(16);
  };

  const handleLostPetClick = (pet: LostPet) => {
    setSelectedLostPetId(pet.id);
    setSelectedSightingId(null);
    setCameraTarget(pet.lastSeenCoords);
    setCameraZoom(16);
  };

  const activeApiKey = customApiKey.trim() || envApiKey.trim();

  return (
    <div className="space-y-4">
      {/* Top Header & Community Information Banner */}
      <div className="bg-white rounded-3xl border border-amber-900/10 shadow-xs p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="p-2 bg-[#E06D53] rounded-2xl text-white shadow-xs inline-flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                Lapu-Lapu City Community Privacy Radar Map
              </h2>
              <span className="bg-[#7DA18B]/15 text-[#7DA18B] border border-[#7DA18B]/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                Cebu, Philippines
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Live Google Maps integration across <strong>Mactan Island barangays</strong> (Poblacion, Pusok, Basak, Mactan Shrine, Maribago, Gun-ob, Pajac).
              Sightings are protected with a <strong>200m–500m obfuscation blur zone</strong> to protect neighborhood spotters.
            </p>
          </div>

          {/* Quick API Key & Report Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowKeyModal(true)}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
              title="Configure Google Maps Platform Key"
            >
              <Key className="w-3.5 h-3.5 text-[#E06D53]" />
              <span>{activeApiKey ? 'Google Maps API Configured' : 'Set Maps Key (Demo Ready)'}</span>
            </button>

            <button
              onClick={onOpenReport}
              className="px-4 py-2 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-98"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>+ Pin Sighting in Lapu-Lapu</span>
            </button>
          </div>
        </div>

        {/* Barangay Quick Jumper Pills */}
        <div className="mt-4 pt-4 border-t border-amber-900/10 flex items-center gap-2 text-xs overflow-x-auto pb-1 max-w-full">
          <span className="text-slate-500 font-semibold flex items-center gap-1 shrink-0">
            <Building className="w-3.5 h-3.5 text-[#E06D53]" />
            Fly to Barangay:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {LAPU_LAPU_BARANGAYS.map((brgy, idx) => (
              <button
                key={brgy.name}
                onClick={() => handleSelectBarangay(idx)}
                className={`px-3 py-1.5 min-h-[36px] rounded-lg transition-all text-xs font-medium shrink-0 ${
                  selectedBarangayIdx === idx
                    ? 'bg-slate-900 text-white shadow-xs font-bold'
                    : 'bg-amber-900/5 text-slate-700 hover:bg-amber-900/10'
                }`}
              >
                {brgy.name.replace('Barangay ', '')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left / Center: Interactive Google Map */}
        <div className="lg:col-span-8 bg-slate-900 rounded-2xl sm:rounded-3xl border border-amber-900/10 shadow-lg overflow-hidden flex flex-col h-[460px] sm:h-[560px] lg:h-[620px] relative">
          
          {/* Map Layer Toolbar */}
          <div className="p-2.5 sm:p-3 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 flex flex-nowrap sm:flex-wrap items-center justify-between gap-2 z-10 text-xs overflow-x-auto no-scrollbar">
            {/* Species & City Pills */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex items-center bg-slate-800 p-0.5 rounded-xl shrink-0">
                {['All', 'Cat', 'Dog'].map(sp => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSelectedSpecies(sp)}
                    className={`px-2.5 py-1.5 min-h-[36px] rounded-lg transition-colors font-medium shrink-0 cursor-pointer ${
                      selectedSpecies === sp
                        ? 'bg-[#E06D53] text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {sp === 'All' ? 'All' : `${sp}s`}
                  </button>
                ))}
              </div>

              <div className="hidden sm:flex items-center bg-slate-800 p-0.5 rounded-xl shrink-0">
                {[
                  { label: 'All Metro', val: 'All' },
                  { label: 'Lapu-Lapu', val: 'Lapu-Lapu' },
                  { label: 'Mandaue', val: 'Mandaue' },
                  { label: 'Cebu City', val: 'Cebu' },
                  { label: 'Cordova', val: 'Cordova' }
                ].map(city => (
                  <button
                    key={city.val}
                    type="button"
                    onClick={() => setSelectedCityFilter(city.val)}
                    className={`px-2 py-1.5 min-h-[36px] rounded-lg transition-colors text-[11px] font-medium shrink-0 cursor-pointer ${
                      selectedCityFilter === city.val
                        ? 'bg-[#7DA18B] text-white font-bold'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Layer Toggles */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowPrivacyZones(!showPrivacyZones)}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg border flex items-center gap-1 transition-colors shrink-0 cursor-pointer ${
                  showPrivacyZones
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Blur Zones</span>
                <span>{showPrivacyZones ? 'ON' : 'OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLostPetRadii(!showLostPetRadii)}
                className={`px-2.5 py-1.5 min-h-[36px] rounded-lg border flex items-center gap-1 transition-colors shrink-0 cursor-pointer ${
                  showLostPetRadii
                    ? 'bg-rose-950/80 border-rose-500/50 text-rose-300 font-bold'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lost Radius</span>
                <span className="sm:hidden">Radius</span>
              </button>

              {/* Locate Me GPS Button */}
              <button
                type="button"
                onClick={handleLocateUser}
                disabled={isLocatingUser}
                className="px-2.5 py-1.5 min-h-[36px] rounded-lg border bg-blue-600/90 hover:bg-blue-600 border-blue-400 text-white font-bold flex items-center gap-1 transition-colors shadow-xs shrink-0 cursor-pointer"
                title="Center map on your device GPS location"
              >
                <Crosshair className={`w-3.5 h-3.5 ${isLocatingUser ? 'animate-spin' : ''}`} />
                <span>{isLocatingUser ? 'Locating...' : 'My GPS'}</span>
              </button>

              {/* Map Type Switcher */}
              <select
                value={mapType}
                onChange={e => setMapType(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-1.5 min-h-[36px] text-xs focus:outline-hidden shrink-0"
              >
                <option value="roadmap">Roadmap</option>
                <option value="hybrid">Satellite</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
          </div>

          {/* Floating GPS Feedback Alert */}
          {locateStatus && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 text-white text-xs px-3.5 py-1.5 rounded-full border border-blue-500 shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <Navigation className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{locateStatus}</span>
            </div>
          )}

          {/* Map Stage */}
          <div className="relative flex-1 w-full h-full min-h-[450px]">
            <APIProvider apiKey={activeApiKey} solutionChannel="GMP_visgl_reactgooglemaps_v1.0.0">
              <Map
                style={{ width: '100%', height: '100%' }}
                defaultCenter={LAPU_LAPU_CENTER}
                defaultZoom={13}
                mapId={customMapId || 'b23756c2d1b822d'}
                mapTypeId={mapType}
                gestureHandling="greedy"
                disableDefaultUI={false}
                internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
              >
                {/* Dynamic Camera Panner */}
                <MapController targetCenter={cameraTarget} targetZoom={cameraZoom} />

                {/* User Current GPS Location Marker */}
                {userLocation && (
                  <AdvancedMarker
                    position={{ lat: userLocation.lat, lng: userLocation.lng }}
                    title={userLocation.label}
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -inset-2 bg-blue-500/40 rounded-full animate-ping pointer-events-none" />
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg z-20 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>
                    </div>
                  </AdvancedMarker>
                )}

                {/* Render Sightings with Privacy Blur Circles */}
                {showSightings &&
                  filteredSightings.map(sighting => (
                    <React.Fragment key={`sighting-grp-${sighting.id}`}>
                      {/* Privacy Obfuscation Circle (200m - 500m) */}
                      {showPrivacyZones && (
                        <MapCircle
                          center={sighting.approxCoords}
                          radius={sighting.privacyRadiusMeters}
                          fillColor="#10B981"
                          fillOpacity={0.18}
                          strokeColor="#10B981"
                          strokeWeight={2}
                          strokeOpacity={0.7}
                          onClick={() => handleSightingClick(sighting)}
                        />
                      )}

                      {/* Interactive AdvancedMarker for Sighting */}
                      <AdvancedMarker
                        position={sighting.approxCoords}
                        onClick={() => handleSightingClick(sighting)}
                        title={`Sighting: ${sighting.species} in ${sighting.spottedAddress}`}
                      >
                        <div
                          className={`relative cursor-pointer transition-transform duration-200 hover:scale-115 ${
                            selectedSightingId === sighting.id ? 'scale-115 z-30' : 'z-20'
                          }`}
                        >
                          {/* Pulse Ring */}
                          <div className="absolute -inset-2 bg-emerald-500/30 rounded-full animate-ping pointer-events-none" />
                          
                          {/* Marker Badge Container */}
                          <div className="bg-slate-900 p-1 rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center gap-1.5 text-white pr-2">
                            <img
                              src={sighting.photoUrl}
                              alt={sighting.species}
                              className="w-7 h-7 rounded-xl object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col text-[10px] leading-tight">
                              <span className="font-bold text-emerald-300">Spotting</span>
                              <span className="text-slate-300 text-[9px] truncate max-w-[80px]">
                                {sighting.spottedAddress.split(',')[0]}
                              </span>
                            </div>
                          </div>
                        </div>
                      </AdvancedMarker>
                    </React.Fragment>
                  ))}

                {/* Render Polyline Connection between Matched Lost Pet and Sighting */}
                {activeSighting && matchedLostPet && (
                  <MapPolyline
                    path={[
                      matchedLostPet.lastSeenCoords,
                      ownerPrecisePinUnlocked ? activeSighting.exactCoordsProtected : activeSighting.approxCoords
                    ]}
                    strokeColor="#F59E0B"
                    strokeOpacity={0.85}
                    strokeWeight={3}
                  />
                )}

                {/* Render Verified Owner Exact Coordinate Pin if Unlocked */}
                {ownerPrecisePinUnlocked && activeSighting && (
                  <AdvancedMarker
                    position={activeSighting.exactCoordsProtected}
                    title="Verified Owner Exact Pinpoint"
                  >
                    <div className="bg-amber-500 text-white p-1.5 rounded-full shadow-2xl border-2 border-white animate-bounce">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                  </AdvancedMarker>
                )}

                {/* Render Lost Pets (Last-Seen Locations) */}
                {filteredLostPets.map(pet => (
                  <React.Fragment key={`pet-grp-${pet.id}`}>
                    {/* Search Radius Circle (300m) */}
                    {showLostPetRadii && (
                      <MapCircle
                        center={pet.lastSeenCoords}
                        radius={300}
                        fillColor="#E06D53"
                        fillOpacity={0.15}
                        strokeColor="#E06D53"
                        strokeWeight={2}
                        strokeOpacity={0.6}
                        onClick={() => handleLostPetClick(pet)}
                      />
                    )}

                    {/* Interactive AdvancedMarker for Lost Pet */}
                    <AdvancedMarker
                      position={pet.lastSeenCoords}
                      onClick={() => handleLostPetClick(pet)}
                      title={`Lost Pet: ${pet.name} (${pet.breed})`}
                    >
                      <div
                        className={`relative cursor-pointer transition-transform duration-200 hover:scale-115 ${
                          selectedLostPetId === pet.id ? 'scale-115 z-30' : 'z-10'
                        }`}
                      >
                        <div className="bg-slate-900 p-1 rounded-2xl border-2 border-[#E06D53] shadow-xl flex items-center gap-1.5 text-white pr-2">
                          <img
                            src={pet.photoUrl}
                            alt={pet.name}
                            className="w-7 h-7 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex flex-col text-[10px] leading-tight">
                            <span className="font-bold text-[#E06D53] flex items-center gap-0.5">
                              <span>Lost: {pet.name}</span>
                            </span>
                            <span className="text-slate-300 text-[9px] truncate max-w-[75px]">
                              {pet.breed}
                            </span>
                          </div>
                        </div>
                      </div>
                    </AdvancedMarker>
                  </React.Fragment>
                ))}
              </Map>
            </APIProvider>

            {/* Radar Live Status Overlay (Bottom Left) */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700 text-white text-xs max-w-xs shadow-xl pointer-events-none z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold font-display text-emerald-400">Lapu-Lapu Community Grid</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>
                  <span className="text-slate-400 block text-[10px]">Active Sightings:</span>
                  <span className="font-bold text-white">{sightings.length} Spotted</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Privacy Protection:</span>
                  <span className="font-bold text-emerald-400">200–500m Blur</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Selected Sighting / Match Inspector Drawer */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-amber-900/10 shadow-lg p-5 flex flex-col justify-between min-h-[380px] lg:h-[620px] overflow-y-auto">
          {activeSighting ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-bold">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Obfuscated Sighting Profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{activeSighting.spottedAt}</span>
                  <button
                    type="button"
                    onClick={() => setSelectedSightingId(null)}
                    className="p-1 min-h-[32px] min-w-[32px] rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                    title="Close Inspector"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Photo & Sighting Info */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img
                  src={activeSighting.photoUrl}
                  alt={activeSighting.species}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Lapu-Lapu City</span>
                </div>
              </div>

              {/* Address & Observation */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm font-display">
                  {activeSighting.spottedAddress}
                </h4>
                <p className="text-xs text-slate-600 bg-[#FDFBF7] p-3 rounded-xl border border-amber-900/10 leading-relaxed">
                  &quot;{activeSighting.conditionNotes}&quot;
                </p>
              </div>

              {/* Privacy Metrics & Owner Exact Pin Toggle */}
              <div className="bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl space-y-2 text-xs text-emerald-900">
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Reporter Location Obfuscated</span>
                  </span>
                  <span>±{activeSighting.privacyRadiusMeters}m Zone</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  EXIF metadata automatically scrubbed. Pin coordinate is randomized within the green radius circle to protect the spotter&apos;s home residence.
                </p>
                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-950">
                    {ownerPrecisePinUnlocked ? 'Precise coordinate unlocked' : 'Are you the verified pet owner?'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOwnerPrecisePinUnlocked(!ownerPrecisePinUnlocked)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      ownerPrecisePinUnlocked
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-white text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    }`}
                  >
                    {ownerPrecisePinUnlocked ? 'Exact Pin Active' : 'Reveal Exact Pin'}
                  </button>
                </div>
              </div>

              {/* AI Match Correlation Card */}
              {activeMatch && matchedLostPet ? (
                <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-[#E06D53]/30 p-3.5 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[#E06D53] font-display">
                      <Sparkles className="w-4 h-4" />
                      <span>{activeMatch.overallScore}% AI Match Detected</span>
                    </div>
                    <span className="bg-[#E06D53] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeMatch.distanceKm} km away
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <img
                      src={matchedLostPet.photoUrl}
                      alt={matchedLostPet.name}
                      className="w-12 h-12 rounded-xl object-cover border border-amber-300 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">
                        {matchedLostPet.name} ({matchedLostPet.breed})
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Last seen: {matchedLostPet.lastSeenAddress.split(',')[0]}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectMatch(activeMatch)}
                    className="w-full py-2 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                  >
                    <span>Launch Dual-Panel AI Match Inspector</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
                  <span>No high-confidence match registered yet for this sighting.</span>
                </div>
              )}
            </div>
          ) : activeLostPet ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-bold">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Lost Pet Profile</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLostPetId(null)}
                  className="p-1 min-h-[32px] min-w-[32px] rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close Inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                <img
                  src={activeLostPet.photoUrl}
                  alt={activeLostPet.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-900 text-lg font-display">
                  {activeLostPet.name} ({activeLostPet.breed})
                </h3>
                <p className="text-xs text-slate-600">
                  Last seen: <strong>{activeLostPet.lastSeenAddress}</strong>
                </p>
                {activeLostPet.reward && (
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg inline-block border border-emerald-200">
                    PHP ₱{activeLostPet.reward.toLocaleString()} Reunion Reward Offered
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700">Distinctive Markers:</span>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  {activeLostPet.distinctiveFeatures.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-400 space-y-2">
              <Compass className="w-10 h-10 text-slate-300 stroke-1" />
              <p className="text-xs font-medium">
                Click any sighting pin or lost pet marker on the Lapu-Lapu City map to inspect radar details.
              </p>
            </div>
          )}

          {/* Sighting Action Footer */}
          <div className="pt-4 border-t border-amber-900/10">
            <button
              onClick={onOpenReport}
              className="w-full py-2.5 bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Report a New Sighting in this Area</span>
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 font-display text-lg">
                <Key className="w-5 h-5 text-[#E06D53]" />
                <span>Google Maps Platform API Setup</span>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This app is powered by <strong>@vis.gl/react-google-maps</strong> and Google Maps JavaScript API with AdvancedMarkerElement.
            </p>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E06D53]" />
                <span>Free Maps Demo Key Quickstart</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                You can mint a free demo key without billing setup or cloud project requirements via the official Google Maps Demo portal:
              </p>
              <a
                href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#E06D53] hover:underline"
              >
                <span>Get Free Maps Demo Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Custom Google Maps API Key (Optional):
                </label>
                <input
                  type="text"
                  value={tempKeyInput}
                  onChange={e => setTempKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#E06D53]"
                />
                <p className="text-[10px] text-slate-400">
                  Or declare <code className="bg-slate-100 px-1 py-0.5 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in your environment.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Custom Map ID (Optional):
                </label>
                <input
                  type="text"
                  value={tempMapIdInput}
                  onChange={e => setTempMapIdInput(e.target.value)}
                  placeholder="b23756c2d1b822d"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:border-[#E06D53]"
                />
                <p className="text-[10px] text-slate-400">
                  Defaults to Google Maps Demo Map ID (<code className="bg-slate-100 px-1 py-0.5 rounded">b23756c2d1b822d</code>).
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (tempKeyInput.trim()) {
                    setCustomApiKey(tempKeyInput.trim());
                  }
                  if (tempMapIdInput.trim()) {
                    setCustomMapId(tempMapIdInput.trim());
                  }
                  setShowKeyModal(false);
                }}
                className="px-4 py-2 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Apply Config
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
