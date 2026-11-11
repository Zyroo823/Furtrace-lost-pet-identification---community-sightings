import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  Plus,
  Camera,
  User as UserIcon,
  ChevronDown,
  PawPrint,
  Settings,
  LogOut,
  LogIn,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Menu,
  X,
  FileText,
  HelpCircle,
  Star,
  Heart
} from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeView: string;
  onSelectView: (view: 'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews') => void;
  onOpenReportModal: () => void;
  onOpenLostRegisterModal: () => void;
  onOpenProfileModal: (tab: 'pets' | 'sightings' | 'settings') => void;
  onOpenModerationModal?: () => void;
  activeFlagsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onSelectView,
  onOpenReportModal,
  onOpenLostRegisterModal,
  onOpenProfileModal,
  onOpenModerationModal,
  activeFlagsCount = 0
}) => {
  const { currentUser, logout, openAuthModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const handleMobileNavClick = (view: 'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews') => {
    onSelectView(view);
    setIsMobileDrawerOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-b border-amber-900/10 transition-colors">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Brand Identity */}
        <button
          type="button"
          className="flex items-center gap-2 sm:gap-3 text-left shrink-0 min-h-[48px] py-1 cursor-pointer focus:outline-none"
          onClick={() => onSelectView('dashboard')}
          aria-label="FURTRACE Home"
        >
          <DetectiveWhiskers size="sm" mood="detecting" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight font-display text-slate-900">
                FUR<span className="text-[#E06D53]">TRACE</span>
              </span>
              <span className="bg-[#7DA18B]/15 text-[#7DA18B] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#7DA18B]/30 hidden sm:inline">
                Community Watch
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden md:block">
              Lost Pet Identification & Community Sightings
            </p>
          </div>
        </button>

        {/* Center Nav Links - Clean view switcher (Report buttons are exclusively on the right side) */}
        <nav className="hidden lg:flex items-center gap-1 bg-amber-900/5 p-1 rounded-2xl border border-amber-900/10 text-xs font-semibold text-slate-600 shrink">
          <button
            onClick={() => onSelectView('dashboard')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeView === 'dashboard'
                ? 'bg-white text-[#E06D53] shadow-xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <PawPrint className="w-3.5 h-3.5 shrink-0 text-[#E06D53]" />
            <span>Home</span>
          </button>

          <button
            onClick={() => onSelectView('map')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeView === 'map'
                ? 'bg-white text-[#E06D53] shadow-xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 shrink-0 text-[#7DA18B]" />
            <span>Browse Lost Pets</span>
          </button>

          <button
            onClick={() => onSelectView('case_studies')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeView === 'case_studies'
                ? 'bg-white text-[#E06D53] shadow-xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>Success Stories</span>
          </button>

          <button
            onClick={() => onSelectView('faq')}
            className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeView === 'faq'
                ? 'bg-white text-[#E06D53] shadow-xs font-extrabold'
                : 'hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>FAQ</span>
          </button>
        </nav>

        {/* Action Buttons & User Profile Block (Main Red & Green CTA Buttons) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Desktop quick CTA buttons */}
          <button
            onClick={onOpenReportModal}
            className="hidden sm:flex px-3 py-2 min-h-[40px] bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-xl shadow-xs items-center gap-1.5 transition-all active:scale-98 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>Report Sighting</span>
          </button>

          <button
            onClick={onOpenLostRegisterModal}
            className="hidden sm:flex px-3 py-2 min-h-[40px] bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs items-center gap-1.5 transition-all active:scale-98 shrink-0 whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Report Lost</span>
          </button>

          {/* User Profile Block */}
          {currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:px-2 sm:py-1.5 min-h-[44px] rounded-2xl border border-amber-900/15 hover:border-[#E06D53]/40 bg-white shadow-xs transition-all text-left"
                aria-label="User Account Menu"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  loading="lazy"
                  className="w-8 h-8 rounded-xl object-cover border border-amber-200"
                />
                <div className="hidden lg:block leading-tight pr-1">
                  <span className="text-xs font-bold text-slate-800 block truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block truncate max-w-[120px]">
                    {currentUser.email}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-amber-900/15 p-2 z-50 animate-fade-in text-xs">
                  <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-amber-900/10 mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={currentUser.avatarUrl}
                        alt={currentUser.name}
                        loading="lazy"
                        className="w-9 h-9 rounded-xl object-cover border border-amber-200"
                      />
                      <div className="overflow-hidden">
                        <p className="font-bold text-slate-900 text-xs truncate">
                          {currentUser.name}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate flex items-center gap-1">
                          <Mail className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span className="truncate">{currentUser.email}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-0.5 text-slate-700 font-medium">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenProfileModal('pets');
                      }}
                      className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <PawPrint className="w-4 h-4 text-[#E06D53]" />
                      <span>My Lost Pet Posts</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenProfileModal('sightings');
                      }}
                      className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-[#7DA18B]" />
                      <span>My Reported Sightings</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onOpenProfileModal('settings');
                      }}
                      className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-xl hover:bg-slate-100 flex items-center gap-2 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Account Settings</span>
                    </button>

                    {onOpenModerationModal && (
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          onOpenModerationModal();
                        }}
                        className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-xl hover:bg-rose-50 text-rose-700 flex items-center justify-between transition-colors font-semibold"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-rose-600" />
                          <span>Volunteer Moderation</span>
                        </span>
                        {activeFlagsCount > 0 && (
                          <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                            {activeFlagsCount}
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 my-1.5" />

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2.5 min-h-[44px] rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login', 'Please sign in to access community lost pet tools.')}
              className="px-3 sm:px-3.5 py-2 min-h-[44px] bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#E06D53]" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsMobileDrawerOpen((prev) => !prev)}
            className="md:hidden p-2.5 min-h-[44px] min-w-[44px] rounded-xl border border-amber-900/15 hover:bg-amber-50 active:bg-amber-100 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Toggle Navigation Menu"
            aria-expanded={isMobileDrawerOpen}
          >
            {isMobileDrawerOpen ? (
              <X className="w-5 h-5 text-slate-800" />
            ) : (
              <Menu className="w-5 h-5 text-slate-800" />
            )}
          </button>
        </div>
      </div>

      {/* Accessible Slide-Out Mobile Navigation Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileDrawerOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="relative ml-auto w-full max-w-xs bg-[#FDFBF7] h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto z-50 border-l border-amber-900/15 animate-in slide-in-from-right duration-250">
            <div className="space-y-5">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-4">
                <div className="flex items-center gap-2">
                  <DetectiveWhiskers size="sm" mood="detecting" />
                  <span className="font-extrabold text-lg font-display text-slate-900">
                    FUR<span className="text-[#E06D53]">TRACE</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2.5 min-h-[48px] min-w-[48px] rounded-xl hover:bg-amber-100/60 active:bg-amber-200/60 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Actions in Mobile Drawer */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenReportModal();
                  }}
                  className="py-3 px-2 min-h-[48px] bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-xl shadow-xs flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Report Spot</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    onOpenLostRegisterModal();
                  }}
                  className="py-3 px-2 min-h-[48px] bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs flex flex-col items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Lost Pet</span>
                </button>
              </div>

              {/* View Links */}
              <div className="space-y-1.5 text-sm font-semibold text-slate-700">
                <button
                  type="button"
                  onClick={() => handleMobileNavClick('dashboard')}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                    activeView === 'dashboard'
                      ? 'bg-white text-[#E06D53] shadow-xs font-bold border border-amber-900/10'
                      : 'hover:bg-amber-100/50 active:bg-amber-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#E06D53]" />
                  <span>Match Feed</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMobileNavClick('map')}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                    activeView === 'map'
                      ? 'bg-white text-[#E06D53] shadow-xs font-bold border border-amber-900/10'
                      : 'hover:bg-amber-100/50 active:bg-amber-100'
                  }`}
                >
                  <Compass className="w-4 h-4 text-[#7DA18B]" />
                  <span>Privacy Radar Map</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMobileNavClick('case_studies')}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                    activeView === 'case_studies'
                      ? 'bg-white text-[#E06D53] shadow-xs font-bold border border-amber-900/10'
                      : 'hover:bg-amber-100/50 active:bg-amber-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>1,240+ Reunited Stories</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMobileNavClick('faq')}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                    activeView === 'faq'
                      ? 'bg-white text-[#E06D53] shadow-xs font-bold border border-amber-900/10'
                      : 'hover:bg-amber-100/50 active:bg-amber-100'
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span>Community FAQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleMobileNavClick('reviews')}
                  className={`w-full min-h-[48px] px-3.5 py-3 rounded-xl flex items-center gap-3 transition-colors text-left cursor-pointer ${
                    activeView === 'reviews'
                      ? 'bg-white text-[#E06D53] shadow-xs font-bold border border-amber-900/10'
                      : 'hover:bg-amber-100/50 active:bg-amber-100'
                  }`}
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Volunteer Reviews</span>
                </button>

                {onOpenModerationModal && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      onOpenModerationModal();
                    }}
                    className="w-full min-h-[48px] px-3.5 py-3 rounded-xl flex items-center justify-between text-rose-700 hover:bg-rose-50 transition-colors font-bold text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>Volunteer Moderation</span>
                    </span>
                    {activeFlagsCount > 0 && (
                      <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                        {activeFlagsCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Bottom Drawer Account Profile */}
            <div className="pt-4 border-t border-amber-900/10 mt-4">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-amber-900/10">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      loading="lazy"
                      className="w-9 h-9 rounded-xl object-cover border border-amber-200"
                    />
                    <div className="overflow-hidden">
                      <p className="font-bold text-slate-900 text-xs truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileDrawerOpen(false);
                      logout();
                    }}
                    className="w-full min-h-[48px] py-2.5 px-3 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center justify-center gap-2 border border-rose-200 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    openAuthModal('login', 'Please sign in to access community lost pet tools.');
                  }}
                  className="w-full min-h-[48px] py-3 px-4 bg-[#E06D53] hover:bg-[#c95d45] text-white text-sm font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Create Account</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
