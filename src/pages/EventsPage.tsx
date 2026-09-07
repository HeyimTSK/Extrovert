import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  X,
  Sparkles,
} from 'lucide-react';
import { MOCK_EVENTS } from '../data/eventsData';
import type { EventItem } from '../data/eventsData';
import { useToast } from '../context/ToastContext';


interface EventsPageProps {
  userTickets: string[]; // event IDs the user has tickets for
  onTicketObtained: (event: EventItem) => void;
  onNavigate: (path: string) => void;
}

export default function EventsPage({
  userTickets,
  onTicketObtained,
  onNavigate,
}: EventsPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Trending' | 'Tonight' | 'This Week'>('All');
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const { showToast } = useToast();

  const filteredEvents = selectedCategory === 'All'
    ? MOCK_EVENTS
    : MOCK_EVENTS.filter(e => e.category === selectedCategory || (selectedCategory === 'Trending' && e.hot));

  const handleGetTicket = (event: EventItem) => {
    onTicketObtained(event);
    showToast('Ticket added successfully!', 'success');
  };

  return (
    <div className="flex flex-col gap-8">
      {/* ── HEADER BANNER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[#1c1c1c]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
              Live Nightlife Radar
            </span>
            <span className="text-xs text-[#777]">· Curated for Extroverts</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
            Upcoming Events
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-medium">
            Explore underground techno, rooftop raves, and private member sessions.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(['All', 'Trending', 'Tonight', 'This Week'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              id={`events-filter-${cat.toLowerCase().replace(' ', '-')}-btn`}
              className={`
                px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all whitespace-nowrap
                ${selectedCategory === cat
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-lg shadow-purple-900/30'
                  : 'bg-[#121212] border border-[#222] text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── EVENT CARDS GRID (1 Col Mobile, 2 Col Tablet, 2–3 Col Desktop) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const hasTicket = userTickets.includes(String(event.id));
          return (
            <div
              key={event.id}
              onClick={() => setActiveModalEvent(event)}
              className="bg-[#101010] border border-[#1e1e1e] hover:border-[#333] transition-all duration-200 rounded-3xl overflow-hidden flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-purple-950/25 cursor-pointer"
              id={`event-card-${event.id}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveModalEvent(event);
                }
              }}
            >
              <div>
                {/* Event Visual Gradient Banner */}
                <div className={`h-28 w-full bg-gradient-to-r ${event.color} p-4 flex items-start justify-between relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/25 backdrop-blur-[1px]" />
                  <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {event.tag}
                  </span>
                  {event.hot && (
                    <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/90 text-white shadow-sm">
                      🔥 Trending
                    </span>
                  )}
                </div>

                {/* Event Information */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                      {event.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#9A9A9A] flex items-center gap-1.5 font-medium">
                    <MapPin size={13} className="text-purple-400 flex-shrink-0" />
                    {event.venue}, {event.city}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-[#777] font-medium pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={13} /> {event.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} /> {event.time}
                    </span>
                  </div>

                  <p className="text-xs text-[#666] line-clamp-2 leading-relaxed mt-1">
                    {event.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#1c1c1c] text-xs">
                    <span className="text-[#888] font-semibold flex items-center gap-1">
                      <Users size={13} className="text-[#555]" />
                      {event.attendees} Attending
                    </span>
                    <span className="font-bold text-purple-300">
                      {event.price}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="p-5 pt-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasTicket) {
                      onNavigate('/tickets');
                    } else {
                      handleGetTicket(event);
                    }
                  }}
                  id={`event-action-btn-${event.id}`}
                  className={`
                    w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2
                    ${hasTicket
                      ? 'bg-green-950/80 border border-green-500/40 text-green-400 hover:bg-green-900/50'
                      : 'bg-[#181818] border border-[#2c2c2c] text-white hover:bg-purple-600 hover:border-purple-600'
                    }
                  `}
                >
                  {hasTicket ? (
                    <>
                      <CheckCircle2 size={14} className="text-green-400" />
                      Ticket in Wallet (View)
                    </>
                  ) : (
                    <>
                      <Ticket size={14} />
                      GET TICKET
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── EVENT DETAILS MODAL ── */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveModalEvent(null)}
            aria-hidden="true"
          />

          {/* Modal Container */}
          <div
            className="relative w-full max-w-xl bg-[#0f0f0f] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl z-10 screen-enter flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-event-title"
          >
            {/* Header Banner Artwork */}
            <div className={`h-36 w-full bg-gradient-to-r ${activeModalEvent.color} p-6 flex flex-col justify-between relative`}>
              <div className="absolute inset-0 bg-black/30" />
              
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-white border border-white/20">
                  {activeModalEvent.tag}
                </span>
                <button
                  onClick={() => setActiveModalEvent(null)}
                  className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors"
                  aria-label="Close modal"
                  id="close-event-modal-btn"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="relative z-10">
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                  {activeModalEvent.genre}
                </span>
                <h2 id="modal-event-title" className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
                  {activeModalEvent.title}
                </h2>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex flex-col gap-6">
              
              {/* Event Meta Details Grid */}
              <div className="grid grid-cols-2 gap-3 bg-[#161616] p-4 rounded-2xl border border-[#222]">
                <div className="flex items-center gap-2.5 text-xs text-[#BBB]">
                  <MapPin size={15} className="text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#666] uppercase font-bold">Venue</p>
                    <p className="font-semibold text-white">{activeModalEvent.venue}</p>
                    <p className="text-[10px] text-[#888]">{activeModalEvent.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-xs text-[#BBB]">
                  <Calendar size={15} className="text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-[#666] uppercase font-bold">Date & Time</p>
                    <p className="font-semibold text-white">{activeModalEvent.date}</p>
                    <p className="text-[10px] text-[#888]">{activeModalEvent.time}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#888] mb-2">
                  About Experience
                </h3>
                <p className="text-sm text-[#CCC] leading-relaxed">
                  {activeModalEvent.description}
                </p>
              </div>

              {/* Lineup */}
              {activeModalEvent.lineup.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#888] mb-2 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-purple-400" /> Featured DJ Lineup
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {activeModalEvent.lineup.map(artist => (
                      <span
                        key={artist}
                        className="px-3 py-1.5 rounded-xl bg-[#181818] border border-[#282828] text-xs font-medium text-[#EEE]"
                      >
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ticket Status Bar */}
              <div className="bg-purple-950/20 border border-purple-500/25 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Passes Available
                  </p>
                  <p className="text-[11px] text-purple-300/80 mt-0.5">
                    Only {activeModalEvent.remainingPasses} guestlist slots remaining
                  </p>
                </div>
                <span className="text-sm font-black text-white">
                  {activeModalEvent.price}
                </span>
              </div>
            </div>

            {/* Modal Footer CTA */}
            <div className="p-6 pt-3 border-t border-[#1c1c1c] bg-[#0c0c0c] flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveModalEvent(null)}
                className="px-5 py-3 rounded-xl border border-[#282828] text-xs font-semibold text-[#888] hover:text-white transition-colors"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const hasTicket = userTickets.includes(String(activeModalEvent.id));
                  if (hasTicket) {
                    setActiveModalEvent(null);
                    onNavigate('/tickets');
                  } else {
                    handleGetTicket(activeModalEvent);
                    setActiveModalEvent(null);
                  }
                }}
                id="modal-get-ticket-btn"
                className={`
                  flex-1 py-3 px-6 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg
                  ${userTickets.includes(String(activeModalEvent.id))
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white hover:opacity-90 shadow-purple-950/40'
                  }
                `}
              >
                {userTickets.includes(String(activeModalEvent.id)) ? (
                  <>
                    <CheckCircle2 size={16} />
                    View Ticket in Wallet
                  </>
                ) : (
                  <>
                    <Ticket size={16} />
                    GET TICKET
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
