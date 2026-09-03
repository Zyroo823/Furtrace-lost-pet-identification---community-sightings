import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, X, Flag, HelpCircle } from 'lucide-react';
import { FlagReport } from '../types';

interface FlagReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetType: 'sighting' | 'lost_pet' | 'match';
  targetTitle: string;
  onSubmitFlag: (report: Omit<FlagReport, 'id' | 'timestamp'>) => void;
}

export const FlagReportModal: React.FC<FlagReportModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetType,
  targetTitle,
  onSubmitFlag
}) => {
  const [reason, setReason] = useState<FlagReport['reason']>('troll_image');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFlag({
      targetId,
      targetType,
      targetTitle,
      reason,
      details,
      reporterName: 'Neighborhood Guardian'
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 border border-amber-900/15 shadow-2xl relative overflow-hidden space-y-4 my-auto">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 min-h-[44px] min-w-[44px] rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">
              Report Submitted for Review
            </h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Our volunteer moderation panel reviews flagged content. If three community members report this post, it will be automatically hidden.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Report Misinformation or Troll Post
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[240px]">
                  Target: {targetTitle}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Select Violation Reason:
              </label>
              
              <div className="space-y-2 text-xs">
                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  reason === 'troll_image'
                    ? 'border-rose-300 bg-rose-50/70 text-rose-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === 'troll_image'}
                    onChange={() => setReason('troll_image')}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="font-bold block">Troll, Meme, or Non-Pet Image</span>
                    <span className="text-[11px] text-slate-500">
                      Photo contains internet memes, non-animal objects, or fake graphics.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  reason === 'fake_location'
                    ? 'border-rose-300 bg-rose-50/70 text-rose-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === 'fake_location'}
                    onChange={() => setReason('fake_location')}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="font-bold block">Fake or Inaccurate Location</span>
                    <span className="text-[11px] text-slate-500">
                      Address is staged, out of Lapu-Lapu City, or clearly incorrect.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  reason === 'misinformation'
                    ? 'border-rose-300 bg-rose-50/70 text-rose-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === 'misinformation'}
                    onChange={() => setReason('misinformation')}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="font-bold block">Misinformation / Duplicate Hoax</span>
                    <span className="text-[11px] text-slate-500">
                      Fabricated lost status or misleading description.
                    </span>
                  </div>
                </label>

                <label className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  reason === 'spam'
                    ? 'border-rose-300 bg-rose-50/70 text-rose-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="reason"
                    checked={reason === 'spam'}
                    onChange={() => setReason('spam')}
                    className="mt-0.5 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <span className="font-bold block">Commercial Spam or Solicitation</span>
                    <span className="text-[11px] text-slate-500">
                      Promotional advertisements or unrelated links.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Additional Notes (Optional):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="Briefly describe why this post violates community guidelines..."
                className="w-full text-xs p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
              />
            </div>

            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Auto-Defense Rule:</strong> Posts with 3+ reports are hidden instantly to prevent harm.
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Submit Flag</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
