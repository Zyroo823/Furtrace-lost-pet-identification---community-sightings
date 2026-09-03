import React, { useState } from 'react';
import { LostPet, Sighting, PetMatch, KeypointMatch } from '../types';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  Eye,
  Sliders,
  Maximize2,
  Lock,
  ChevronRight,
  Info,
  Phone,
  MessageSquare,
  FileText,
  Flag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface MatchComparisonModalProps {
  match: PetMatch;
  lostPet: LostPet;
  sighting: Sighting;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (matchId: string, status: 'Verified' | 'Unrelated' | 'Reunited') => void;
  onOpenSecureContact: (match: PetMatch) => void;
  onOpenFlagModal?: (targetId: string, targetType: 'sighting' | 'lost_pet' | 'match', targetTitle: string) => void;
}

export const MatchComparisonModal: React.FC<MatchComparisonModalProps> = ({
  match,
  lostPet,
  sighting,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenSecureContact,
  onOpenFlagModal
}) => {
  const [activeKeypointId, setActiveKeypointId] = useState<string | null>(match.keypoints[0]?.id || null);
  const [viewMode, setViewMode] = useState<'dual' | 'slider' | 'heatmap'>('dual');
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [showKeypoints, setShowKeypoints] = useState<boolean>(true);
  const [showVectorDrawer, setShowVectorDrawer] = useState<boolean>(false);

  if (!isOpen) return null;

  const activeKeypoint = match.keypoints.find(kp => kp.id === activeKeypointId);

  const handleVerify = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    onUpdateStatus(match.id, 'Verified');
  };

  const handleReunite = () => {
    confetti({
      particleCount: 160,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#E06D53', '#7DA18B', '#10B981', '#F59E0B']
    });
    onUpdateStatus(match.id, 'Reunited');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] w-full max-w-6xl rounded-2xl shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-b border-amber-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 bg-[#E06D53]/10 text-[#E06D53] rounded-xl shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-base sm:text-xl font-bold text-slate-800 font-display">
                  Visual Feature Match Analysis
                </h2>
                <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                  match.overallScore >= 90
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : match.overallScore >= 80
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {match.overallScore}% AI Match
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 truncate max-w-xs sm:max-w-md">
                Comparing Profile (<strong className="text-slate-700">{lostPet.name}</strong>) vs. Sighting (#{sighting.id.toUpperCase()})
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
            {/* View Mode Switcher (Visible & Responsive on Mobile) */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600 shrink-0">
              <button
                onClick={() => setViewMode('dual')}
                className={`px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg transition-all text-xs ${
                  viewMode === 'dual' ? 'bg-white text-[#E06D53] shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Dual
              </button>
              <button
                onClick={() => setViewMode('slider')}
                className={`px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg transition-all text-xs ${
                  viewMode === 'slider' ? 'bg-white text-[#E06D53] shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-2.5 sm:px-3 py-1.5 min-h-[36px] rounded-lg transition-all text-xs ${
                  viewMode === 'heatmap' ? 'bg-white text-[#E06D53] shadow-xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                Heatmap
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-xl flex items-center justify-center transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Score Matrix & Detective Whiskers Advice */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Score Breakdown Cards */}
            <div className="lg:col-span-8 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold tracking-wide uppercase text-slate-500">
                  Feature Similarity Sub-Metrics (MobileNetV3 + ResNet-50)
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Evaluated {match.createdAt}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">Facial Geometry</div>
                  <div className="text-lg font-bold text-slate-800 font-display mt-0.5">
                    {match.facialGeometryScore}%
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#E06D53] h-full rounded-full" style={{ width: `${match.facialGeometryScore}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">Color Histogram</div>
                  <div className="text-lg font-bold text-slate-800 font-display mt-0.5">
                    {match.colorHistogramScore}%
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#7DA18B] h-full rounded-full" style={{ width: `${match.colorHistogramScore}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">Marking Patterns</div>
                  <div className="text-lg font-bold text-slate-800 font-display mt-0.5">
                    {match.markingPatternScore}%
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${match.markingPatternScore}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">Location Proximity</div>
                  <div className="text-lg font-bold text-emerald-600 font-display mt-0.5">
                    {match.distanceKm} km
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" /> Close proximity
                  </div>
                </div>
              </div>
            </div>

            {/* Detective Whiskers AI Assessment */}
            <div className="lg:col-span-4 bg-gradient-to-br from-amber-50 to-orange-50/50 p-4 rounded-xl border border-amber-200/80 flex items-center gap-3">
              <DetectiveWhiskers size="md" mood="detecting" />
              <div className="text-xs">
                <div className="font-bold text-[#E06D53] font-display text-sm">
                  Whiskers&apos; Inspection Note
                </div>
                <p className="text-slate-700 mt-0.5 leading-relaxed line-clamp-3">
                  {match.aiAnalysisNotes}
                </p>
                <button
                  onClick={() => setShowVectorDrawer(!showVectorDrawer)}
                  className="mt-1 text-[11px] text-[#E06D53] font-semibold underline hover:text-[#c4533a]"
                >
                  {showVectorDrawer ? 'Hide Vector Math' : 'Inspect 512-d Embedding Cosine Distance'}
                </button>
              </div>
            </div>
          </div>

          {/* Vector Drawer (Collapsible) */}
          {showVectorDrawer && (
            <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2 border border-slate-800">
              <div className="flex justify-between items-center text-slate-400">
                <span className="font-semibold text-amber-400">Cosine Similarity Calculation:</span>
                <span>Dim: 512-float vector</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Formula: <code className="text-emerald-400">cos(θ) = (v_lost · v_sighting) / (||v_lost|| * ||v_sighting||)</code>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                <div className="bg-slate-800/80 p-2 rounded">
                  <span className="text-[#E06D53] font-bold">{lostPet.name} Vector:</span> [{lostPet.embeddingVectorPreview.join(', ')} ... +502 dims]
                </div>
                <div className="bg-slate-800/80 p-2 rounded">
                  <span className="text-[#7DA18B] font-bold">Sighting #{sighting.id} Vector:</span> [{sighting.embeddingVectorPreview.join(', ')} ... +502 dims]
                </div>
              </div>
            </div>
          )}

          {/* Dual Panel Comparison Canvas */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowKeypoints(!showKeypoints)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    showKeypoints
                      ? 'bg-[#E06D53] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  {showKeypoints ? 'Keypoints Visible' : 'Show Keypoints'}
                </button>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  Click any numbered keypoint pin to inspect matching anatomical markers.
                </span>
              </div>

              {/* Sighting Privacy Badge */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EXIF Scrubbed & Location Obfuscated ({sighting.privacyRadiusMeters}m Zone)</span>
              </div>
            </div>

            {/* Mode 1: Dual Side-by-Side Panel */}
            {viewMode === 'dual' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Panel 1: Lost Pet Reference */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5 text-[#E06D53]">
                      <span className="w-2 h-2 rounded-full bg-[#E06D53]" />
                      Original Profile Photo: {lostPet.name}
                    </span>
                    <span className="text-slate-400">Owner Upload</span>
                  </div>

                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 group">
                    <img
                      src={lostPet.photoUrl}
                      alt={`Registered lost pet photo of ${lostPet.name}, a ${lostPet.breed}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {/* Keypoint Pins on Pet */}
                    {showKeypoints && match.keypoints.map((kp, idx) => (
                      <button
                        key={`pet-kp-${kp.id}`}
                        onClick={() => setActiveKeypointId(kp.id)}
                        style={{ left: `${kp.petCoord.x}%`, top: `${kp.petCoord.y}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform shadow-lg ${
                          activeKeypointId === kp.id
                            ? 'bg-[#E06D53] text-white ring-4 ring-[#E06D53]/40 scale-125 z-20'
                            : 'bg-white/90 text-slate-800 hover:scale-110 z-10'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 flex flex-wrap justify-between items-center gap-1">
                    <span>Breed: {lostPet.breed}</span>
                    <span>Gender: {lostPet.gender}</span>
                    <span>Age: {lostPet.ageYears} yrs</span>
                    {lostPet.reward && (
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                        PHP ₱{lostPet.reward.toLocaleString()} Reunion Reward
                      </span>
                    )}
                  </div>
                </div>

                {/* Panel 2: Community Sighting Photo */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5 text-[#7DA18B]">
                      <span className="w-2 h-2 rounded-full bg-[#7DA18B]" />
                      Community Sighting #{sighting.id.toUpperCase()}
                    </span>
                    <span className="text-slate-400">Spotted {sighting.spottedAt}</span>
                  </div>

                  <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 group">
                    <img
                      src={sighting.photoUrl}
                      alt={`Community sighting photo of ${sighting.species} in ${sighting.spottedAddress}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />

                    {/* Keypoint Pins on Sighting */}
                    {showKeypoints && match.keypoints.map((kp, idx) => (
                      <button
                        key={`sight-kp-${kp.id}`}
                        onClick={() => setActiveKeypointId(kp.id)}
                        style={{ left: `${kp.sightingCoord.x}%`, top: `${kp.sightingCoord.y}%` }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform shadow-lg ${
                          activeKeypointId === kp.id
                            ? 'bg-[#7DA18B] text-white ring-4 ring-[#7DA18B]/40 scale-125 z-20'
                            : 'bg-white/90 text-slate-800 hover:scale-110 z-10'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Reporter: {sighting.reporterName}</span>
                    <span>Collar: {sighting.hasCollar ? 'Yes' : 'No collar detected'}</span>
                    <span>Location: {sighting.spottedAddress}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Interactive Split Slider */}
            {viewMode === 'slider' && (
              <div className="space-y-3">
                <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 select-none">
                  {/* Lost Pet Image (Underneath) */}
                  <img
                    src={lostPet.photoUrl}
                    alt={lostPet.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover"
                  />

                  {/* Sighting Image (Clipped on top) */}
                  <div
                    className="absolute inset-0 overflow-hidden border-r-2 border-white shadow-2xl"
                    style={{ width: `${sliderPosition}%` }}
                  >
                    <img
                      src={sighting.photoUrl}
                      alt="Sighting"
                      referrerPolicy="no-referrer"
                      className="absolute top-0 left-0 h-full max-w-none object-cover"
                      style={{ width: '100%', minWidth: '100%' }}
                    />
                    <div className="absolute top-3 left-3 bg-black/70 text-white text-[11px] px-2 py-1 rounded font-semibold">
                      Sighting #{sighting.id}
                    </div>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/70 text-white text-[11px] px-2 py-1 rounded font-semibold">
                    Original {lostPet.name}
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white shadow"
                    style={{ left: `${sliderPosition}%` }}
                  >
                    <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E06D53] text-white flex items-center justify-center shadow-lg cursor-ew-resize">
                      <Sliders className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-2">
                  <span className="text-xs text-slate-500">Sighting</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={(e) => setSliderPosition(Number(e.target.value))}
                    className="flex-1 accent-[#E06D53]"
                  />
                  <span className="text-xs text-slate-500">Original Profile</span>
                </div>
              </div>
            )}

            {/* Mode 3: Grad-CAM Activation Heatmap Simulation */}
            {viewMode === 'heatmap' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">
                    Grad-CAM Feature Activation: {lostPet.name}
                  </div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-300">
                    <img
                      src={lostPet.photoUrl}
                      alt={lostPet.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-radial from-red-500/50 via-yellow-400/30 to-blue-600/20 mix-blend-color-burn pointer-events-none" />
                    <div className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      Target Layer: Conv_5 (7x7 receptive field)
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-700">
                    Grad-CAM Feature Activation: Sighting #{sighting.id}
                  </div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden border border-slate-300">
                    <img
                      src={sighting.photoUrl}
                      alt="Sighting"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover filter contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-radial from-red-500/50 via-yellow-400/30 to-blue-600/20 mix-blend-color-burn pointer-events-none" />
                    <div className="absolute bottom-2 left-2 bg-black/75 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      High Activation on Facial Mask & Chest
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Keypoint Detail Card */}
            {activeKeypoint && (
              <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#E06D53] text-white text-xs font-bold flex items-center justify-center">
                      {match.keypoints.findIndex(k => k.id === activeKeypoint.id) + 1}
                    </span>
                    <span className="font-bold text-slate-800 text-sm">
                      {activeKeypoint.name}
                    </span>
                    <span className="text-[11px] bg-white px-2 py-0.5 rounded border border-amber-200 text-slate-600 font-medium">
                      Category: {activeKeypoint.category.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    {activeKeypoint.description}
                  </p>
                </div>

                <div className="bg-white px-3 py-1.5 rounded-lg border border-amber-200 text-right shrink-0">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Anatomical Confidence</div>
                  <div className="text-base font-bold text-[#E06D53] font-display">
                    {Math.round(activeKeypoint.confidence * 100)}%
                  </div>
                </div>
              </div>
            )}

            {/* Keypoints Pills List */}
            <div className="flex flex-wrap gap-2 pt-1">
              {match.keypoints.map((kp, idx) => (
                <button
                  key={kp.id}
                  onClick={() => setActiveKeypointId(kp.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    activeKeypointId === kp.id
                      ? 'bg-[#E06D53] text-white border-[#E06D53] shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-bold mr-1.5">{idx + 1}.</span>
                  {kp.name}
                </button>
              ))}
            </div>
          </div>

          {/* Privacy & Location Summary */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#7DA18B] shrink-0" />
              <span>
                <strong>Zero-Knowledge Address Protection:</strong> Spotter’s residential address is blurred within a {sighting.privacyRadiusMeters}m circle. Exact location is unlocked only upon mutual verification.
              </span>
            </div>
            <button
              onClick={() => onOpenSecureContact(match)}
              className="text-[#E06D53] font-bold hover:underline shrink-0"
            >
              Learn about E2EE Messaging →
            </button>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-t border-amber-900/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 text-xs">
            <button
              onClick={() => onUpdateStatus(match.id, 'Unrelated')}
              className="px-3 py-2 min-h-[44px] text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Mark as Unrelated
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            {onOpenFlagModal && (
              <button
                onClick={() => onOpenFlagModal(sighting.id, 'sighting', `Sighting #${sighting.id.toUpperCase()}`)}
                className="px-3 py-2 min-h-[44px] text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-1 transition-colors"
                title="Report fake location, troll photo, or misinformation"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Flag Misinformation</span>
              </button>
            )}
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs text-slate-500 py-1">
              Status: <strong className="text-slate-800">{match.status}</strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => onOpenSecureContact(match)}
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
              <span>Message Spotter</span>
            </button>

            <button
              onClick={handleVerify}
              className="w-full sm:w-auto px-4 py-2.5 min-h-[44px] text-xs font-bold bg-[#7DA18B] hover:bg-[#6c8f7a] text-white rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify Match</span>
            </button>

            <button
              onClick={handleReunite}
              className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] text-xs font-bold bg-[#E06D53] hover:bg-[#c95d45] text-white rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Confirm Reunited! 🎉</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
