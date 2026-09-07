import React, { useState } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';
import { LogoE } from '../components/wizard/WizardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { STORAGE_KEY, AUTH_KEY, SIGNUP_COMPLETED_KEY } from '../context/SignupContext';
import type { SignupState } from '../context/SignupContext';
import { useToast } from '../context/ToastContext';
import { validateEmail } from '../utils/validation';


interface LoginPageProps {
  onLoginSuccess: (userProfile: SignupState) => void;
  onNavigateToSignup: () => void;
  onNavigateToLanding: () => void;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateToLanding,
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const formatErr = validateEmail(trimmed);
    if (formatErr) {
      setError(formatErr);
      return;
    }

    setError(null);
    setLoading(true);

    // Simulate authenticating against registered local profile
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const profile = JSON.parse(saved) as SignupState;
        if (profile.email && profile.email.toLowerCase() === trimmed.toLowerCase()) {
          // Success! Set session flags
          localStorage.setItem(AUTH_KEY, 'true');
          localStorage.setItem(SIGNUP_COMPLETED_KEY, 'true');
          setLoading(false);
          showToast(`Welcome back, ${profile.name || profile.username}!`, 'success');
          onLoginSuccess(profile);
          return;
        }
      }
    } catch {
      // Storage error
    }

    setLoading(false);
    setError('No account found with this email. Please sign up first.');
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div
        className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A855F7, transparent 70%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D946EF, transparent 70%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />

      {/* Main card */}
      <div className="w-full max-w-xl bg-[#0c0c0c] border border-[#1e1e1e] rounded-3xl p-8 sm:p-12 shadow-2xl relative z-10 flex flex-col gap-8 screen-enter">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onNavigateToLanding}
            className="flex items-center gap-2 focus-visible:outline-none"
            aria-label="Back to home"
          >
            <LogoE size="md" />
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#555] ml-1">
              Nubpack
            </span>
          </button>

          <span className="text-[10px] font-bold text-purple-300 uppercase tracking-widest px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30">
            MEMBER LOGIN
          </span>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Welcome Back to Extroverts.
          </h1>
          <p className="text-sm text-[#888] mt-2 leading-relaxed">
            Enter your registered email address to access your party pass and VIP wallet.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Input
              label="Registered Email"
              id="login-email-input"
              type="email"
              placeholder="e.g. alex@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              error={error}
              autoComplete="email"
              autoFocus
              inputMode="email"
            />
          </div>

          <Button
            variant="primary"
            type="submit"
            loading={loading}
            id="login-submit-btn"
            className="w-full py-4 text-base"
          >
            <span>CONTINUE</span>
            {!loading && <ArrowRight size={16} />}
          </Button>
        </form>

        {/* Footer / Switch to Sign Up */}
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-[#1a1a1a]">
          <p className="text-xs text-[#777] font-medium text-center">
            Don't have an Extrovert account yet?
          </p>

          <button
            onClick={onNavigateToSignup}
            id="create-account-from-login-btn"
            className="w-full py-3 px-4 rounded-xl border border-[#262626] bg-[#121212] hover:bg-[#181818] hover:border-[#383838] text-xs font-bold text-purple-300 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <UserPlus size={14} />
            <span>CREATE NEW ACCOUNT</span>
          </button>
        </div>
      </div>
    </div>
  );
}
