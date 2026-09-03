import React from 'react';
import { Shield, FileText, X, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { LegalModalType } from '../types';

interface LegalModalProps {
  type: LegalModalType;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-amber-900/10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-900/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-amber-100 text-[#E06D53] rounded-2xl">
              {type === 'terms' ? <FileText className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </span>
            <div>
              <h2 className="text-xl font-black text-slate-900 font-display">
                {type === 'terms' ? 'Terms of Service' : 'Privacy & Community Policy'}
              </h2>
              <p className="text-xs text-slate-500">
                Last updated: September 2026 • FURTRACE Community Standards
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto py-5 pr-2 space-y-5 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {type === 'terms' ? (
            <>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">1. Community Mission and Purpose</h3>
                <p>
                  FURTRACE is a free community platform dedicated to safely reuniting missing pets with their families. By creating an account or posting sightings, you agree to submit truthful, non-fraudulent observations to support neighborhood pet recovery.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">2. Safe Image Uploads</h3>
                <p>
                  You agree to upload photographs only of animals spotted in public or authorized locations. You must not upload private property interiors, identifiable bystander faces, or inappropriate content. All uploaded images undergo automated sanitization to remove camera serial identifiers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">3. Neighborhood Privacy and Location</h3>
                <p>
                  To protect community spotters, all public map sightings display an approximate radius zone rather than a precise residential pin. You must not use this service to harass pet owners, stalk community members, or solicit unauthorized fees.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">4. Rejoining Rewards and Claims</h3>
                <p>
                  Reward agreements posted by pet owners are denominated in Philippine Peso (PHP / ₱) and represent direct community matters between registered owners and finders. FURTRACE does not escrow funds or take transaction commissions on pet rewards.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">5. Account Moderation</h3>
                <p>
                  We reserve the right to suspend accounts submitting misleading pet reports, false location claims, or abusive communications.
                </p>
              </section>
            </>
          ) : (
            <>
              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">1. Privacy First Architecture</h3>
                <p>
                  Your privacy is our core design principle. When you report a sighting, your exact GPS coordinates are masked behind an obfuscated 200m to 500m neighborhood radius before being published to the community map.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">2. Information We Collect</h3>
                <ul className="list-disc list-inside space-y-1 pl-1">
                  <li><strong>Account Data:</strong> Name, verified email address, and optional contact phone number.</li>
                  <li><strong>Pet Profiles:</strong> Breed, fur markings, distinct physical characteristics, and last known public location.</li>
                  <li><strong>Sighting Submissions:</strong> Pet photos, timestamp, condition notes, and approximate street landmarks.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">3. Automatic Metadata Scrubbing</h3>
                <p>
                  Before images are stored or matched, camera metadata including device serial numbers, device brands, and embedded hardware identifiers are automatically stripped.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">4. Phone and Contact Masking</h3>
                <p>
                  Contact numbers are protected with masked views to prevent spam scrapers. Only verified matched parties in active recovery cases can request direct contact handshakes.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-bold text-slate-900 text-sm">5. Data Retention and Deletion</h3>
                <p>
                  You can delete your pet listings, sightings, or entire profile at any time through Account Settings. Reunited listings can be archived with a single click.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-amber-900/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#7DA18B] font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Encrypted and Privacy Compliant</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#E06D53] hover:bg-[#c95d45] text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
