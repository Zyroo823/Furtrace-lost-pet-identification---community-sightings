import React, { useState } from 'react';
import { LostPet, Sighting, PetMatch, MatchStatus } from '../types';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Filter,
  Search,
  ArrowRight,
  TrendingUp,
  Shield,
  Heart,
  ChevronRight,
  Flag,
  ShieldAlert,
  ShieldCheck,
  EyeOff
} from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface MatchDashboardProps {
  matches: PetMatch[];
  lostPets: LostPet[];
  sightings: Sighting[];
  onSelectMatch: (match: PetMatch) => void;
  onOpenReportModal: () => void;
  onOpenLostRegisterModal: () => void;
  onUpdateMatchStatus: (matchId: string, status: MatchStatus) => void;
  onOpenFlagModal?: (targetId: string, targetType: 'sighting' | 'lost_pet' | 'match', targetTitle: string) => void;
  onOpenModerationPanel?: () => void;
  activeFlagsCount?: number;
}

export const MatchDashboard: React.FC<MatchDashboardProps> = ({
  matches,
  lostPets,
  sightings,
  onSelectMatch,
  onOpenReportModal,
  onOpenLostRegisterModal,
  onUpdateMatchStatus,
  onOpenFlagModal,
  onOpenModerationPanel,
  activeFlagsCount = 0
}) => {
  const [filterSpecies, setFilterSpecies] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Map helper
  const getPet = (id: string) => lostPets.find(p => p.id === id);
  const getSighting = (id: string) => sightings.find(s => s.id === id);

  const filteredMatches = matches.filter(m => {
    const pet = getPet(m.lostPetId);
    const sighting = getSighting(m.sightingId);
    if (!pet || !sighting) return false;

    const matchesSpecies = filterSpecies === 'All' || pet.species === filterSpecies;
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sighting.spottedAddress.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSpecies && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-900/10 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3 bg-[#E06D53]/10 text-[#E06D53] rounded-xl shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 font-display">
              {matches.length}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">AI Active Matches</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-900/10 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3 bg-[#7DA18B]/15 text-[#7DA18B] rounded-xl shrink-0">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 font-display">
              {sightings.length}
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Community Sightings</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-900/10 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3 bg-amber-100 text-amber-700 rounded-xl shrink-0">
            <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-800 font-display">
              91.4%
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Top Match Rate</div>
          </div>
        </div>

        <div className="bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-amber-900/10 shadow-xs flex items-center gap-2.5 sm:gap-3.5">
          <div className="p-2 sm:p-3 bg-emerald-100 text-emerald-700 rounded-xl shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-600 font-display">
              1,240+
            </div>
            <div className="text-[11px] sm:text-xs text-slate-500 font-medium">Pets Reunited</div>
          </div>
        </div>
      </div>

      {/* Filter Bar & Search */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-amber-900/10 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by pet name, breed, or neighborhood..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 min-h-[44px] text-base sm:text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E06D53]/20"
          />
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 text-xs">
          {/* Furry Household Species Filter */}
          <select
            value={filterSpecies}
            onChange={(e) => setFilterSpecies(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 min-h-[44px] text-base sm:text-xs text-slate-700 font-medium"
          >
            <option value="All">All Furry Pets (Lapu-Lapu)</option>
            <option value="Cat">Cats (Puspin / Domestic)</option>
            <option value="Dog">Dogs (Aspin / Domestic)</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 min-h-[44px] text-base sm:text-xs text-slate-700 font-medium"
          >
            <option value="All">All Match Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Reviewing">In Review</option>
            <option value="Verified">Verified Matches</option>
            <option value="Reunited">Reunited Pets</option>
          </select>

          {onOpenModerationPanel && (
            <button
              onClick={onOpenModerationPanel}
              className={`px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border ${
                activeFlagsCount > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Moderation Queue</span>
              {activeFlagsCount > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                  {activeFlagsCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={onOpenReportModal}
            className="hidden lg:flex px-3.5 py-2.5 min-h-[44px] bg-[#7DA18B] hover:bg-[#6c8f7a] text-white font-bold rounded-xl transition-colors shrink-0 items-center justify-center"
          >
            + Report Sighting
          </button>

          <button
            onClick={onOpenLostRegisterModal}
            className="hidden lg:flex px-3.5 py-2.5 min-h-[44px] bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold rounded-xl transition-colors shrink-0 items-center justify-center"
          >
            + Post Lost Pet
          </button>
        </div>
      </div>

      {/* Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredMatches.map((match) => {
          const pet = getPet(match.lostPetId);
          const sighting = getSighting(match.sightingId);
          if (!pet || !sighting) return null;

          return (
            <div
              key={match.id}
              className="bg-white rounded-2xl border border-amber-900/10 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
            >
              {/* Card Header with Confidence Badge */}
              <div className="p-4 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    match.overallScore >= 90
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : match.overallScore >= 80
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {match.overallScore}% Feature Match
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    #{match.id}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {pet.reward && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      PHP ₱{pet.reward.toLocaleString()} Reward
                    </span>
                  )}
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                    match.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : match.status === 'Reunited'
                      ? 'bg-purple-100 text-purple-800'
                      : match.status === 'Reviewing'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {match.status}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Thumbnail Comparisons */}
              <div className="p-4 grid grid-cols-2 gap-3 relative">
                {/* Lost Pet Side */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#E06D53] flex items-center justify-between">
                    <span>Lost: {pet.name}</span>
                    <span className="text-slate-400 font-normal">{pet.species}</span>
                  </div>
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                    <img
                      src={pet.photoUrl}
                      alt={`Registered missing pet profile photo of ${pet.name}, a ${pet.breed} with ${pet.primaryColor} coat`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 left-1.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Profile
                    </div>
                  </div>
                </div>

                {/* Sighting Side */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#7DA18B] flex items-center justify-between">
                    <span>Sighting #{sighting.id.toUpperCase()}</span>
                    <span className="text-slate-400 font-normal">{match.distanceKm} km away</span>
                  </div>
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                    <img
                      src={sighting.photoUrl}
                      alt={`Community sighting photo of spotted ${sighting.species} observed near ${sighting.spottedAddress}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 left-1.5 bg-[#7DA18B] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      Sighting
                    </div>
                  </div>
                </div>

                {/* AI Matching Connection Badge */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-md border border-amber-200 text-[#E06D53]">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              {/* Match Highlights & Submetrics */}
              <div className="px-4 pb-3 space-y-2 text-xs flex-1">
                <div className="grid grid-cols-3 gap-2 text-center py-2 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Facial Geo</span>
                    <strong className="text-slate-800 font-display">{match.facialGeometryScore}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Color Coat</span>
                    <strong className="text-slate-800 font-display">{match.colorHistogramScore}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Keypoints</span>
                    <strong className="text-[#E06D53] font-display">{match.keypoints.length} Points</strong>
                  </div>
                </div>

                <p className="text-slate-600 text-[11px] line-clamp-2 italic">
                  &quot;{match.aiAnalysisNotes}&quot;
                </p>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MapPin className="w-3 h-3 text-[#E06D53] shrink-0" />
                  <span className="truncate">Spotted: {sighting.spottedAddress}</span>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-3 sm:p-4 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center justify-between sm:justify-start gap-2 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    98% Trust Score
                  </span>
                  {onOpenFlagModal && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenFlagModal(sighting.id, 'sighting', `Sighting #${sighting.id.toUpperCase()}`);
                      }}
                      className="text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors p-2 min-h-[44px] min-w-[44px]"
                      title="Flag troll photo, fake location, or misinformation"
                      aria-label="Flag report"
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Report Flag</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => onSelectMatch(match)}
                  className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-98"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Inspect Dual-Panel Match</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
