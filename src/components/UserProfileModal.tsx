import React, { useState } from 'react';
import {
  X,
  User as UserIcon,
  PawPrint,
  Camera,
  Settings,
  LogOut,
  Bell,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LostPet, Sighting } from '../types';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'pets' | 'sightings' | 'settings';
  lostPets: LostPet[];
  sightings: Sighting[];
  onSelectPet?: (pet: LostPet) => void;
  onSelectSighting?: (sighting: Sighting) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'pets',
  lostPets,
  sightings
}) => {
  const { currentUser, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'pets' | 'sightings' | 'settings'>(defaultTab);

  const [editName, setEditName] = useState<string>(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState<string>(currentUser?.phone || '');
  const [notifications, setNotifications] = useState<boolean>(currentUser?.notificationsEnabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  React.useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone || '');
      setNotifications(currentUser.notificationsEnabled);
    }
  }, [defaultTab, currentUser, isOpen]);

  if (!isOpen || !currentUser) return null;

  // Filter listings associated with user (or fallback to active demo posts)
  const userLostPets = lostPets.filter(
    p => currentUser.myLostPetIds?.includes(p.id) || p.contactName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  const userSightings = sightings.filter(
    s => currentUser.mySightingIds?.includes(s.id) || s.reporterName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0])
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || currentUser.name,
      phone: editPhone.trim(),
      notificationsEnabled: notifications
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleLogoutClick = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-amber-900/10 max-h-[90vh] flex flex-col my-auto animate-fade-in">
        
        {/* Header Profile Bar */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-amber-900/10">
          <div className="flex items-center gap-3 sm:gap-3.5">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl object-cover border-2 border-[#E06D53] shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
                  {currentUser.name}
                </h3>
                {currentUser.provider === 'google' && (
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200">
                    Google
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 truncate max-w-[180px] sm:max-w-xs">
                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{currentUser.email}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 pt-3 sm:pt-4 border-b border-amber-900/10 pb-3 text-xs font-bold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('pets')}
            className={`px-3.5 py-2 min-h-[40px] rounded-xl flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'pets'
                ? 'bg-[#E06D53] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <PawPrint className="w-3.5 h-3.5" />
            <span>My Lost Pets ({userLostPets.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('sightings')}
            className={`px-3.5 py-2 min-h-[40px] rounded-xl flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'sightings'
                ? 'bg-[#E06D53] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>My Sightings ({userSightings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 min-h-[40px] rounded-xl flex items-center gap-1.5 transition-all shrink-0 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-[#E06D53] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {/* TAB 1: My Lost Pet Posts */}
          {activeTab === 'pets' && (
            <div className="space-y-3">
              {userLostPets.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <PawPrint className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">No active lost pet listings</h4>
                  <p className="text-xs text-slate-500">
                    You have not registered any missing pet profiles under this account.
                  </p>
                </div>
              ) : (
                userLostPets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-[#FDFBF7] p-4 rounded-2xl border border-amber-900/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={pet.photoUrl}
                        alt={pet.name}
                        className="w-14 h-14 rounded-xl object-cover border border-amber-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-slate-900 text-sm font-display">{pet.name}</h4>
                          <span className="bg-amber-100 text-[#E06D53] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            {pet.species} • {pet.breed}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Last seen: {pet.lastSeenAddress}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Reported on {pet.lastSeenDate}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-800 text-[11px] font-bold rounded-lg">
                        {pet.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: My Reported Sightings */}
          {activeTab === 'sightings' && (
            <div className="space-y-3">
              {userSightings.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
                  <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">No sightings reported yet</h4>
                  <p className="text-xs text-slate-500">
                    Sightings you photograph and submit to the neighborhood watch will appear here.
                  </p>
                </div>
              ) : (
                userSightings.map((sighting) => (
                  <div
                    key={sighting.id}
                    className="bg-[#FDFBF7] p-4 rounded-2xl border border-amber-900/10 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sighting.photoUrl}
                        alt="Sighting observation"
                        className="w-14 h-14 rounded-xl object-cover border border-amber-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-xs">
                            {sighting.species} Spotted
                          </h4>
                          <span className="bg-[#7DA18B]/15 text-[#7DA18B] text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Privacy Masked Zone
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {sighting.spottedAddress}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Reported {sighting.spottedAt}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="text-xs text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        Active on Map
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: Account Settings */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              {savedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-xs text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Your account settings have been saved.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Display Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E06D53]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email Address (Read Only)</label>
                  <input
                    type="email"
                    value={currentUser.email}
                    disabled
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Contact Phone (Protected)</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+63 9XX XXX XXXX"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#E06D53]"
                  />
                  <p className="text-[10px] text-slate-400">
                    Phone numbers are masked and only revealed to verified matching owners.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Account Member Since</label>
                  <input
                    type="text"
                    value={currentUser.createdAt}
                    disabled
                    className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-amber-900/10">
                <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="rounded text-[#E06D53] focus:ring-[#E06D53]"
                  />
                  <div>
                    <span className="font-bold block">Instant Match Notifications</span>
                    <span className="text-[11px] text-slate-500">
                      Receive email alerts whenever a sighting scores above 80% visual correlation.
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold text-xs rounded-xl shadow-xs transition-transform active:scale-98"
                >
                  Save Account Changes
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer with Sign Out */}
        <div className="pt-4 border-t border-amber-900/10 flex items-center justify-between">
          <button
            onClick={handleLogoutClick}
            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
