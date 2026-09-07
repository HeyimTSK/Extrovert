import { PartyPopper } from 'lucide-react';
import Button from '../components/ui/Button';
import type { SignupState } from '../context/SignupContext';
import { formatDob } from '../utils/validation';

interface SuccessPageProps {
  state: SignupState;
  onEnterParty: () => void;
}

export default function SuccessPage({ state, onEnterParty }: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A855F7, #D946EF, transparent 70%)', filter: 'blur(100px)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl lg:max-w-3xl flex flex-col items-center gap-8 md:gap-10 screen-enter md:bg-[#0c0c0c] md:border md:border-[#1e1e1e] md:rounded-3xl md:p-12 md:shadow-2xl md:shadow-purple-950/20">
        {/* Logo */}
        <div className="relative success-logo">
          <div
            className="w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #A855F7, #D946EF)' }}
            aria-label="Nubpack"
          >
            <span className="text-5xl md:text-6xl font-black italic text-white leading-none">E</span>
          </div>
          <div
            className="absolute inset-0 w-24 h-24 md:w-28 md:h-28 rounded-3xl opacity-50 blur-xl"
            style={{ background: 'linear-gradient(135deg, #A855F7, #D946EF)' }}
            aria-hidden="true"
          />
        </div>

        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[#F5F5F5] fade-in">
            You're In.
          </h1>
          <p className="text-[#9A9A9A] text-sm sm:text-base md:text-lg mt-2 font-medium fade-in fade-in-delay-1">
            Your vibe has officially been verified.
          </p>
        </div>

        {/* Profile Card */}
        <div className="w-full bg-[#101010] border border-[#222] rounded-2xl overflow-hidden fade-in fade-in-delay-2">
          {/* Card header */}
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(217,70,239,0.1))' }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A9A9A]">
              Profile Summary & Membership
            </p>
            <span className="text-[10px] font-bold text-green-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              Verified Extrovert
            </span>
          </div>

          {/* Card rows */}
          <div className="px-6 py-4 divide-y divide-[#1a1a1a] grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <ProfileRow label="Username" value={`@${state.username}`} highlight />
            <ProfileRow label="Name" value={state.name} />
            <ProfileRow label="Age" value={state.age ? `${state.age} years old` : 'Not specified'} />
            {state.dob && (
              <ProfileRow label="Date of Birth" value={formatDob(state.dob)} />
            )}
            <ProfileRow
              label="Pronouns"
              value={state.pronouns.length > 0 ? state.pronouns.join(' / ') : 'Not specified'}
            />
            {state.inviteCode && (
              <ProfileRow label="Invite Code" value={state.inviteCode} highlight />
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="w-full flex flex-col items-center gap-3 fade-in fade-in-delay-3">
          <Button
            variant="primary"
            onClick={onEnterParty}
            id="enter-party-btn"
            className="w-full max-w-md py-5 text-base md:text-lg shadow-2xl shadow-purple-950/40"
          >
            <PartyPopper size={20} />
            Enter the Party
          </Button>
        </div>
      </div>
    </div>
  );
}


function ProfileRow({
  label,
  value,
  highlight = false,
  last = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-3.5 ${last ? '' : ''}`}>
      <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A9A9A]">
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${
          highlight ? 'text-purple-gradient' : 'text-[#F5F5F5]'
        }`}
        style={highlight ? {
          background: 'linear-gradient(135deg, #A855F7, #D946EF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        } : {}}
      >
        {value}
      </span>
    </div>
  );
}
