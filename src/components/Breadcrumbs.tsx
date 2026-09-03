import React from 'react';
import { ChevronRight, Home, MapPin, Sparkles, BookOpen, HelpCircle, FileText } from 'lucide-react';

export type AppBreadcrumbView = 'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews' | 'privacy' | 'terms' | '404';

interface BreadcrumbsProps {
  currentView: AppBreadcrumbView;
  subItem?: string;
  onSelectView: (view: 'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews') => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  currentView,
  subItem,
  onSelectView
}) => {
  const getViewLabel = (view: AppBreadcrumbView) => {
    switch (view) {
      case 'dashboard':
        return 'Match Feed';
      case 'map':
        return 'Privacy Radar Map';
      case 'case_studies':
        return 'Reunion Case Studies';
      case 'faq':
        return 'Community FAQ';
      case 'reviews':
        return 'Verified Reviews';
      case 'privacy':
        return 'Privacy Policy';
      case 'terms':
        return 'Terms of Service';
      case '404':
        return 'Page Not Found';
      default:
        return 'Feed';
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs text-slate-500 font-medium py-2 px-1 mb-3 overflow-x-auto whitespace-nowrap"
    >
      <button
        onClick={() => onSelectView('dashboard')}
        className="flex items-center gap-1 text-slate-600 hover:text-[#E06D53] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />

      {currentView === 'dashboard' && !subItem ? (
        <span className="font-bold text-slate-900 bg-amber-100/60 px-2 py-0.5 rounded text-[11px]">
          Community Match Feed
        </span>
      ) : (
        <button
          onClick={() => {
            if (['dashboard', 'map', 'case_studies', 'faq', 'reviews'].includes(currentView)) {
              onSelectView(currentView as 'dashboard' | 'map' | 'case_studies' | 'faq' | 'reviews');
            }
          }}
          className={`hover:text-[#E06D53] transition-colors ${
            !subItem ? 'font-bold text-slate-900 bg-amber-100/60 px-2 py-0.5 rounded text-[11px]' : 'text-slate-600'
          }`}
        >
          {getViewLabel(currentView)}
        </button>
      )}

      {subItem && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-900 bg-amber-100/60 px-2 py-0.5 rounded text-[11px] truncate max-w-[200px]">
            {subItem}
          </span>
        </>
      )}
    </nav>
  );
};
