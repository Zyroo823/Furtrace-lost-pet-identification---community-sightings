import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Search,
  ShieldCheck,
  MapPin,
  HeartHandshake,
  Heart,
  ArrowRight
} from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface LandingHeroProps {
  onOpenReportModal: () => void;
  onOpenLostRegisterModal: () => void;
  onViewMap: () => void;
  onSelectView?: (view: 'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews') => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenReportModal,
  onOpenLostRegisterModal,
  onViewMap,
  onSelectView
}) => {
  const [whiskerTipIdx, setWhiskerTipIdx] = useState<number>(0);

  // Consumer-friendly, jargon-free pet recovery tips
  const tips = [
    "I compare photos of spotted animals with registered lost pets to discover matches instantly.",
    "Every report uses safe neighborhood areas so your personal home address stays private.",
    "Found a wandering pet on your street? Snap a photo to alert worried families nearby.",
    "Over 1,240 missing dogs and cats have already reunited with their families through our community."
  ];

  const handleNextTip = () => {
    setWhiskerTipIdx((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="bg-gradient-to-b from-amber-50/60 via-[#FDFBF7] to-[#FDFBF7] border-b border-amber-900/10 py-6 sm:py-8 px-3.5 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
        
        {/* Left Headline & Community Pitch */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 bg-amber-100/80 border border-amber-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#E06D53] max-w-full">
            <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="whitespace-normal sm:whitespace-nowrap">Community Lost Pet Recovery • 100% Free Forever</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight font-display leading-tight">
            Find your lost pet fast with <span className="text-[#E06D53]">neighborhood photo matching</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
            When your pet goes missing, seconds count. Snap a photo of a spotted animal or register your missing companion to receive instant neighborhood match alerts with protected privacy.
          </p>

          {/* 3-Second Visual Value Proposition */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-2 max-w-lg">
            <div className="bg-white/90 p-3 rounded-xl border border-amber-900/10 text-center shadow-2xs">
              <span className="text-xs font-bold text-slate-900 block font-display whitespace-nowrap">1. Snap Photo</span>
              <span className="text-[11px] text-slate-500 block">Upload in seconds</span>
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-amber-900/10 text-center shadow-2xs">
              <span className="text-xs font-bold text-[#E06D53] block font-display whitespace-nowrap">2. Match Markings</span>
              <span className="text-[11px] text-slate-500 block">Instant scan</span>
            </div>
            <div className="bg-white/90 p-3 rounded-xl border border-amber-900/10 text-center shadow-2xs">
              <span className="text-xs font-bold text-[#7DA18B] block font-display whitespace-nowrap">3. Reunited Safe</span>
              <span className="text-[11px] text-slate-500 block">Private alerts</span>
            </div>
          </div>

          {/* High-Visibility Primary CTA & Streamlined Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
            <button
              onClick={onOpenLostRegisterModal}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[48px] bg-[#E06D53] hover:bg-[#c95d45] text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all active:scale-98 text-sm font-display cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Report Lost Pet</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={onOpenReportModal}
              className="w-full sm:w-auto px-5 py-3.5 min-h-[48px] bg-[#7DA18B] hover:bg-[#6c8f7a] text-white font-bold rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all active:scale-98 text-sm font-display cursor-pointer whitespace-nowrap shrink-0"
            >
              <Camera className="w-4 h-4 shrink-0" />
              <span>Report Sighting</span>
            </button>

            <button
              onClick={onViewMap}
              className="w-full sm:w-auto px-4 py-3 min-h-[48px] text-slate-700 hover:text-[#E06D53] font-bold flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <MapPin className="w-4 h-4 text-[#E06D53] shrink-0" />
              <span>Browse Lost Pets Map</span>
            </button>
          </div>

          {/* Transparent Free Pricing & Social Proof */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-700 whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero Fees • 100% Free</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap">
              <HeartHandshake className="w-4 h-4 text-[#E06D53] shrink-0" />
              <span>1,240+ Pets Reunited</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5 font-semibold whitespace-nowrap">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Private Address Protection</span>
            </span>
          </div>

          {/* Internal Cross Links */}
          {onSelectView && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => onSelectView('case_studies')}
                className="hover:text-[#E06D53] transition-colors underline decoration-amber-300 underline-offset-4 flex items-center gap-1 py-1"
              >
                <span>Read 1,240+ Reunited Stories</span>
                <ArrowRight className="w-3 h-3 text-[#E06D53]" />
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => onSelectView('faq')}
                className="hover:text-[#E06D53] transition-colors underline decoration-amber-300 underline-offset-4 flex items-center gap-1 py-1"
              >
                <span>Community FAQ</span>
                <ArrowRight className="w-3 h-3 text-[#E06D53]" />
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={() => onSelectView('reviews')}
                className="hover:text-[#E06D53] transition-colors underline decoration-amber-300 underline-offset-4 flex items-center gap-1 py-1"
              >
                <span>Volunteer Reviews</span>
                <ArrowRight className="w-3 h-3 text-[#E06D53]" />
              </button>
            </div>
          )}
        </div>

        {/* Right Mascot Spotlight & Live Guide */}
        <div className="lg:col-span-5 bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-amber-900/15 shadow-xl relative overflow-hidden flex flex-col items-center text-center space-y-4">
          
          {/* Subtle Background Glow */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#E06D53]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#7DA18B]/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative">
            <DetectiveWhiskers size="hero" mood="detecting" onClick={handleNextTip} />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 font-bold text-slate-900 text-lg font-display">
              <span>Meet Detective Whiskers</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-xs text-slate-500">
              Community Pet Helper • Neighborhood Watch
            </p>
          </div>

          {/* Interactive Mascot Speech Bubble */}
          <div
            onClick={handleNextTip}
            className="w-full bg-[#FDFBF7] p-3.5 rounded-2xl border border-amber-200/80 text-xs text-slate-700 leading-relaxed cursor-pointer hover:border-[#E06D53]/40 transition-colors shadow-inner"
          >
            <p className="italic">
              &quot;{tips[whiskerTipIdx]}&quot;
            </p>
            <span className="text-[10px] text-[#E06D53] font-bold mt-1.5 block">
              (Click Whiskers for another community tip 🐾)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
