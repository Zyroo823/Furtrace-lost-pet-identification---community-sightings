import React, { useState, useEffect } from 'react';
import { LostPet, Sighting, PetMatch, MatchStatus, FlagReport } from './types';
import {
  INITIAL_LOST_PETS,
  INITIAL_SIGHTINGS,
  INITIAL_MATCHES
} from './data/mockPets';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { MatchDashboard } from './components/MatchDashboard';
import { SightingsMap } from './components/SightingsMap';
import { MatchComparisonModal } from './components/MatchComparisonModal';
import { SightingReportModal } from './components/SightingReportModal';
import { LostPetRegisterModal } from './components/LostPetRegisterModal';
import { SecureMessageModal } from './components/SecureMessageModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { LegalModal } from './components/LegalModal';
import { CookieBanner } from './components/CookieBanner';
import { Breadcrumbs } from './components/Breadcrumbs';
import { ThankYouModal } from './components/ThankYouModal';
import { NotFoundPage } from './components/NotFoundPage';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { FAQSection } from './components/FAQSection';
import { ReviewsSection } from './components/ReviewsSection';
import { DirectionsSection } from './components/DirectionsSection';
import { StickyMobileCTA } from './components/StickyMobileCTA';
import { FlagReportModal } from './components/FlagReportModal';
import { ModerationPanelModal } from './components/ModerationPanelModal';
import { syncService } from './lib/syncService';

const INITIAL_FLAG_REPORTS: FlagReport[] = [
  {
    id: 'rep-1',
    targetId: 'sight-2',
    targetType: 'sighting',
    targetTitle: 'Sighting #SIGHT-2 (Aspin mix spotted in Pusok)',
    reason: 'fake_location',
    explanation: 'The photo location looks like Gun-ob near the public market, not Pusok barangay road.',
    reporterUserId: 'usr-vol-4',
    reporterName: 'Barangay Watcher Maria',
    timestamp: '1 hour ago',
    status: 'pending'
  }
];

