import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, Trash2, CheckCircle2, X, Eye, EyeOff, Flag, ShieldAlert, Sparkles } from 'lucide-react';
import { FlagReport, Sighting, LostPet } from '../types';

interface ModerationPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  flags: FlagReport[];
  sightings: Sighting[];
  lostPets: LostPet[];
  onApprovePost: (targetId: string, targetType: 'sighting' | 'lost_pet') => void;
  onRemovePost: (targetId: string, targetType: 'sighting' | 'lost_pet') => void;
  onDismissFlag: (flagId: string) => void;
}

export const ModerationPanelModal: React.FC<ModerationPanelModalProps> = ({
  isOpen,
  onClose,
  flags,
  sightings,
  lostPets,
  onApprovePost,
  onRemovePost,
  onDismissFlag
}) => {
  const [filter, setFilter] = useState<'all' | 'flagged' | 'hidden'>('all');

  if (!isOpen) return null;

  // Find posts that have flags or are hidden
  const flaggedSightings = sightings.filter(s => (s.flagsCount && s.flagsCount > 0) || s.moderationStatus === 'hidden');
  const flaggedLostPets = lostPets.filter(p => (p.flagsCount && p.flagsCount > 0) || p.moderationStatus === 'hidden');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 border border-amber-900/15 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 sm:pb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-[#E06D53] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                Volunteer Moderation Queue
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Review community flags, troll images, and reports in Lapu-Lapu City
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Defense stats */}
        <div className="grid grid-cols-3 gap-3 my-4 shrink-0">
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-center">
            <span className="text-lg font-black text-[#E06D53] font-display">
              {flags.length}
            </span>
            <p className="text-[10px] text-slate-600 font-medium uppercase">Active Flags</p>
          </div>
          <div className="bg-rose-50 rounded-2xl p-3 border border-rose-200 text-center">
            <span className="text-lg font-black text-rose-600 font-display">
              {flaggedSightings.filter(s => s.moderationStatus === 'hidden').length + flaggedLostPets.filter(p => p.moderationStatus === 'hidden').length}
            </span>
            <p className="text-[10px] text-slate-600 font-medium uppercase">Auto-Hidden Posts</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-center">
            <span className="text-lg font-black text-emerald-700 font-display">
              3 Flags
            </span>
            <p className="text-[10px] text-slate-600 font-medium uppercase">Auto-Hide Threshold</p>
          </div>
        </div>

        {/* Flagged items list */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1 py-1">
          {flags.length === 0 && flaggedSightings.length === 0 && flaggedLostPets.length === 0 ? (
            <div className="text-center py-12 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
              <div>
                <p className="text-sm font-bold text-slate-800">Clean Community Queue</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No active troll images, misinformation flags, or spam reports are currently pending review.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Sightings queue */}
              {flaggedSightings.map((sighting) => (
                <div
                  key={sighting.id}
                  className="bg-white rounded-2xl border border-rose-200 p-4 shadow-xs space-y-3 hover:border-rose-300 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={sighting.photoUrl}
                        alt="Flagged sighting thumbnail"
                        className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Sighting #{sighting.id.toUpperCase()}
                          </span>
                          <span className="text-[10px] bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                            {sighting.flagsCount || 1} Community Flags
                          </span>
                          {sighting.moderationStatus === 'hidden' && (
                            <span className="text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-bold">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">{sighting.species} • {sighting.spottedAddress}</p>
                        <p className="text-[11px] text-slate-500 italic">Reported by: {sighting.reporterName}</p>
                      </div>
                    </div>
                  </div>

                  {sighting.flagReasons && sighting.flagReasons.length > 0 && (
                    <div className="bg-rose-50 p-2 rounded-xl text-[11px] text-rose-800 space-y-1">
                      <span className="font-bold block">Reported Violations:</span>
                      <ul className="list-disc list-inside">
                        {sighting.flagReasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => onApprovePost(sighting.id, 'sighting')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Restore Post</span>
                    </button>
                    <button
                      onClick={() => onRemovePost(sighting.id, 'sighting')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Troll Post</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Individual flag records */}
              {flags.map((flag) => (
                <div
                  key={flag.id}
                  className="bg-[#FDFBF7] rounded-2xl border border-amber-200 p-3.5 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{flag.targetTitle}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono">
                        {flag.reason.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    {flag.details && <p className="text-slate-600 text-[11px]">&quot;{flag.details}&quot;</p>}
                    <span className="text-[10px] text-slate-400">Flagged on {flag.timestamp}</span>
                  </div>

                  <button
                    onClick={() => onDismissFlag(flag.id)}
                    className="px-2.5 py-1 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg font-medium text-[11px]"
                  >
                    Dismiss Flag
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <span>Protected by Lapu-Lapu Community Watch Policy</span>
          <button
            onClick={onClose}
            className="font-bold text-slate-700 hover:text-[#E06D53]"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
