import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, Settings, X, Check } from 'lucide-react';
import { CookiePreferences } from '../types';

const STORAGE_KEY_COOKIE = 'furtrace_cookie_consent';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    mapStorage: true
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_COOKIE);
      if (!stored) {
        // Small delay to prevent layout pop
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      } else {
        setPreferences(JSON.parse(stored));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSaveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY_COOKIE, JSON.stringify(prefs));
    } catch {
      // Ignore
    }
    setPreferences(prefs);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    handleSaveConsent({
      essential: true,
      analytics: true,
      mapStorage: true
    });
  };

  const handleEssentialOnly = () => {
    handleSaveConsent({
      essential: true,
      analytics: false,
      mapStorage: false
    });
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Streamlined Bottom Privacy & Cookie Notice */}
      <div className="fixed bottom-16 md:bottom-4 left-3 right-3 sm:left-6 sm:right-6 max-w-2xl mx-auto z-40">
        <div className="bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3.5 sm:px-4 sm:py-3 shadow-xl border border-slate-700 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <Cookie className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-slate-300 truncate">
              We only use essential cookies for login and radar filters. No trackers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleAcceptAll}
              className="px-3 py-1.5 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Got it
            </button>
            <button
              onClick={handleEssentialOnly}
              className="text-slate-400 hover:text-white p-1 cursor-pointer"
              aria-label="Close notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-amber-900/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-amber-900/10">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#E06D53]" />
                <h3 className="font-bold text-slate-900 font-display text-base">Cookie Preferences</h3>
              </div>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Customize which data technologies you permit while using FURTRACE.
            </p>

            <div className="space-y-3">
              {/* Essential */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Strictly Necessary</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded">Required</span>
                  </span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Maintains user login session, security tokens, and photo upload verification.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="rounded text-[#E06D53] mt-1"
                />
              </div>

              {/* Map Preferences */}
              <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-amber-200/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Map & Geolocation Cache</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Stores your selected barangay and search radius zoom for fast reloading.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.mapStorage}
                  onChange={(e) => setPreferences({ ...preferences, mapStorage: e.target.checked })}
                  className="rounded text-[#E06D53] mt-1 focus:ring-[#E06D53]"
                />
              </div>

              {/* Analytics */}
              <div className="p-3 bg-[#FDFBF7] rounded-2xl border border-amber-200/80 flex items-start justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">Community Analytics</span>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Helps measure recovery response times and high-density lost pet alerts.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="rounded text-[#E06D53] mt-1 focus:ring-[#E06D53]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-amber-900/10">
              <button
                onClick={() => setShowPreferences(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveConsent(preferences)}
                className="px-4 py-2 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
