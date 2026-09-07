import React from 'react';
import {
  Home,
  Calendar,
  Ticket,
  Users,
  Bell,
  Star,
  Zap,
  LogOut,
} from 'lucide-react';
import type { SignupState } from '../../context/SignupContext';
import { useToast } from '../../context/ToastContext';

export type AppTab = '/dashboard' | '/events' | '/tickets' | '/social' | '/profile';

interface AppLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  state: SignupState;
  ticketCount?: number;
  children: React.ReactNode;
}

export default function AppLayout({
  currentPath,
  onNavigate,
  onLogout,
  state,
  ticketCount = 0,
  children,
}: AppLayoutProps) {
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

  const NAV_ITEMS: {
    path: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }[] = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/events', label: 'Events', icon: Calendar },
    { path: '/tickets', label: 'Tickets', icon: Ticket, badge: ticketCount },
    { path: '/social', label: 'Social', icon: Users },
    { path: '/profile', label: 'Profile', icon: Star },
  ];


  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col selection:bg-purple-500 selection:text-white pb-20 lg:pb-0">
      
      {/* ── FULL-WIDTH TOP NAVIGATION BAR ── */}
      <header className="w-full bg-[#080808]/90 backdrop-blur-xl border-b border-[#1c1c1c] sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Left: Brand Logo */}
          <button
            onClick={() => onNavigate('/dashboard')}
            className="flex items-center gap-3 text-left focus-visible:outline-none group"
            id="brand-home-btn"
          >
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/30 group-hover:scale-105 transition-transform"
              style={{ background: 'linear-gradient(135deg, #A855F7, #D946EF)' }}
            >
              <span className="text-xl font-black italic text-white leading-none">E</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-widest text-[#F5F5F5] uppercase">
                  NUBPACK
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold text-purple-300 uppercase tracking-[0.2em] px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30">
                  EXTROVERTS
                </span>
              </div>
              <span className="text-[10px] text-[#777] font-medium tracking-wide hidden sm:block">
                Nightlife & Social Protocol
              </span>
            </div>
          </button>

          {/* Center: Desktop Navigation Tabs */}
          <nav
            className="hidden md:flex items-center gap-1.5 lg:gap-2 bg-[#101010] p-1.5 rounded-2xl border border-[#202020]"
            aria-label="Primary navigation"
          >
            {NAV_ITEMS.map(({ path, label, icon: Icon, badge }) => {
              const active = currentPath === path;
              return (
                <button
                  key={path}
                  onClick={() => onNavigate(path)}
                  id={`desktop-nav-${path.replace('/', '')}-btn`}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 relative
                    ${active
                      ? 'bg-gradient-to-r from-purple-600/30 to-fuchsia-600/30 text-white border border-purple-500/40 shadow-sm'
                      : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#181818]'
                    }
                  `}
                >
                  <Icon size={15} className={active ? 'text-purple-400' : 'text-[#777]'} />
                  <span>{label}</span>
                  {Boolean(badge && badge > 0) && (
                    <span className="w-4 h-4 rounded-full bg-purple-500 text-white text-[9px] font-black flex items-center justify-center">
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: User status & actions */}
          <div className="flex items-center gap-3">
            {/* Tokens badge */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/25 text-yellow-400 text-xs font-bold shadow-inner">
              <Zap size={14} className="fill-yellow-400 text-yellow-400" />
              <span>{totalTokens} HVTS</span>
            </div>

            {/* Notifications */}
            <button
              className="w-10 h-10 rounded-xl bg-[#121212] border border-[#222] flex items-center justify-center text-[#9A9A9A] hover:text-white hover:border-[#333] transition-colors relative"
              aria-label="Notifications"
              id="notifications-btn"
              onClick={() => showToast('No new notifications right now.', 'info')}
            >
              <Bell size={17} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-black" />
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => onNavigate('/profile')}
              className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-[#141414] transition-colors focus-visible:outline-none"
              id="profile-nav-btn"
              aria-label="Open profile"
            >
              <div
                className="w-9 h-9 rounded-xl border border-purple-500/30 flex items-center justify-center font-bold text-xs text-white shadow-md transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #A855F7, #D946EF)' }}
              >
                {initials}
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-[#F5F5F5] truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-[#888] truncate max-w-[120px]">
                  @{state.username}
                </span>
              </div>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#EF4444] bg-[#1a0f0f] border border-[#3b1818] hover:bg-[#251313] transition-colors ml-1"
              aria-label="Log Out"
              id="header-logout-btn"
            >
              <LogOut size={14} />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── RESPONSIVE MAIN CONTENT (1200px - 1400px) ── */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10 flex flex-col gap-8">
        {children}
      </main>

      {/* ── MOBILE BOTTOM NAVIGATION (Hidden on Desktop: lg:hidden) ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-[#080808]/95 backdrop-blur-xl border-t border-[#1c1c1c] flex items-center justify-around px-2 py-3 z-50 shadow-2xl"
        aria-label="Mobile navigation"
      >
        {NAV_ITEMS.map(({ path, label, icon: Icon, badge }) => {
          const active = currentPath === path;
          return (
            <button
              key={path}
              onClick={() => onNavigate(path)}
              className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all relative focus-visible:outline-none"
              aria-label={label}
              aria-current={active ? 'page' : undefined}
              id={`mobile-nav-${path.replace('/', '')}-btn`}
            >
              <div className="relative">
                <Icon
                  size={20}
                  className="transition-colors duration-150"
                  style={{ color: active ? '#A855F7' : '#666' }}
                />
                {Boolean(badge && badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 rounded-full bg-purple-500 text-white text-[8px] font-black flex items-center justify-center">
                    {badge}
                  </span>
                )}
              </div>
              <span
                className="text-[9px] font-semibold uppercase tracking-wider transition-colors duration-150"
                style={{ color: active ? '#A855F7' : '#666' }}
              >
                {label}
              </span>
              {active && (
                <span
                  className="w-1 h-1 rounded-full bg-[#A855F7]"
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </nav>

    </div>
  );
}
