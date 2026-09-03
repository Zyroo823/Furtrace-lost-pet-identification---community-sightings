import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, Share2, ArrowRight, Sparkles, X, Heart } from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'sighting' | 'lost_pet';
  title: string;
  referenceId: string;
  species?: string;
  location?: string;
}

export const ThankYouModal: React.FC<ThankYouModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  referenceId,
  species = 'Pet',
  location = 'Lapu-Lapu Community Sector'
}) => {
  if (!isOpen) return null;

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Shareable report link copied to clipboard.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-amber-900/15 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close thank you modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mascot & Success Icon */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DetectiveWhiskers size="sm" mood="reunited" />
        </div>

        {/* Header Content */}
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
            {type === 'lost_pet' ? 'Profile Registered Successfully' : 'Sighting Dispatched to Community'}
          </span>
          <h2 className="text-2xl font-black text-slate-900 font-display">
            Thank You for Protecting Our Pets!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {type === 'lost_pet'
              ? `Your lost profile for ${title} is active. Our automated visual comparison is checking recent sightings against your pet's photo.`
              : `Your sighting report for the ${species} in ${location} is published. Volunteers and matching pet owners will receive instant notifications.`}
          </p>
        </div>

        {/* Response Time SLA Promise Badge (Component 8) */}
        <div className="bg-amber-50/80 rounded-2xl p-3.5 border border-amber-200 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#E06D53] text-white flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-left space-y-0.5">
            <p className="text-xs font-bold text-slate-900">
              Direct Response Time Promise (Under 15 Minutes)
            </p>
            <p className="text-[11px] text-slate-600 leading-snug">
              Neighborhood volunteers receive radar alerts within 15 minutes. Automatic image matches trigger alerts in under 3 seconds.
            </p>
          </div>
        </div>

        {/* Reference and Action Steps */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-left">
          <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-2">
            <span className="text-slate-500 font-medium">Tracking Reference:</span>
            <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
              #{referenceId}
            </span>
          </div>

          <p className="text-xs font-bold text-slate-800">Clear Next Steps:</p>
          <ul className="text-xs text-slate-600 space-y-2">
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                1
              </span>
              <span>Keep your phone nearby. Verified matches prompt you via SMS and dashboard notices.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                2
              </span>
              <span>Check the Privacy Radar Map to see recent sightings reported near your location.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                3
              </span>
              <span>Share this report with neighbors to expand search coverage.</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            onClick={copyShareLink}
            className="w-full sm:flex-1 px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#E06D53]" />
            <span>Share Report Alert</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-3 bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
