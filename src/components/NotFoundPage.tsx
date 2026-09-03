import React from 'react';
import { Home, Camera, ArrowLeft, Search, Compass } from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface NotFoundPageProps {
  onGoHome: () => void;
  onOpenReportModal: () => void;
  onOpenLostRegisterModal: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onOpenReportModal,
  onOpenLostRegisterModal
}) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-amber-900/15 shadow-xl text-center space-y-6 relative overflow-hidden">
        <div className="flex justify-center">
          <DetectiveWhiskers size="hero" mood="searching" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-full border border-rose-200">
            Error 404 • Page Not Found
          </span>
          <h1 className="text-3xl font-black text-slate-900 font-display">
            Paws and Claws, This Trail Went Cold!
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The page or report you are looking for has been moved or never existed. Detective Whiskers checked every scent in the neighborhood.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={onGoHome}
            className="w-full px-5 py-3 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home Dashboard</span>
          </button>

          <button
            onClick={onOpenReportModal}
            className="w-full px-5 py-3 bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-2xl shadow-md flex items-center justify-center gap-2 transition-transform active:scale-98"
          >
            <Camera className="w-4 h-4" />
            <span>Report a Pet Sighting</span>
          </button>
        </div>

        <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
          <button
            onClick={onOpenLostRegisterModal}
            className="hover:text-[#E06D53] transition-colors"
          >
            Looking for your missing pet? Register here
          </button>
        </div>
      </div>
    </div>
  );
};
