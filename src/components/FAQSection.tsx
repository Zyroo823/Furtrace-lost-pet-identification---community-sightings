import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ShieldCheck, Sparkles, Heart } from 'lucide-react';

interface FAQSectionProps {
  onOpenReportModal?: () => void;
  onOpenLostRegisterModal?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({
  onOpenReportModal,
  onOpenLostRegisterModal
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      question: '1. How does the automated visual image comparison match pets?',
      answer:
        'FURTRACE analyzes photo uploads using structural visual landmarks. It evaluates facial geometry, coat color histograms, and distinctive markings such as ear notches or chest patches. This produces a match confidence score between sightings and registered lost profiles in under three seconds.'
    },
    {
      question: '2. How do you protect my home address and personal privacy?',
      answer:
        'We never publish your exact home address. Community sightings and lost pet reports display safe neighborhood radar zones (e.g., Pusok Sector 4, Basak Corridor) rather than specific street addresses. Direct communications between pet owners and finders take place through secure messaging.'
    },
    {
      question: '3. Is FURTRACE 100% free for pet owners and community volunteers?',
      answer:
        'Yes. FURTRACE is a free community watch initiative designed to assist neighborhood families and rescue volunteers in reuniting missing pets without subscription walls or hidden fees.'
    },
    {
      question: '4. What should I do if I spot a wandering dog or cat on my street?',
      answer:
        'Snap a clear photo from a safe distance without chasing or startling the animal. Click "Report Sighting", select the animal type and neighborhood sector, and submit. The system alerts pet owners whose profiles match the sighting location and appearance.'
    },
    {
      question: '5. How quickly do pet owners receive notifications when a match is found?',
      answer:
        'Our direct response commitment ensures automated matching runs in under three seconds. When a high-confidence match is detected, registered pet owners receive email and dashboard alerts within five to fifteen minutes.'
    }
  ];

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="space-y-6 py-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-[#E06D53] text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Everything You Need to Know About FURTRACE
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Clear answers regarding privacy protection, response times, and photo matching.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIdx === index;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-amber-900/15 shadow-xs overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-bold text-slate-900 text-sm font-display">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#E06D53]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-[#FDFBF7]/50">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clear Next Step CTA */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-6 border border-amber-900/10 text-center space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
          Still have questions or need immediate help finding your pet?
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Start your search now. The community network begins matching photos the moment you submit.
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
