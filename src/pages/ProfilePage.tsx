import React, { useState } from 'react';
import {
  User,
  Mail,
  Calendar,
  Lock,
  Edit3,
  Check,
  Zap,
  Copy,
  LogOut,
} from 'lucide-react';

import type { SignupState } from '../context/SignupContext';
import { formatDob, validateName } from '../utils/validation';
import { useToast } from '../context/ToastContext';

interface ProfilePageProps {
  state: SignupState;
  onUpdateProfile: (updated: { name: string; pronouns: string[] }) => void;
  onLogout: () => void;
}

const AVAILABLE_PRONOUNS = [
  'he', 'him', 'his', 'she', 'her', 'hers', 'they', 'them', 'theirs', 'ze', 'zir'
];

export default function ProfilePage({
  state,
  onUpdateProfile,
  onLogout,
}: ProfilePageProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form edit states
  const [editName, setEditName] = useState(state.name);
  const [editPronouns, setEditPronouns] = useState<string[]>(state.pronouns);
  const [nameError, setNameError] = useState<string | null>(null);

  const displayName = state.name || state.username || 'Party Animal';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'EX';

  const totalTokens = 30 + (state.inviteCode ? 30 : 0);

  const handleStartEdit = () => {
    setEditName(state.name);
    setEditPronouns([...state.pronouns]);
    setNameError(null);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditName(state.name);
    setEditPronouns([...state.pronouns]);
    setNameError(null);
    setIsEditing(false);
  };

  const handleTogglePronoun = (pronoun: string) => {
    if (editPronouns.includes(pronoun)) {
      setEditPronouns(editPronouns.filter(p => p !== pronoun));
    } else {
      if (editPronouns.length >= 3) {
        showToast('Maximum 3 pronouns allowed', 'info');
        return;
      }
      setEditPronouns([...editPronouns, pronoun]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateName(editName);
    if (err) {
      setNameError(err);
      return;
    }

    setNameError(null);
    setLoading(true);

    // Simulate saving delay
    await new Promise(resolve => setTimeout(resolve, 600));

    onUpdateProfile({
      name: editName.trim(),
      pronouns: editPronouns,
    });

    setLoading(false);
    setIsEditing(false);
    showToast('Profile updated successfully!', 'success');
  };

  const handleCopyInvite = () => {
    try {
      navigator.clipboard.writeText(state.inviteCode || 'NUBPACK-VIP');
      showToast('Invite code copied to clipboard!', 'success');
    } catch {
      showToast('Invite code: ' + (state.inviteCode || 'NUBPACK-VIP'), 'info');
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#1c1c1c]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30">
              Account Passport
            </span>
            <span className="text-xs text-[#777]">· Extrovert ID #{state.age}09</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-tight text-white">
            User Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#888] mt-1 font-medium">
            Manage your personal details, pronouns, and Extrovert party passport.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleStartEdit}
            id="edit-profile-btn"
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-purple-950/30 flex items-center gap-2 transition-all"
          >
            <Edit3 size={14} />
            <span>EDIT PROFILE</span>
          </button>
        )}
      </div>

      {/* ── PROFILE HERO CARD ── */}
      <div
        className="relative rounded-3xl p-6 sm:p-8 border border-[#222] overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #130a24 0%, #0d0d18 50%, #09090f 100%)',
        }}
      >
        <div
          className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #A855F7, transparent 70%)', filter: 'blur(60px)' }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center font-black text-2xl sm:text-3xl text-white shadow-2xl shadow-purple-900/40 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #A855F7, #D946EF)' }}
            >
              {initials}
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  {state.name}
                </h2>
                <span className="text-[10px] font-bold text-green-400 bg-green-950/80 border border-green-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Verified
                </span>
              </div>
              <p className="text-sm font-semibold text-purple-400 mt-0.5">
                @{state.username}
              </p>
              <p className="text-xs text-[#888] mt-1 flex items-center gap-2">
                <span>{state.pronouns.length ? state.pronouns.join(' / ') : 'No pronouns set'}</span>
                <span>·</span>
                <span>{state.age ? `${state.age} yrs old` : ''}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#0c0c14]/80 backdrop-blur-md p-4 rounded-2xl border border-[#222]">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold text-[#888]">HVTS Balance</p>
              <p className="text-xl font-black text-yellow-400 flex items-center justify-end gap-1">
                <Zap size={15} className="fill-yellow-400" />
                {totalTokens}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── PROFILE DETAILS / EDIT FORM ── */}
      <div className="bg-[#101010] border border-[#1e1e1e] rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[#9A9A9A] mb-6 flex items-center gap-2">
          <User size={16} className="text-purple-400" />
          {isEditing ? 'Editing Personal Details' : 'Verified Passport Information'}
        </h3>

        {isEditing ? (
          /* ── EDIT FORM MODE ── */
          <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name (Editable) */}
              <div className="flex flex-col gap-2">
                <label htmlFor="edit-name-input" className="text-xs font-semibold text-[#CCC]">
                  Full Name <span className="text-purple-400">*</span>
                </label>
                <input
                  type="text"
                  id="edit-name-input"
                  value={editName}
                  onChange={(e) => {
                    setEditName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  className={`field-input ${nameError ? 'input-error' : ''}`}
                  placeholder="Enter your full name"
                  maxLength={50}
                  autoFocus
                />
                {nameError && (
                  <p className="text-xs text-red-400 mt-0.5">{nameError}</p>
                )}
              </div>

              {/* Username (Read Only) */}
              <div className="flex flex-col gap-2 opacity-60">
                <label className="text-xs font-semibold text-[#888] flex items-center gap-1.5">
                  <Lock size={12} /> Username (Permanent Handle)
                </label>
                <input
                  type="text"
                  value={`@${state.username}`}
                  disabled
                  className="field-input cursor-not-allowed bg-[#181818]"
                />
              </div>

              {/* Email (Read Only) */}
              <div className="flex flex-col gap-2 opacity-60">
                <label className="text-xs font-semibold text-[#888] flex items-center gap-1.5">
                  <Mail size={12} /> Registered Email
                </label>
                <input
                  type="email"
                  value={state.email}
                  disabled
                  className="field-input cursor-not-allowed bg-[#181818]"
                />
              </div>

              {/* Date of Birth (Read Only) */}
              <div className="flex flex-col gap-2 opacity-60">
                <label className="text-xs font-semibold text-[#888] flex items-center gap-1.5">
                  <Calendar size={12} /> Date of Birth & Age
                </label>
                <input
                  type="text"
                  value={`${formatDob(state.dob)} (${state.age} years old)`}
                  disabled
                  className="field-input cursor-not-allowed bg-[#181818]"
                />
              </div>

            </div>

            {/* Pronouns Selection (Editable) */}
            <div className="flex flex-col gap-3 pt-2">
              <label className="text-xs font-semibold text-[#CCC] flex items-center justify-between">
                <span>Select Pronouns (up to 3)</span>
                <span className="text-[11px] text-purple-400 font-normal">
                  {editPronouns.length}/3 selected
                </span>
              </label>

              <div className="flex flex-wrap gap-2">
                {AVAILABLE_PRONOUNS.map(p => {
                  const isChecked = editPronouns.includes(p);
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => handleTogglePronoun(p)}
                      className={`
                        px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all
                        ${isChecked
                          ? 'bg-purple-600 text-white shadow-md shadow-purple-950/40 border border-purple-400/50'
                          : 'bg-[#181818] text-[#888] border border-[#2a2a2a] hover:text-white hover:bg-[#222]'
                        }
                      `}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1c1c1c]">
              <button
                type="button"
                onClick={handleCancelEdit}
                id="cancel-edit-btn"
                disabled={loading}
                className="px-6 py-3 rounded-xl border border-[#2a2a2a] text-xs font-bold text-[#888] hover:text-white hover:bg-[#181818] transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                id="save-profile-btn"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold hover:opacity-90 shadow-lg shadow-purple-950/40 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="spinner spinner-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check size={14} />
                    <span>SAVE CHANGES</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* ── VIEW PROFILE MODE ── */
          <div className="flex flex-col divide-y divide-[#1a1a1a]">
            <DetailItem label="Full Name" value={state.name} />
            <DetailItem label="Username" value={`@${state.username}`} lock />
            <DetailItem label="Email Address" value={state.email} lock />
            <DetailItem label="Age" value={`${state.age} years old`} lock />
            {state.dob && (
              <DetailItem label="Date of Birth" value={formatDob(state.dob)} lock />
            )}
            <DetailItem
              label="Pronouns"
              value={state.pronouns.length ? state.pronouns.join(' / ') : 'Not specified'}
            />
            {state.inviteCode && (
              <div className="flex items-center justify-between py-4">
                <span className="text-xs font-medium text-[#888]">Exclusive Invite Code</span>
                <button
                  onClick={handleCopyInvite}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-500/30 text-purple-300 font-mono font-bold text-xs hover:bg-purple-900/40 transition-colors"
                >
                  <span>{state.inviteCode}</span>
                  <Copy size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── LOGOUT ROW ── */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-[#0e0a0a] border border-red-950/40">
        <div>
          <p className="text-sm font-bold text-red-400">Exit Party Session</p>
          <p className="text-xs text-[#777] mt-0.5">
            Log out on this device. Your profile and tickets are securely preserved.
          </p>
        </div>

        <button
          onClick={onLogout}
          id="profile-logout-btn"
          className="px-5 py-2.5 rounded-xl bg-red-950/80 border border-red-800/40 text-red-400 text-xs font-bold hover:bg-red-900/80 transition-colors flex items-center gap-2"
        >
          <LogOut size={14} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  lock = false,
}: {
  label: string;
  value: string;
  lock?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-4">
      <span className="text-xs font-medium text-[#888] flex items-center gap-1.5">
        {label}
        {lock && <Lock size={11} className="text-[#555]" />}
      </span>
      <span className="text-sm font-semibold text-[#F5F5F5]">{value}</span>
    </div>
  );
}
