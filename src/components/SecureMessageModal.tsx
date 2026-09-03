import React, { useState } from 'react';
import { PetMatch, LostPet, Sighting } from '../types';
import {
  X,
  ShieldCheck,
  Lock,
  Send,
  MapPin,
  CheckCheck,
  AlertTriangle,
  Key
} from 'lucide-react';
import { DetectiveWhiskers } from './DetectiveWhiskers';

interface SecureMessageModalProps {
  match: PetMatch | null;
  lostPet: LostPet | null;
  sighting: Sighting | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SecureMessageModal: React.FC<SecureMessageModalProps> = ({
  match,
  lostPet,
  sighting,
  isOpen,
  onClose
}) => {
  const [messages, setMessages] = useState<Array<{ sender: 'owner' | 'spotter' | 'system'; text: string; time: string }>>([
    {
      sender: 'system',
      text: '🔒 End-to-End Encrypted Tunnel Established. Spotter address is currently obfuscated (300m radius blur zone).',
      time: '08:48 AM'
    },
    {
      sender: 'owner',
      text: 'Hi Alex! I saw your sighting photo #SIGHT-001. That white diamond chest patch looks identical to my missing cat Barnaby!',
      time: '08:50 AM'
    },
    {
      sender: 'spotter',
      text: 'Hello! Yes, he was resting right under the rhododendron bush next to the community library. He seemed in great spirits but was hungry.',
      time: '08:52 AM'
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [isCoordinatesUnlocked, setIsCoordinatesUnlocked] = useState<boolean>(false);

  if (!isOpen || !match || !lostPet || !sighting) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages([
      ...messages,
      {
        sender: 'owner',
        text: inputText.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInputText('');
  };

  const handleUnlockCoordinates = () => {
    setIsCoordinatesUnlocked(true);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'system',
        text: '📍 Spotter unlocked verified GPS coordinates: 37.775812, -122.420641 (Alleyway behind Maplewood Library).',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2.5 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] w-full max-w-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-900/10 overflow-hidden flex flex-col h-[540px] sm:h-[600px] max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 bg-[#7DA18B]/20 text-[#7DA18B] rounded-xl shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-bold text-xs sm:text-sm font-display">
                  Encrypted Channel: {lostPet.name}
                </h3>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> AES-256 E2EE
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-xs">
                Between Verified Owner ({lostPet.contactName}) & Spotter ({sighting.reporterName})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDFBF7]">
          {messages.map((msg, i) => {
            if (msg.sender === 'system') {
              return (
                <div
                  key={i}
                  className="bg-amber-50 border border-amber-200/80 p-2.5 rounded-xl text-[11px] text-amber-900 text-center leading-relaxed"
                >
                  {msg.text}
                </div>
              );
            }

            const isOwner = msg.sender === 'owner';
            return (
              <div
                key={i}
                className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
              >
                <div className="text-[10px] text-slate-400 mb-0.5 px-1">
                  {isOwner ? 'You (Owner)' : `${sighting.reporterName} (Spotter)`} • {msg.time}
                </div>
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    isOwner
                      ? 'bg-[#E06D53] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Safe Meetup Guidance Banner */}
        <div className="bg-white px-3 sm:px-4 py-2 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-600 text-[10px] sm:text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-[#E06D53] shrink-0" />
            <span className="truncate">
              {isCoordinatesUnlocked
                ? 'Exact GPS pin unlocked (37.775812, -122.420641)'
                : 'Public map location is blurred by 300m for privacy.'}
            </span>
          </div>

          {!isCoordinatesUnlocked && (
            <button
              onClick={handleUnlockCoordinates}
              className="px-2.5 py-1.5 min-h-[36px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shrink-0"
            >
              <Key className="w-3 h-3" />
              <span>Unlock Exact GPS Pin</span>
            </button>
          )}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={handleSendMessage}
          className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type encrypted message to spotter..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 min-h-[44px] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E06D53]/20"
          />
          <button
            type="submit"
            className="min-h-[44px] min-w-[44px] bg-[#E06D53] hover:bg-[#c95d45] text-white rounded-xl shadow-xs flex items-center justify-center transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
