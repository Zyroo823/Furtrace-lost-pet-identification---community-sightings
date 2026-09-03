import React from 'react';
import { Camera, Plus, Sparkles, MapPin } from 'lucide-react';

interface StickyMobileCTAProps {
  onOpenReportModal: () => void;
  onOpenLostRegisterModal: () => void;
  onSelectView: (view: 'dashboard' | 'map') => void;
  activeView: 'dashboard' | 'map' | string;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  onOpenReportModal,
  onOpenLostRegisterModal,
  onSelectView,
  activeView
}) => {
  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-amber-900/15 py-1.5 px-2.5 flex items-center justify-between gap-1.5 shadow-2xl safe-area-bottom"
    >
      {/* Feed View Button */}
      <button
        onClick={() => onSelectView('dashboard')}
        className={`flex-1 min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
          activeView === 'dashboard'
            ? 'bg-amber-50 text-[#E06D53]'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <Sparkles className="w-4 h-4 text-[#E06D53]" />
        <span className="text-[11px] leading-none">Feed</span>
      </button>

      {/* Map View Button */}
      <button
        onClick={() => onSelectView('map')}
        className={`flex-1 min-h-[48px] px-2 py-1 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 ${
          activeView === 'map'
            ? 'bg-emerald-50 text-[#7DA18B]'
            : 'text-slate-600 hover:text-slate-900'
        }`}
      >
        <MapPin className="w-4 h-4 text-[#7DA18B]" />
        <span className="text-[11px] leading-none">Radar</span>
      </button>

      {/* Primary Action 1: Report Sighting (Spot) */}
      <button
        onClick={onOpenReportModal}
        className="flex-[1.2] min-h-[48px] px-2 py-1.5 bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        <Camera className="w-4 h-4 shrink-0" />
        <span className="text-xs whitespace-nowrap">Spot Pet</span>
      </button>

      {/* Primary Action 2: Post Lost Pet */}
      <button
        onClick={onOpenLostRegisterModal}
        className="flex-[1.2] min-h-[48px] px-2 py-1.5 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
      >
        <Plus className="w-4 h-4 shrink-0" />
        <span className="text-xs whitespace-nowrap">Post Lost</span>
      </button>
    </nav>
  );
};
