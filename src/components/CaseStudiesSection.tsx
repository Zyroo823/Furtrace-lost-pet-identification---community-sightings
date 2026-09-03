import React from 'react';
import { Heart, Clock, MapPin, CheckCircle2, Shield, ArrowRight } from 'lucide-react';

interface CaseStudiesSectionProps {
  onOpenReportModal: () => void;
  onOpenLostRegisterModal: () => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({
  onOpenReportModal,
  onOpenLostRegisterModal
}) => {
  const caseStudies = [
    {
      id: 'case-01',
      petName: 'Bella',
      species: 'Beagle Dog',
      timeToReunite: '4.2 hours',
      location: 'Pusok Community Park, Lapu-Lapu',
      matchScore: '96%',
      rewardClaimed: 'PHP ₱5,000',
      ownerQuote: 'Bella slipped past our gate during the evening storm. A jogger snapped a quick photo in Pusok. The image recognition alerted us in under 5 minutes!',
      ownerName: 'Maria Santos',
      date: 'August 28, 2026',
      lostPhoto: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&h=300&q=80',
      lostAlt: 'Bella the Beagle sitting on grass wearing collar registered on FURTRACE',
      sightingPhoto: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&h=300&q=80',
      sightingAlt: 'Bella the Beagle spotted by community jogger near park sidewalk'
    },
    {
      id: 'case-02',
      petName: 'Milo',
      species: 'Domestic Calico Cat',
      timeToReunite: '6.5 hours',
      location: 'Basak Subangdaku District',
      matchScore: '94%',
      rewardClaimed: 'PHP ₱3,500',
      ownerQuote: 'Cats are tough to distinguish, but FURTRACE recognized the exact calico markings over Milo’s left ear. We had him home safe before nightfall.',
      ownerName: 'Danilo Reyes',
      date: 'August 14, 2026',
      lostPhoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&h=300&q=80',
      lostAlt: 'Milo the Calico cat looking directly into camera with tri-color fur patterns',
      sightingPhoto: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&h=300&q=80',
      sightingAlt: 'Milo the Calico cat resting on a shaded porch in Basak community sector'
    },
    {
      id: 'case-03',
      petName: 'Kobe',
      species: 'Golden Retriever',
      timeToReunite: '2.8 hours',
      location: 'Mactan Marina Corridor',
      matchScore: '98%',
      rewardClaimed: 'PHP ₱8,000',
      ownerQuote: 'The direct response SLA works. When Kobe wandered towards the marina, two neighborhood volunteers confirmed his location right away.',
      ownerName: 'Elena Gomez',
      date: 'July 30, 2026',
      lostPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&h=300&q=80',
      lostAlt: 'Kobe the Golden Retriever smiling outdoors with bright golden coat',
      sightingPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&h=300&q=80',
      sightingAlt: 'Kobe the Golden Retriever safe beside neighborhood watch volunteer station'
    }
  ];

  return (
    <section className="space-y-6 py-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-emerald-100/80 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          <Heart className="w-3.5 h-3.5 fill-current text-rose-500" />
          <span>Real Reunited Case Studies</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Over 1,240 Pets Reunited With Loving Families
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          See how community photo sightings and automated visual vector comparisons bring lost dogs and cats back home safely.
        </p>
      </div>

      {/* Case Study Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {caseStudies.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 border border-amber-900/15 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
          >
            {/* Image Comparison Snippet */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200">
                  <img
                    src={item.lostPhoto}
                    alt={item.lostAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Lost Profile
                  </span>
                </div>
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 border border-slate-200">
                  <img
                    src={item.sightingPhoto}
                    alt={item.sightingAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute bottom-1.5 left-1.5 bg-emerald-700/90 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    Sighted Spot
                  </span>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 font-display">
                  <span>{item.petName}</span>
                  <span className="text-slate-400 font-normal">• {item.species}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  {item.matchScore} Vector Match
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="bg-[#FDFBF7] p-3 rounded-2xl border border-amber-900/10 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
                  <span>Found in <strong>{item.timeToReunite}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-[#7DA18B] shrink-0" />
                  <span className="truncate">{item.location}</span>
                </div>
              </div>
              <div className="pt-1.5 border-t border-amber-900/10 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Reunion Reward:</span>
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {item.rewardClaimed} Claimed
                </span>
              </div>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-xs text-slate-600 italic border-l-2 border-[#E06D53] pl-3 py-0.5 leading-relaxed">
              &quot;{item.ownerQuote}&quot;
            </blockquote>

            {/* Footer */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <span className="font-bold text-slate-800">{item.ownerName}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA block */}
      <div className="bg-gradient-to-r from-amber-100/70 via-amber-50 to-emerald-50 rounded-3xl p-6 border border-amber-200 text-center space-y-3">
        <h3 className="text-lg font-bold text-slate-900 font-display">
          Have you seen a wandering animal in your neighborhood?
        </h3>
        <p className="text-xs text-slate-600 max-w-xl mx-auto">
          Every quick photo observation gives pet parents real hope. Help a neighbor reunite with their companion today.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-1">
          <button
            onClick={onOpenReportModal}
            className="px-5 py-2.5 bg-[#7DA18B] hover:bg-[#6c8f7a] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-98"
          >
            <span>Report Sighting (Free)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onOpenLostRegisterModal}
            className="px-5 py-2.5 bg-[#E06D53] hover:bg-[#c95d45] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-transform active:scale-98"
          >
            <span>Post Missing Pet Profile</span>
          </button>
        </div>
      </div>
    </section>
  );
};
