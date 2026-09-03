import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Clock, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

interface DirectionsSectionProps {
  onOpenReportModal?: () => void;
  onOpenLostRegisterModal?: () => void;
}

export const DirectionsSection: React.FC<DirectionsSectionProps> = ({
  onOpenReportModal,
  onOpenLostRegisterModal
}) => {
  const [selectedHub, setSelectedHub] = useState<number>(0);

  const hubs = [
    {
      name: 'Lapu-Lapu City Community Watch Hub',
      address: 'Maximo V. Patalinghug Jr. Ave, Pusok, Lapu-Lapu City',
      hours: 'Open 24/7 for emergency pet drop-off and microchip scans',
      phone: '+63 917 555 8492',
      directions: 'From Marcelo Fernan Bridge, proceed south on ML Quezon National Hwy. Turn right onto Pusok Park road. Entrance is on the left opposite the community hall.',
      transit: 'Jeepney route 23D / O3A stop right in front of the Pusok terminal.'
    },
    {
      name: 'Basak Community Rescue Station',
      address: 'Basak-Kagudoy Road, Sector 3, Lapu-Lapu City',
      hours: 'Mon-Sun: 8:00 AM - 9:00 PM',
      phone: '+63 918 555 3190',
      directions: 'Located 300 meters past the Basak Elementary School campus. Look for the green FURTRACE Community Watch sign.',
      transit: 'Accessible via local tricycle or modern jeepney from Gaisano Grand Mall terminal.'
    }
  ];

  return (
    <section className="space-y-6 py-6 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-[#E06D53] text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
          <Navigation className="w-3.5 h-3.5 text-[#E06D53]" />
          <span>Local Stations & Directions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Community Drop-Off Centers & Volunteer Stations
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Need in-person assistance, microchip scanning, or emergency shelter for a found pet? Visit our verified local desks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white rounded-3xl p-6 border border-amber-900/15 shadow-md">
        {/* Hub Selector and Directions Details */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex gap-2 border-b border-slate-100 pb-3">
            {hubs.map((hub, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedHub(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedHub === idx
                    ? 'bg-[#E06D53] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Station #{idx + 1}
              </button>
            ))}
          </div>

          <div className="space-y-3 text-left">
            <h3 className="text-lg font-bold text-slate-900 font-display">
              {hubs[selectedHub].name}
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E06D53] shrink-0 mt-0.5" />
                <span>{hubs[selectedHub].address}</span>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{hubs[selectedHub].hours}</span>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-[#7DA18B] shrink-0 mt-0.5" />
                <a href={`tel:${hubs[selectedHub].phone}`} className="font-bold text-slate-800 hover:underline">
                  {hubs[selectedHub].phone}
                </a>
              </div>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-2xl border border-amber-900/10 space-y-2 text-xs">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#E06D53]" />
                <span>Driving & Walking Directions:</span>
              </p>
              <p className="text-slate-600 leading-relaxed">
                {hubs[selectedHub].directions}
              </p>
              <p className="text-[11px] text-slate-500 pt-1 border-t border-amber-900/5">
                <strong>Public Transit:</strong> {hubs[selectedHub].transit}
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Map Representation */}
        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex flex-col items-center justify-center p-6 relative min-h-[260px] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md text-[#E06D53] flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {hubs[selectedHub].name}
            </h4>
            <p className="text-[11px] text-slate-500 max-w-xs">
              Coordinates: 10.3157° N, 123.9664° E • Lapu-Lapu Community District
            </p>
          </div>

          <a
            href="https://maps.google.com/?q=Lapu-Lapu+City+Pusok"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Clear Next Step CTA */}
      <div className="bg-amber-50/70 rounded-3xl p-6 border border-amber-900/10 text-center space-y-3">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
          Need immediate community support for your pet?
        </h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Post your missing pet profile or notify neighbors of an animal you observed in your area.
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
