import { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  CheckCircle2,
  Sparkles,
  Share2,
  LogOut,
  Zap,
  Music,
  Compass,
  ArrowRight,
  X,
} from 'lucide-react';
import type { SignupState } from '../context/SignupContext';
import { formatDob } from '../utils/validation';
import { useToast } from '../context/ToastContext';
import { MOCK_EVENTS } from '../data/eventsData';
import type { EventItem } from '../data/eventsData';


interface DashboardPageProps {
  state: SignupState;
  userTickets: string[];
  onTicketObtained: (event: EventItem) => void;
  onNavigate: (path: string) => void;
  onLogout?: () => void;
}

const MOCK_ACTIVITY = [
  { id: 1, user: '@maya_vibe', action: 'joined guestlist for', event: 'Neon Nights', time: '12m ago' },
  { id: 2, user: '@zack_party', action: 'unlocked Extrovert VIP status in', event: 'Mumbai', time: '34m ago' },
  { id: 3, user: '@kavya_bass', action: 'claimed 30 HVTS tokens via invite', event: '', time: '1h ago' },
  { id: 4, user: '@dev_rhythm', action: 'reserved tickets for', event: 'The Social Experiment', time: '2h ago' },
];

export default function DashboardPage({
  state,
  userTickets,
  onTicketObtained,
  onNavigate,
  onLogout,
}: DashboardPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const { showToast } = useToast();

  const totalTokens = 30 + (state.inviteCode ? 30 : 0);
  const displayName = state.name || state.username || 'Party Animal';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'EX';

  const handleCopyInvite = () => {
    const inviteLink = `${window.location.origin}/?invite=${state.username || 'nubpack'}`;
    try {
      navigator.clipboard.writeText(inviteLink);
      showToast('Invite link copied! Share to earn +30 HVTS tokens.', 'success');
    } catch {
      showToast('Invite link: ' + inviteLink, 'info');
    }
  };

  const handleGetTicket = (event: EventItem) => {
    onTicketObtained(event);
    showToast('Ticket added successfully!', 'success');
  };

  const filteredEvents = selectedCategory === 'All'
    ? MOCK_EVENTS
    : MOCK_EVENTS.filter(e => e.category === selectedCategory || (selectedCategory === 'Trending' && e.hot));

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* ── WELCOME HERO HEADER BANNER ── */}
      <section
        aria-label="Welcome Hero"
        className="relative rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden border border-[#222]"
        style={{
          background: 'linear-gradient(135deg, #130924 0%, #0d0d16 50%, #09090c 100%)',
        }}
      >
        {/* Ambient Glow Orbs */}
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-35 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #A855F7, transparent 70%)', filter: 'blur(70px)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #D946EF, transparent 70%)', filter: 'blur(60px)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-green-400">
                Extrovert Pass Active
              </span>
              <span className="text-[#555] text-xs">·</span>
              <span className="text-xs text-[#9A9A9A] font-medium flex items-center gap-1">
                <Compass size={12} /> Mumbai / Bangalore / Delhi
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              Welcome to the Night, {displayName} 🪩
            </h1>
            <p className="text-sm sm:text-base text-[#AAAAAA] mt-2 font-normal leading-relaxed">
              Your vibe verified passport unlocks exclusive guestlists, secret warehouse raves, and VIP token rewards.
            </p>
          </div>

          {/* Quick Stat Counter Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 flex-shrink-0 w-full lg:w-auto">
            <div className="bg-[#0f0f15]/80 backdrop-blur-md border border-[#222] rounded-2xl p-3.5 sm:p-4 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#888] mb-1">HVTS Tokens</p>
              <p className="text-xl sm:text-2xl font-black text-yellow-400">{totalTokens}</p>
              <span className="text-[9px] text-yellow-500/80 font-semibold">+30 Bonus</span>
            </div>
            <div className="bg-[#0f0f15]/80 backdrop-blur-md border border-[#222] rounded-2xl p-3.5 sm:p-4 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#888] mb-1">Vibe Score</p>
              <p className="text-xl sm:text-2xl font-black text-purple-400">98%</p>
              <span className="text-[9px] text-purple-300/80 font-semibold">Top 5% VIP</span>
            </div>
            <div className="bg-[#0f0f15]/80 backdrop-blur-md border border-[#222] rounded-2xl p-3.5 sm:p-4 text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-[#888] mb-1">Passes</p>
              <p className="text-xl sm:text-2xl font-black text-green-400">{userTickets.length}</p>
              <span className="text-[9px] text-green-300/80 font-semibold">Ready to Scan</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESPONSIVE 12-COLUMN DASHBOARD GRID (Sidebar / Main) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* ══════════════════════════════════════════════════════════════════
            LEFT SIDEBAR: MEMBERSHIP CARD & PROFILE PASSPORT (4 COLS)
            ══════════════════════════════════════════════════════════════════ */}
        <aside className="lg:col-span-4 xl:col-span-4 flex flex-col gap-6 order-2 lg:order-1">
          
          {/* 1. DIGITAL MEMBERSHIP CARD */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[#9A9A9A]">
                Membership Pass
              </h2>
              <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} /> NFC Enabled
              </span>
            </div>

            <div
              className="relative rounded-3xl p-6 overflow-hidden border border-purple-500/25 shadow-2xl transition-all hover:border-purple-500/40"
              style={{
                background: 'linear-gradient(135deg, #1b0a2d 0%, #0e0e1a 45%, #0a1711 100%)',
              }}
            >
              <div
                className="absolute -top-10 -right-10 w-36 h-36 rounded-full opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #A855F7, transparent 70%)', filter: 'blur(25px)' }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col justify-between min-h-[190px]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-purple-300/70 mb-0.5">
                      Nubpack Official
                    </p>
                    <p
                      className="text-xl font-black uppercase tracking-widest"
                      style={{
                        background: 'linear-gradient(135deg, #FFFFFF 0%, #D946EF 60%, #A855F7 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      EXTROVERT
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-950/80 border border-green-500/30 text-green-400 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </div>
                </div>

                <div className="my-4 flex items-center justify-between">
                  <div className="w-11 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border border-amber-300/40 shadow-inner flex items-center justify-center opacity-85">
                    <div className="w-8 h-5 border border-amber-900/30 rounded" />
                  </div>
                  <span className="font-mono text-xs text-[#888] tracking-widest">
                    •••• •••• {state.age || '25'}09
                  </span>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-white/10">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#777]">Holder</p>
                    <p className="text-[#F5F5F5] font-bold text-sm">@{state.username || 'member'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-[#777]">Tokens</p>
                    <p className="text-yellow-400 font-black text-base flex items-center justify-end gap-1">
                      <Zap size={12} className="fill-yellow-400" />
                      {totalTokens}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. PROFILE PASSPORT SUMMARY */}
          <div className="bg-[#101010] border border-[#1f1f1f] rounded-3xl overflow-hidden shadow-lg">
            <div
              className="px-6 py-4 border-b border-[#1c1c1c] flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(217,70,239,0.06))' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white flex-shrink-0 shadow-md"
                  style={{ background: 'linear-gradient(135deg, #A855F7, #D946EF)' }}
                >
                  {initials}
                </div>
                <div>
                  <p className="text-[#F5F5F5] font-bold text-sm leading-tight">{state.name}</p>
                  <p className="text-[#9A9A9A] text-xs">@{state.username}</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('/profile')}
                className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 transition-colors"
              >
                View Profile
              </button>
            </div>

            <div className="px-6 py-2 divide-y divide-[#1a1a1a]">
              <ProfileRow label="Email" value={state.email} />
              <ProfileRow label="Age" value={state.age ? `${state.age} years old` : 'Not specified'} />
              {state.dob && (
                <ProfileRow label="Date of Birth" value={formatDob(state.dob)} />
              )}
              <ProfileRow
                label="Pronouns"
                value={state.pronouns.length > 0 ? state.pronouns.join(' / ') : 'Not specified'}
              />
              <ProfileRow
                label="Invite Code"
                value={state.inviteCode || 'VIP-ACCESS-GRANTED'}
                highlight
              />
            </div>

            <div className="p-4 bg-[#0a0a0a] border-t border-[#1a1a1a] flex flex-col gap-2">
              <button
                onClick={handleCopyInvite}
                className="w-full py-2.5 px-4 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                id="share-invite-btn"
              >
                <Share2 size={13} />
                Share Invite Link (+30 HVTS)
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  id="dashboard-logout-btn"
                  className="w-full py-2.5 px-4 rounded-xl border border-[#2a2a2a] bg-[#111] hover:bg-[#1a1212] hover:border-red-900/40 text-xs font-semibold text-[#EF4444] transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={13} />
                  Log Out of Party
                </button>
              )}
            </div>
          </div>

          {/* 3. COMMUNITY PULSE FEED */}
          <div className="bg-[#101010] border border-[#1f1f1f] rounded-3xl p-6 hidden md:flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-[#9A9A9A]">
                Live Party Radar
              </h3>
              <button
                onClick={() => onNavigate('/social')}
                className="text-[10px] text-purple-400 font-semibold flex items-center gap-1 hover:underline"
              >
                View Community <ArrowRight size={10} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {MOCK_ACTIVITY.map(act => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs text-[#888] leading-relaxed">
                  <span className="text-purple-400 font-bold flex-shrink-0">•</span>
                  <div>
                    <span className="text-[#F5F5F5] font-semibold">{act.user}</span>{' '}
                    <span>{act.action}</span>{' '}
                    {act.event && <span className="text-purple-300 font-semibold">{act.event}</span>}{' '}
                    <span className="text-[#555] text-[10px] block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* ══════════════════════════════════════════════════════════════════
            MAIN CONTENT: EVENTS DIRECTORY IN 2–3 RESPONSIVE COLUMNS (8 COLS)
            ══════════════════════════════════════════════════════════════════ */}
        <main className="lg:col-span-8 xl:col-span-8 flex flex-col gap-8 order-1 lg:order-2">
          
          {/* Header & Genre Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[#F5F5F5]">
                Upcoming Experiences
              </h2>
              <p className="text-xs text-[#888] mt-0.5 font-medium">
                Curated nightlife, underground raves, and private extrovert lounges.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {(['All', 'Trending', 'Tonight', 'This Week'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-colors whitespace-nowrap
                      ${selectedCategory === cat
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                        : 'bg-[#141414] border border-[#242424] text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                      }
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onNavigate('/events')}
                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 ml-2 whitespace-nowrap"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Event Cards Grid: 1 Col on Mobile, 2 on Tablet, 2–3 on Desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredEvents.map(event => {
              const isRsvpd = userTickets.includes(String(event.id));
              return (
                <div
                  key={event.id}
                  onClick={() => setActiveModalEvent(event)}
                  className="bg-[#101010] border border-[#1e1e1e] hover:border-[#333] transition-all rounded-3xl overflow-hidden flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:shadow-purple-950/20 cursor-pointer"
                  id={`dashboard-event-${event.id}`}
                >
                  <div>
                    <div className={`h-24 w-full bg-gradient-to-r ${event.color} p-4 flex items-start justify-between relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {event.tag}
                      </span>
                      {event.hot && (
                        <span className="relative z-10 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/90 text-white shadow-sm">
                          🔥 Trending
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors leading-snug">
                          {event.title}
                        </h3>
                      </div>

                      <p className="text-xs text-[#9A9A9A] flex items-center gap-1.5">
                        <MapPin size={13} className="text-purple-400 flex-shrink-0" />
                        {event.venue}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-[#777] font-medium pt-1">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {event.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#1c1c1c]">
                        <span className="text-[11px] text-[#888] font-semibold flex items-center gap-1">
                          <Users size={12} className="text-[#555]" />
                          {event.attendees} Going
                        </span>
                        <span className="text-xs font-bold text-purple-300">
                          {event.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isRsvpd) {
                          onNavigate('/tickets');
                        } else {
                          handleGetTicket(event);
                        }
                      }}
                      id={`rsvp-btn-${event.id}`}
                      className={`
                        w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2
                        ${isRsvpd
                          ? 'bg-green-950/80 border border-green-500/40 text-green-400 hover:bg-green-900/50'
                          : 'bg-[#181818] border border-[#2b2b2b] text-white hover:bg-purple-600 hover:border-purple-600'
                        }
                      `}
                    >
                      {isRsvpd ? (
                        <>
                          <CheckCircle2 size={14} className="text-green-400" />
                          Pass in Wallet (View)
                        </>
                      ) : (
                        <>
                          <Ticket size={14} />
                          Get Access Pass
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* VIP Perks Promo Card */}
          <div
            className="rounded-3xl p-6 sm:p-8 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.1), rgba(217,70,239,0.05))' }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                <Music size={22} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Looking for Private VIP Booths?
                </h3>
                <p className="text-xs text-[#9A9A9A] mt-1 leading-relaxed max-w-lg">
                  Extrovert members with 50+ HVTS tokens get automatic table reservations and express backstage entry at all partner clubs.
                </p>
              </div>
            </div>
            <button
              onClick={handleCopyInvite}
              className="px-5 py-3 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#e0e0e0] transition-colors whitespace-nowrap flex-shrink-0"
            >
              Earn Tokens
            </button>
          </div>

        </main>

      </div>

      {/* ── EVENT DETAILS MODAL ── */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setActiveModalEvent(null)}
            aria-hidden="true"
          />

          <div
            className="relative w-full max-w-xl bg-[#0f0f0f] border border-[#2a2a2a] rounded-3xl overflow-hidden shadow-2xl z-10 screen-enter flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
          >
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
                >
                  <X size={16} />
                </button>
              </div>

              <div className="relative z-10">
                <span className="text-xs font-bold text-white/80 uppercase tracking-widest">
                  {activeModalEvent.genre}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight mt-0.5">
                  {activeModalEvent.title}
                </h2>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex flex-col gap-6">
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

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#888] mb-2">
                  About Experience
                </h3>
                <p className="text-sm text-[#CCC] leading-relaxed">
                  {activeModalEvent.description}
                </p>
              </div>

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
            </div>

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

function ProfileRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#888888]">
        {label}
      </span>
      <span
        className="text-xs font-semibold max-w-[60%] text-right truncate"
        style={
          highlight
            ? {
                background: 'linear-gradient(135deg, #A855F7, #D946EF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }
            : { color: '#F5F5F5' }
        }
      >
        {value}
      </span>
    </div>
  );
}