function AppContent() {
  const { currentUser, isAuthModalOpen, closeAuthModal, openAuthModal, requireAuth } = useAuth();

  const [activeView, setActiveView] = useState<
    'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews' | '404'
  >('dashboard');
  const [lostPets, setLostPets] = useState<LostPet[]>(() => syncService.getLostPets());
  const [sightings, setSightings] = useState<Sighting[]>(() => syncService.getSightings());
  const [matches, setMatches] = useState<PetMatch[]>(INITIAL_MATCHES);

  // Subscribe to real-time cross-tab and cross-user sync
  useEffect(() => {
    // Initial fetch of remote database sightings
    syncService.fetchRemoteSightings().then((remoteSightings) => {
      if (remoteSightings && remoteSightings.length > 0) {
        setSightings(remoteSightings);
      }
    });

    const unsubscribe = syncService.subscribe((event) => {
      if (event.type === 'SIGHTING_ADDED' && event.data) {
        setSightings((prev) => {
          if (prev.some((s) => s.id === event.data.id)) return prev;
          return [event.data, ...prev];
        });
      } else if (event.type === 'LOST_PET_ADDED' && event.data) {
        setLostPets((prev) => {
          if (prev.some((p) => p.id === event.data.id)) return prev;
          return [event.data, ...prev];
        });
      } else if (event.type === 'STORE_RESET') {
        setSightings(INITIAL_SIGHTINGS);
        setLostPets(INITIAL_LOST_PETS);
      }
    });

    return () => unsubscribe();
  }, []);

  // Community Defenses & Moderation state
  const [flagReports, setFlagReports] = useState<FlagReport[]>(INITIAL_FLAG_REPORTS);
  const [isModerationPanelOpen, setIsModerationPanelOpen] = useState<boolean>(false);
  const [activeFlagModal, setActiveFlagModal] = useState<{
    isOpen: boolean;
    targetId: string;
    targetType: 'sighting' | 'lost_pet' | 'match';
    targetTitle: string;
  }>({
    isOpen: false,
    targetId: '',
    targetType: 'sighting',
    targetTitle: ''
  });

  // Modals state
  const [selectedMatch, setSelectedMatch] = useState<PetMatch | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isLostRegisterOpen, setIsLostRegisterOpen] = useState<boolean>(false);
  const [isSecureChatOpen, setIsSecureChatOpen] = useState<boolean>(false);
  const [chatMatchTarget, setChatMatchTarget] = useState<PetMatch | null>(null);

  // Post-submission confirmation modal (Thank You Page)
  const [thankYouData, setThankYouData] = useState<{
    isOpen: boolean;
    type: 'sighting' | 'lost_pet';
    title: string;
    referenceId: string;
    species?: string;
    location?: string;
  } | null>(null);

  // Profile & Legal modals
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [profileDefaultTab, setProfileDefaultTab] = useState<'pets' | 'sightings' | 'settings'>('pets');
  const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

  // Dynamic document title update (Component 11)
  React.useEffect(() => {
    switch (activeView) {
      case 'dashboard':
        document.title = 'Community Match Feed — FURTRACE';
        break;
      case 'map':
        document.title = 'Privacy Radar Map — FURTRACE';
        break;
      case 'case_studies':
        document.title = 'Reunion Case Studies & Success Stories — FURTRACE';
        break;
      case 'faq':
        document.title = 'Frequently Asked Questions — FURTRACE';
        break;
      case 'reviews':
        document.title = 'Verified Community Reviews & Ratings — FURTRACE';
        break;
      case '404':
        document.title = 'Page Not Found — FURTRACE';
        break;
      default:
        document.title = 'FURTRACE — Lost Pet Identification & Community Sightings';
    }
  }, [activeView]);

  // Navigation handler
  const handleSelectView = (
    view: 'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews' | '404'
  ) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReportModal = () => {
    requireAuth(() => setIsReportOpen(true), 'Sign in to report a pet sighting.');
  };

  const handleOpenLostRegisterModal = () => {
    requireAuth(() => setIsLostRegisterOpen(true), 'Sign in to register your lost pet profile.');
  };

  const handleOpenMatch = (match: PetMatch) => {
    requireAuth(() => {
      setSelectedMatch(match);
      setIsComparisonOpen(true);
    }, 'Sign in to inspect match comparisons.');
  };

  const handleUpdateMatchStatus = (matchId: string, status: MatchStatus) => {
    requireAuth(() => {
      setMatches(prev =>
        prev.map(m => (m.id === matchId ? { ...m, status } : m))
      );
      if (selectedMatch && selectedMatch.id === matchId) {
        setSelectedMatch(prev => (prev ? { ...prev, status } : null));
      }
    }, 'Sign in to verify or resolve pet matches.');
  };

  const handleAddNewSighting = (newSighting: Sighting) => {
    const updated = [newSighting, ...sightings.filter(s => s.id !== newSighting.id)];
    setSightings(updated);
    syncService.saveSighting(newSighting, updated);

    // Create simulated match against top eligible pet
    const matchingPet = lostPets.find(p => p.species === newSighting.species) || lostPets[0];
    if (matchingPet) {
      const newMatch: PetMatch = {
        id: `match-${Math.floor(100 + Math.random() * 900)}`,
        lostPetId: matchingPet.id,
        sightingId: newSighting.id,
        overallScore: Math.floor(84 + Math.random() * 12),
        facialGeometryScore: Math.floor(86 + Math.random() * 10),
        colorHistogramScore: Math.floor(82 + Math.random() * 12),
        markingPatternScore: Math.floor(85 + Math.random() * 11),
        distanceKm: Number((0.2 + Math.random() * 1.2).toFixed(2)),
        status: 'Pending',
        createdAt: 'Just now',
        aiAnalysisNotes: `High visual alignment detected with ${matchingPet.name}'s coat and facial structure.`,
        keypoints: [
          {
            id: `kp-new-1`,
            name: 'Facial Crest Alignment',
            confidence: 0.94,
            description: 'Facial landmark vectors show 94% correlation across nose and orbital ridges.',
            petCoord: { x: 50, y: 35 },
            sightingCoord: { x: 50, y: 36 },
            category: 'facial'
          },
          {
            id: `kp-new-2`,
            name: 'Primary Coat Pattern',
            confidence: 0.92,
            description: 'Color histogram matches primary fur markings within low variance.',
            petCoord: { x: 50, y: 65 },
            sightingCoord: { x: 50, y: 68 },
            category: 'marking'
          }
        ]
      };
      setMatches(prev => [newMatch, ...prev]);
    }
    // Trigger Thank You modal (Component 4)
    setThankYouData({
      isOpen: true,
      type: 'sighting',
      title: 'Community Sighting',
      referenceId: newSighting.id.toUpperCase(),
      species: newSighting.species,
      location: newSighting.spottedAddress
    });
  };

  const handleRegisterLostPet = (newPet: LostPet) => {
    const updated = [newPet, ...lostPets.filter(p => p.id !== newPet.id)];
    setLostPets(updated);
    syncService.saveLostPet(newPet, updated);

    // Trigger Thank You modal (Component 4)
    setThankYouData({
      isOpen: true,
      type: 'lost_pet',
      title: newPet.name,
      referenceId: newPet.id.toUpperCase(),
      species: newPet.species,
      location: newPet.lastSeenAddress
    });
  };

  const handleOpenSecureContact = (match: PetMatch) => {
    requireAuth(() => {
      setChatMatchTarget(match);
      setIsSecureChatOpen(true);
    }, 'Sign in to initiate a direct contact message with pet finders.');
  };

  const handleOpenProfileModal = (tab: 'pets' | 'sightings' | 'settings') => {
    requireAuth(() => {
      setProfileDefaultTab(tab);
      setIsProfileOpen(true);
    }, 'Sign in to access your profile and saved records.');
  };

  // Community Defenses: Flagging and Moderation Handlers
  const handleOpenFlagModal = (
    targetId: string,
    targetType: 'sighting' | 'lost_pet' | 'match',
    targetTitle: string
  ) => {
    requireAuth(() => {
      setActiveFlagModal({
        isOpen: true,
        targetId,
        targetType,
        targetTitle
      });
    }, 'Sign in to submit a community flag report.');
  };

  const handleSubmitFlagReport = (newReport: Omit<FlagReport, 'id' | 'timestamp' | 'status'>) => {
    const report: FlagReport = {
      ...newReport,
      id: `rep-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      status: 'pending'
    };

    setFlagReports(prev => [report, ...prev]);

    // Update flagsCount on sighting or pet
    if (newReport.targetType === 'sighting') {
      setSightings(prev =>
        prev.map(s => {
          if (s.id === newReport.targetId) {
            const nextCount = (s.flagsCount || 0) + 1;
            return {
              ...s,
              flagsCount: nextCount,
              moderationStatus: nextCount >= 3 ? 'hidden' : s.moderationStatus || 'flagged'
            };
          }
          return s;
        })
      );
    } else if (newReport.targetType === 'lost_pet') {
      setLostPets(prev =>
        prev.map(p => {
          if (p.id === newReport.targetId) {
            const nextCount = (p.flagsCount || 0) + 1;
            return {
              ...p,
              flagsCount: nextCount,
              moderationStatus: nextCount >= 3 ? 'hidden' : p.moderationStatus || 'flagged'
            };
          }
          return p;
        })
      );
    }
  };

  const handleApproveFlaggedPost = (reportId: string, targetId: string) => {
    setFlagReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'approved' } : r))
    );
    setSightings(prev =>
      prev.map(s => (s.id === targetId ? { ...s, moderationStatus: 'approved', flagsCount: 0 } : s))
    );
    setLostPets(prev =>
      prev.map(p => (p.id === targetId ? { ...p, moderationStatus: 'approved', flagsCount: 0 } : p))
    );
  };

  const handleRemoveFlaggedPost = (reportId: string, targetId: string) => {
    setFlagReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'removed' } : r))
    );
    // Remove matches associated with removed target
    setMatches(prev => prev.filter(m => m.sightingId !== targetId && m.lostPetId !== targetId));
    setSightings(prev => prev.filter(s => s.id !== targetId));
    setLostPets(prev => prev.filter(p => p.id !== targetId));
  };

  const handleDismissFlagReport = (reportId: string) => {
    setFlagReports(prev =>
      prev.map(r => (r.id === reportId ? { ...r, status: 'dismissed' } : r))
    );
  };

  const pendingFlagsCount = flagReports.filter(r => r.status === 'pending').length;

  const activeLostPet = selectedMatch
    ? lostPets.find(p => p.id === selectedMatch.lostPetId) || lostPets[0]
    : lostPets[0];

  const activeSighting = selectedMatch
    ? sightings.find(s => s.id === selectedMatch.sightingId) || sightings[0]
    : sightings[0];

  const chatLostPet = chatMatchTarget
    ? lostPets.find(p => p.id === chatMatchTarget.lostPetId) || null
    : null;

  const chatSighting = chatMatchTarget
    ? sightings.find(s => s.id === chatMatchTarget.sightingId) || null
    : null;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1E293B] flex flex-col font-sans pb-24 md:pb-0 overflow-x-hidden w-full max-w-full">
      {/* Top Navigation */}
      <Navbar
        activeView={activeView}
        onSelectView={handleSelectView}
        onOpenReportModal={handleOpenReportModal}
        onOpenLostRegisterModal={handleOpenLostRegisterModal}
        onOpenProfileModal={handleOpenProfileModal}
        onOpenModerationModal={() => setIsModerationPanelOpen(true)}
        activeFlagsCount={pendingFlagsCount}
      />

      {/* Hero Welcome Banner */}
      <LandingHero
        onOpenReportModal={handleOpenReportModal}
        onOpenLostRegisterModal={handleOpenLostRegisterModal}
        onViewMap={() => handleSelectView('map')}
        onSelectView={handleSelectView}
      />

      {/* Breadcrumb Trail (Component 5) */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <Breadcrumbs
          currentView={activeView}
          onSelectView={handleSelectView}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-20 md:pb-4 relative">
        
        {/* View 1: Custom 404 Page (Component 1) */}
        {activeView === '404' && (
          <NotFoundPage
            onGoHome={() => handleSelectView('dashboard')}
            onOpenReportModal={handleOpenReportModal}
            onOpenLostRegisterModal={handleOpenLostRegisterModal}
          />
        )}

        {/* View 2: Dedicated Case Studies Page (Component 6) */}
        {activeView === 'case_studies' && (
          <CaseStudiesSection
            onOpenReportModal={handleOpenReportModal}
            onOpenLostRegisterModal={handleOpenLostRegisterModal}
          />
        )}

        {/* View 3: Dedicated Community FAQs Page (Component 7) */}
        {activeView === 'faq' && (
          <FAQSection
            onOpenReportModal={handleOpenReportModal}
            onOpenLostRegisterModal={handleOpenLostRegisterModal}
          />
        )}

        {/* View 4: Dedicated Verified Reviews Page (Component 15) */}
        {activeView === 'reviews' && (
          <ReviewsSection
            onOpenReportModal={handleOpenReportModal}
            onOpenLostRegisterModal={handleOpenLostRegisterModal}
          />
        )}

        {/* View 5 & 6: Live Dashboard & Privacy Map */}
        {activeView === 'dashboard' && (
          <MatchDashboard
            matches={matches}
            lostPets={lostPets}
            sightings={sightings}
            onSelectMatch={handleOpenMatch}
            onOpenReportModal={handleOpenReportModal}
            onOpenLostRegisterModal={handleOpenLostRegisterModal}
            onUpdateMatchStatus={handleUpdateMatchStatus}
            onOpenFlagModal={handleOpenFlagModal}
            onOpenModerationPanel={() => setIsModerationPanelOpen(true)}
            activeFlagsCount={pendingFlagsCount}
          />
        )}

        {activeView === 'map' && (
          <SightingsMap
            lostPets={lostPets}
            sightings={sightings}
            matches={matches}
            onSelectMatch={handleOpenMatch}
            onOpenReportModal={handleOpenReportModal}
          />
        )}

        {/* Public Community Sections (Shown on Dashboard Home) */}
        {activeView === 'dashboard' && (
          <div className="mt-16 space-y-12 border-t border-amber-900/10 pt-10">
            <CaseStudiesSection
              onOpenReportModal={handleOpenReportModal}
              onOpenLostRegisterModal={handleOpenLostRegisterModal}
            />

            <ReviewsSection
              onOpenReportModal={handleOpenReportModal}
              onOpenLostRegisterModal={handleOpenLostRegisterModal}
            />

            <DirectionsSection
              onOpenReportModal={handleOpenReportModal}
              onOpenLostRegisterModal={handleOpenLostRegisterModal}
            />

            <FAQSection
              onOpenReportModal={handleOpenReportModal}
              onOpenLostRegisterModal={handleOpenLostRegisterModal}
            />
          </div>
        )}
      </main>

      {/* Persistent Sticky Mobile CTA (Component 9) */}
      <StickyMobileCTA
        onOpenReportModal={handleOpenReportModal}
        onOpenLostRegisterModal={handleOpenLostRegisterModal}
        onSelectView={(v) => handleSelectView(v)}
        activeView={activeView}
      />

      {/* Clean Consumer Footer */}
      <footer className="bg-white border-t border-amber-900/10 pt-10 pb-24 md:pb-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-base font-display">
                FUR<span className="text-[#E06D53]">TRACE</span>
              </span>
              <span>• Lost Pet Identification & Community Sightings Platform.</span>
            </div>

            {/* Internal Page Links (Component 3) */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-slate-600 font-medium">
              <button
                onClick={() => handleSelectView('dashboard')}
                className="hover:text-[#E06D53] transition-colors"
              >
                Match Feed
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectView('map')}
                className="hover:text-[#E06D53] transition-colors"
              >
                Privacy Map
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectView('case_studies')}
                className="hover:text-[#E06D53] transition-colors"
              >
                Success Stories
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectView('reviews')}
                className="hover:text-[#E06D53] transition-colors"
              >
                Reviews
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectView('faq')}
                className="hover:text-[#E06D53] transition-colors"
              >
                FAQ
              </button>
              <span>•</span>
              <button
                onClick={() => handleSelectView('404')}
                className="hover:text-[#E06D53] transition-colors text-slate-400"
              >
                404 Preview
              </button>
            </div>
          </div>

          {/* Legal Compliance Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setLegalModalType('terms')}
                className="hover:text-[#E06D53] transition-colors underline"
              >
                Terms of Service
              </button>
              <span>•</span>
              <button
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-[#E06D53] transition-colors underline"
              >
                Privacy Policy (GDPR / CCPA)
              </button>
            </div>
            <span>© 2026 FURTRACE Community Watch. 100% Free Neighborhood Platform.</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      {selectedMatch && (
        <MatchComparisonModal
          match={selectedMatch}
          lostPet={activeLostPet}
          sighting={activeSighting}
          isOpen={isComparisonOpen}
          onClose={() => setIsComparisonOpen(false)}
          onUpdateStatus={handleUpdateMatchStatus}
          onOpenSecureContact={handleOpenSecureContact}
          onOpenFlagModal={handleOpenFlagModal}
        />
      )}

      <SightingReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmitSighting={handleAddNewSighting}
      />

      <LostPetRegisterModal
        isOpen={isLostRegisterOpen}
        onClose={() => setIsLostRegisterOpen(false)}
        onRegisterPet={handleRegisterLostPet}
      />

      <SecureMessageModal
        match={chatMatchTarget}
        lostPet={chatLostPet}
        sighting={chatSighting}
        isOpen={isSecureChatOpen}
        onClose={() => setIsSecureChatOpen(false)}
      />

      {/* Flag / Misinformation Report Modal */}
      <FlagReportModal
        isOpen={activeFlagModal.isOpen}
        onClose={() => setActiveFlagModal(prev => ({ ...prev, isOpen: false }))}
        targetId={activeFlagModal.targetId}
        targetType={activeFlagModal.targetType}
        targetTitle={activeFlagModal.targetTitle}
        onSubmitReport={handleSubmitFlagReport}
      />

      {/* Volunteer Community Moderation Panel */}
      <ModerationPanelModal
        isOpen={isModerationPanelOpen}
        onClose={() => setIsModerationPanelOpen(false)}
        reports={flagReports}
        onApprovePost={handleApproveFlaggedPost}
        onRemovePost={handleRemoveFlaggedPost}
        onDismissReport={handleDismissFlagReport}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        defaultTab={profileDefaultTab}
        lostPets={lostPets}
        sightings={sightings}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onOpenLegal={(type) => setLegalModalType(type)}
      />

      {/* Legal Modal (Terms of Service & Privacy Policy) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

      {/* Post-Form Confirmation (Thank You Modal) */}
      {thankYouData && (
        <ThankYouModal
          isOpen={thankYouData.isOpen}
          onClose={() => setThankYouData(null)}
          type={thankYouData.type}
          title={thankYouData.title}
          referenceId={thankYouData.referenceId}
          species={thankYouData.species}
          location={thankYouData.location}
        />
      )}

      {/* GDPR / CCPA Cookie Consent Banner */}
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
