import {
  Ticket,
  Calendar,
  MapPin,
  QrCode,
  Trash2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import type { UserTicket } from '../data/eventsData';
import { useToast } from '../context/ToastContext';


interface TicketsPageProps {
  tickets: UserTicket[];
  onRemoveTicket: (ticketId: string) => void;
  onNavigate: (path: string) => void;
}

export default function TicketsPage({
  tickets,
  onRemoveTicket,
  onNavigate,
}: TicketsPageProps) {
  const { showToast } = useToast();

  const handleCopyCode = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      showToast(`Pass code ${code} copied to clipboard!`, 'success');
    } catch {
      showToast(`Pass code: ${code}`, 'info');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#1c1c1c]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
              Verified Wallet
            </span>
            <span className="text-xs text-[#777]">· Digital Access Passes</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
            My Tickets & Passes
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-medium">
            Present your QR pass at the entrance for express guestlist and VIP entry.
          </p>
        </div>

        {tickets.length > 0 && (
          <button
            onClick={() => onNavigate('/events')}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] text-xs font-bold text-purple-300 hover:text-white transition-colors flex items-center gap-2"
          >
            <span>Explore More Events</span>
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* ── EMPTY STATE ── */}
      {tickets.length === 0 ? (
        <div className="bg-[#0e0e0e] border border-[#1e1e1e] rounded-3xl p-10 sm:p-16 flex flex-col items-center justify-center text-center max-w-xl mx-auto my-8 shadow-2xl">
          <div className="w-20 h-20 rounded-3xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-xl shadow-purple-950/30">
            <Ticket size={36} className="rotate-12" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            No tickets yet.
          </h2>
          <p className="text-sm text-[#888] mt-2 max-w-sm leading-relaxed">
            Your next great night is waiting. Browse our curated nightlife events and RSVP for exclusive guestlist passes.
          </p>

          <button
            onClick={() => onNavigate('/events')}
            id="explore-events-empty-btn"
            className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-sm hover:opacity-95 shadow-xl shadow-purple-950/40 flex items-center gap-2 transition-transform hover:scale-105"
          >
            <Sparkles size={16} />
            <span>EXPLORE EVENTS</span>
          </button>
        </div>
      ) : (
        /* ── TICKETS GRID ── */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map(tkt => (
            <div
              key={tkt.id}
              className="bg-[#101010] border border-[#222] hover:border-purple-500/40 rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative overflow-hidden group shadow-xl transition-all"
            >
              {/* Top ambient card glow */}
              <div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #A855F7, transparent 70%)', filter: 'blur(30px)' }}
                aria-hidden="true"
              />

              <div>
                {/* Status Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c] mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-green-400">
                      {tkt.status} PASS
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#666] tracking-widest uppercase">
                    {tkt.id}
                  </span>
                </div>

                {/* Event Name & Info */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-black text-white group-hover:text-purple-300 transition-colors">
                    {tkt.eventTitle}
                  </h3>

                  <div className="flex flex-col gap-1.5 text-xs text-[#999]">
                    <span className="flex items-center gap-2 text-[#CCC] font-semibold">
                      <MapPin size={13} className="text-purple-400 flex-shrink-0" />
                      {tkt.venue}
                    </span>
                    <span className="flex items-center gap-2">
                      <Calendar size={13} className="text-[#666] flex-shrink-0" />
                      {tkt.date} · {tkt.time}
                    </span>
                  </div>
                </div>

                {/* QR Code / Digital Barcode Area */}
                <div className="my-6 p-4 rounded-2xl bg-[#080808] border border-[#1a1a1a] flex items-center justify-between gap-4">
                  {/* Futuristic QR Matrix Placeholder */}
                  <div
                    onClick={() => handleCopyCode(tkt.id)}
                    className="w-20 h-20 rounded-xl bg-gradient-to-br from-purple-950/80 to-black p-2 border border-purple-500/30 flex items-center justify-center relative cursor-pointer hover:border-purple-400 transition-colors group/qr flex-shrink-0"
                    title="Click to copy code"
                  >
                    <QrCode size={48} className="text-purple-300 group-hover/qr:scale-105 transition-transform" />
                    <span className="absolute inset-x-1 bottom-1 bg-black/80 text-[8px] font-mono text-center text-purple-300 rounded">
                      TAP
                    </span>
                  </div>

                  {/* Pass Metadata */}
                  <div className="flex-1 flex flex-col justify-center text-left">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#666]">
                      Tier & Entry
                    </span>
                    <p className="text-xs font-black text-white uppercase tracking-wide mt-0.5">
                      {tkt.ticketType}
                    </p>
                    <p className="text-[10px] text-[#777] mt-1 flex items-center gap-1">
                      <ShieldCheck size={11} className="text-green-400" />
                      Verified on Nubpack Chain
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1c1c1c] text-xs">
                <button
                  type="button"
                  onClick={() => handleCopyCode(tkt.id)}
                  className="text-purple-400 hover:text-purple-300 font-bold transition-colors"
                >
                  Copy Pass ID
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onRemoveTicket(tkt.id);
                    showToast(`Pass for ${tkt.eventTitle} cancelled.`, 'info');
                  }}
                  className="text-[#666] hover:text-red-400 transition-colors flex items-center gap-1 text-[11px] font-medium"
                  title="Cancel this pass"
                >
                  <Trash2 size={12} />
                  <span>Release Pass</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
