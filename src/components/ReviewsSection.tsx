import React from 'react';
import { Star, ShieldCheck, CheckCircle2, Heart } from 'lucide-react';

interface ReviewsSectionProps {
  onOpenReportModal?: () => void;
  onOpenLostRegisterModal?: () => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  onOpenReportModal,
  onOpenLostRegisterModal
}) => {
  const reviews = [
    {
      id: 'rev-1',
      name: 'Gabriel Tan',
      role: 'Pet Parent • Pusok',
      date: 'August 2026',
      rating: 5,
      pet: 'Max (Shih Tzu)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
      text: 'Within two hours of posting Max’s lost photo, someone spotted him near Pusok gym. The side-by-side landmark comparison confirmed his coat markings accurately.'
    },
    {
      id: 'rev-2',
      name: 'Dr. Carmela Santos',
      role: 'Community Veterinarian',
      date: 'August 2026',
      rating: 5,
      pet: 'Volunteer Watch Coordinator',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
      text: 'The privacy radar approach is outstanding. It protects owner privacy while allowing neighborhood residents to check wandering pets against active reports.'
    },
    {
      id: 'rev-3',
      name: 'Michael Bautista',
      role: 'Pet Parent • Basak',
      date: 'July 2026',
      rating: 5,
      pet: 'Ginger (Ginger Tabby)',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
      text: 'Our cat Ginger wandered three blocks away. A neighbor submitted a quick snap, and we received an instant match alert. Highly recommend this platform.'
    }
  ];

  return (
    <section className="space-y-6 py-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-[#E06D53] text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
          <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
          <span>Verified Community Reviews</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Trusted by 4,800+ Neighborhood Guardians
        </h2>
        <div className="flex items-center justify-center gap-1 text-amber-500 text-sm">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
          <span className="text-slate-700 font-bold ml-2 text-xs">4.9 / 5.0 Average Community Rating</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-3xl p-6 border border-amber-900/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed italic">
                &quot;{rev.text}&quot;
              </p>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
              <img
                src={rev.avatar}
                alt={`Photo of ${rev.name}`}
                className="w-10 h-10 rounded-full object-cover border border-amber-200"
              />
              <div className="overflow-hidden leading-tight">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-xs text-slate-900 truncate">
                    {rev.name}
                  </span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                </div>
                <p className="text-[10px] text-slate-400 truncate">{rev.role}</p>
                <p className="text-[10px] text-[#E06D53] font-semibold">{rev.pet}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clear Next Step CTA */}
      <div className="bg-amber-50/80 rounded-3xl p-6 border border-amber-900/10 text-center space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
          Ready to protect your pets or help your neighborhood?
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Post a lost pet report for instant alerts, or report a spotted pet to help a neighbor right now.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          {onOpenLostRegisterModal && (
            <button
              onClick={onOpenLostRegisterModal}
              className="px-5 py-2.5 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-md transition-transform active:scale-98 cursor-pointer"
            >
              Post Lost Pet (Free)
            </button>
          )}
          {onOpenReportModal && (
            <button
              onClick={onOpenReportModal}
              className="px-5 py-2.5 bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-98 cursor-pointer"
            >
              Report Sighting (Spot)
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
