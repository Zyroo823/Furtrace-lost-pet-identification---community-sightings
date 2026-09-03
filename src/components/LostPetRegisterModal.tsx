import React, { useState } from 'react';
import { LostPet, PetSpecies, PetGender } from '../types';
import { geocodeAddress, getDeviceGPSLocation } from '../lib/locationService';
import {
  X,
  UploadCloud,
  Sparkles,
  MapPin,
  Tag,
  Shield,
  CheckCircle,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Clock,
  Crosshair,
  Navigation
} from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface LostPetRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterPet: (pet: LostPet) => void;
}

export const LostPetRegisterModal: React.FC<LostPetRegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterPet
}) => {
  const [name, setName] = useState<string>('Ollie');
  const [species, setSpecies] = useState<PetSpecies>('Dog');
  const [breed, setBreed] = useState<string>('Aspin / Corgi Mix');
  const [primaryColor, setPrimaryColor] = useState<string>('Red & White');
  const [secondaryColor, setSecondaryColor] = useState<string>('Fawn markings');
  const [gender, setGender] = useState<PetGender>('Male');
  const [ageYears, setAgeYears] = useState<number>(3);
  const [microchipId, setMicrochipId] = useState<string>('PH-985141002239100');
  const [lastSeenAddress, setLastSeenAddress] = useState<string>('Near Mactan Marina Mall, Barangay Pusok, Lapu-Lapu City');
  const [lastSeenCoords, setLastSeenCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isGettingGps, setIsGettingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [lastSeenDate, setLastSeenDate] = useState<string>('2026-08-31');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&w=800&q=80'
  );
  const [reward, setReward] = useState<string>('5000');
  const [distinctiveFeatureInput, setDistinctiveFeatureInput] = useState<string>('');
  const [featuresList, setFeaturesList] = useState<string[]>([
    'Heart-shaped white blaze on chest',
    'Right ear has dark sable shading on rear flap',
    'Wearing navy blue collar with gold paw tag'
  ]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleAcquireGps = async () => {
    setIsGettingGps(true);
    setGpsStatus('Acquiring high-precision GPS satellite fix...');
    try {
      const pos = await getDeviceGPSLocation();
      setLastSeenCoords({ lat: pos.lat, lng: pos.lng });
      const srcLabel = pos.source === 'gps_satellite' ? 'Satellite GPS' : pos.source === 'network_cellular' ? 'Cellular / Wi-Fi Fix' : 'Network Triangulation';
      setGpsStatus(`${srcLabel} locked: ±${pos.accuracy}m accuracy`);
      if (pos.resolvedAddress) {
        setLastSeenAddress(pos.resolvedAddress);
      } else {
        setLastSeenAddress(`GPS Pin (${pos.lat.toFixed(4)}°N, ${pos.lng.toFixed(4)}°E), Lapu-Lapu City`);
      }
    } catch {
      setGpsStatus('GPS access denied or unavailable. Please enter an address manually.');
    } finally {
      setIsGettingGps(false);
    }
  };

  const handleAddFeature = () => {
    if (distinctiveFeatureInput.trim()) {
      setFeaturesList([...featuresList, distinctiveFeatureInput.trim()]);
      setDistinctiveFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      let finalCoords = lastSeenCoords;
      if (!finalCoords) {
        const geocoded = geocodeAddress(lastSeenAddress);
        finalCoords = geocoded.coords;
      }

      const newPet: LostPet = {
        id: `pet-${Math.floor(100 + Math.random() * 900)}`,
        name,
        species,
        breed,
        primaryColor,
        secondaryColor,
        gender,
        ageYears,
        microchipId: microchipId || undefined,
        lastSeenAddress,
        lastSeenCoords: finalCoords,
        lastSeenDate,
        photoUrl,
        distinctiveFeatures: featuresList,
        contactName: 'Verified Pet Owner',
        contactPhoneProtected: '+63 917 *** 5120',
        reward: reward.trim() !== '' && !isNaN(Number(reward)) && Number(reward) > 0 ? Number(reward) : undefined,
        status: 'Lost',
        embeddingVectorPreview: [
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2)),
          Number((Math.random() * 2 - 1).toFixed(2))
        ]
      };

      onRegisterPet(newPet);
      setIsProcessing(false);
      setIsRegistered(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] w-full max-w-2xl rounded-2xl shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-b border-amber-900/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 bg-[#E06D53]/15 text-[#E06D53] rounded-xl shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 font-display">
                Register Missing Pet Profile
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                AI feature vector extraction scans community sightings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!isRegistered ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Pet Photo & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Pet Photo
                  </label>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative group">
                    <img
                      src={photoUrl}
                      alt="Pet preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="Image URL..."
                    className="w-full text-[11px] bg-white border border-slate-200 rounded-lg p-1.5 text-slate-600"
                  />
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Barnaby, Milo, Daisy..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-800 font-bold"
                    />
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#E06D53] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-tight">
                      <strong>Furry Pets Only:</strong> FURTRACE accepts domestic Dogs (Aspin, Shih Tzu, etc.) and Cats (Puspin, Persian, etc.) common in Lapu-Lapu City households. Fish, birds, hamsters, and reptiles are not accepted.
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                        Species (Furry Pet)
                      </label>
                      <select
                        value={species}
                        onChange={(e) => setSpecies(e.target.value as PetSpecies)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium"
                      >
                        <option value="Dog">Dog / Aspin (Asong Pinoy)</option>
                        <option value="Cat">Cat / Puspin (Pusang Pinoy)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as PetGender)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Unknown">Unknown</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                      Breed / Mix
                    </label>
                    <input
                      type="text"
                      required
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      placeholder="e.g. Golden Retriever, Tabby Mix..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Color, Microchip, Reward */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Primary Coat Color
                  </label>
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Microchip ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={microchipId}
                    onChange={(e) => setMicrochipId(e.target.value)}
                    placeholder="15-digit ISO chip"
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                    Reunion Reward (PHP / ₱)
                  </label>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 select-none">
                      ₱
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={reward}
                      onChange={(e) => setReward(e.target.value)}
                      placeholder="0"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-800"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Optional community reward in Philippine Peso (PHP / ₱)
                  </span>
                </div>
              </div>

              {/* Last Seen Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#E06D53]" /> Last Seen Location
                    </label>
                    <button
                      type="button"
                      onClick={handleAcquireGps}
                      disabled={isGettingGps}
                      className={`text-[10px] px-2 py-0.5 rounded-md border flex items-center gap-1 transition-colors ${
                        lastSeenCoords
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                      }`}
                    >
                      <Crosshair className={`w-3 h-3 ${isGettingGps ? 'animate-spin text-[#E06D53]' : lastSeenCoords ? 'text-emerald-600' : 'text-slate-500'}`} />
                      <span>{isGettingGps ? 'Locating...' : lastSeenCoords ? 'GPS Locked' : 'Use GPS'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={lastSeenAddress}
                    onChange={(e) => {
                      setLastSeenAddress(e.target.value);
                      if (lastSeenCoords) setLastSeenCoords(null);
                    }}
                    placeholder="Street, Park, or Neighborhood"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                  {gpsStatus && (
                    <div className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5 shrink-0" />
                      <span>{gpsStatus}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#7DA18B]" /> Last Seen Date
                  </label>
                  <input
                    type="date"
                    value={lastSeenDate}
                    onChange={(e) => setLastSeenDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Distinctive Features */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Distinctive Markings (Coat patterns, ear notches, collar)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={distinctiveFeatureInput}
                    onChange={(e) => setDistinctiveFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. White chest patch, blue collar, notched left ear..."
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {featuresList.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 px-3 py-1.5 rounded-lg text-xs text-slate-700"
                    >
                      <span>🐾 {feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Protection Promise Badge */}
              <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200/90 flex items-center gap-2.5 text-xs text-slate-700">
                <div className="w-7 h-7 rounded-lg bg-[#E06D53] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block text-[11px]">
                    Instant Community Alerts • 100% Free
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Community volunteers in your area receive alerts the moment someone spots a match.
                  </span>
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98 font-display text-sm disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isProcessing ? 'Activating Search...' : 'Publish Profile & Start Matching (Free)'}
              </button>
            </form>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-inner">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 font-display">
                Profile Registered & Search Active!
              </h3>
              <p className="text-xs text-slate-600 max-w-md">
                {name}&apos;s profile is active. Our neighborhood watch will compare every community sighting around {lastSeenAddress} and notify you immediately.
              </p>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#E06D53] text-white font-bold rounded-xl shadow-xs text-xs"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
