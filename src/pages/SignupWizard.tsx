import React, { useState, useEffect } from 'react';
import WizardLayout from '../components/wizard/WizardLayout';
import OTPInput from '../components/wizard/OTPInput';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import BottomSheet from '../components/ui/BottomSheet';
import { useSignup } from '../context/SignupContext';
import { useToast } from '../context/ToastContext';
import {
  validateEmail,
  validateUsername,
  validateName,
  validateDob,
  formatDob,
  validateOTP,
  validateInviteCode,
  randomDelay,
  TAKEN_USERNAMES,
} from '../utils/validation';
import { ChevronDown, Calendar } from 'lucide-react';

export type WizardStep =
  | 'email'
  | 'otp'
  | 'username'
  | 'name'
  | 'age'
  | 'pronouns'
  | 'invite';

interface SignupWizardProps {
  step: WizardStep;
  onNext: () => void;
  onBack: () => void;
  animationClass?: string;
}

// ============================================================
// STEP 1: Email
// ============================================================
function EmailStep({ onNext, onBack, animationClass }: Omit<SignupWizardProps, 'step'>) {
  const { state, dispatch } = useSignup();
  const { showToast } = useToast();
  const [email, setEmail] = useState(state.email);
  const [newsletter, setNewsletter] = useState(state.newsletterSubscribed);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProceed = async () => {
    const trimmed = email.trim();
    const err = validateEmail(trimmed);
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    await randomDelay(1000, 1500);

    if (trimmed.toLowerCase() === 'error@test.com') {
      setLoading(false);
      showToast('Unable to send verification code. Please try again.', 'error');
      return;
    }

    dispatch({ type: 'SET_EMAIL', payload: trimmed });
    dispatch({ type: 'SET_NEWSLETTER', payload: newsletter });
    setLoading(false);
    onNext();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleProceed();
  };

  return (
    <WizardLayout animationClass={animationClass}>
      <div className="flex flex-col flex-1 gap-10">
        <div>
          <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight mb-8">
            Enter your email
          </h2>
          <div className="flex flex-col gap-6">
            <Input
              label="Email"
              id="email-input"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => { setEmail(e.target.value); if (error) setError(null); }}
              onKeyDown={handleKeyDown}
              error={error}
              autoComplete="email"
              autoFocus
              inputMode="email"
            />
            <label className="flex items-center gap-3 cursor-pointer group" htmlFor="newsletter-cb">
              <input
                type="checkbox"
                id="newsletter-cb"
                className="custom-checkbox"
                checked={newsletter}
                onChange={e => setNewsletter(e.target.checked)}
              />
              <span className="text-sm text-[#9A9A9A] group-hover:text-[#F5F5F5] transition-colors leading-snug">
                I'd like to subscribe to your newsletter
              </span>
            </label>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleProceed}
            loading={loading}
            id="email-proceed-btn"
          >
            {loading ? 'Sending...' : 'Proceed'}
          </Button>
          <Button variant="secondary" onClick={onBack} id="email-back-btn">
            Back
          </Button>
        </div>
      </div>
    </WizardLayout>
  );
}

// ============================================================
// STEP 2: OTP
// ============================================================
function OTPStep({ onNext, onBack, animationClass }: Omit<SignupWizardProps, 'step'>) {
  const { state } = useSignup();
  const { showToast } = useToast();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setCountdown(30);
    setOtp('');
    setError(null);
    showToast('A new OTP has been sent to your email.', 'info');
  };

  const handleVerify = async () => {
    const err = validateOTP(otp);
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    await randomDelay(1000, 1500);

    if (otp !== '123456') {
      setLoading(false);
      setError('Invalid verification code. Please try again.');
      showToast('Invalid verification code. Please try again.', 'error');
      return;
    }

    setLoading(false);
    showToast('OTP verified successfully!', 'success');
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-0 py-0 md:py-8">
      <div
        className={`
          w-full max-w-[520px] min-h-screen md:min-h-0
          bg-[#050505] md:bg-[#0a0a0a] md:border md:border-[#1a1a1a] md:rounded-2xl
          px-6 py-8 flex flex-col
          ${animationClass}
        `}
      >
        {/* Logo centered at top */}
        <div className="flex justify-center mb-12">
          <span className="logo-e text-3xl" aria-label="Nubpack">E</span>
        </div>

        <div className="flex flex-col flex-1 gap-10">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-3xl font-black uppercase tracking-wider text-[#F5F5F5] mb-3">
                Enter OTP
              </h2>
              <p className="text-sm text-[#9A9A9A] font-medium">
                A 6-digit OTP has been sent to{' '}
                <span className="text-[#F5F5F5] font-semibold">{state.email}</span>
              </p>
            </div>

            <OTPInput value={otp} onChange={val => { setOtp(val); if (error) setError(null); }} hasError={!!error} />

            {error && (
              <p className="text-[#EF4444] text-xs font-medium text-center" role="alert">
                {error}
              </p>
            )}

            <button
              onClick={handleResend}
              disabled={!canResend}
              className={`text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 rounded ${
                canResend
                  ? 'text-purple-400 hover:text-purple-300'
                  : 'text-[#555] cursor-not-allowed'
              }`}
              id="resend-otp-btn"
            >
              {canResend ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
            </button>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <Button
              variant="primary"
              onClick={handleVerify}
              loading={loading}
              id="otp-verify-btn"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </Button>
            <Button variant="secondary" onClick={onBack} id="otp-back-btn">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STEP 3: Username
// ============================================================
function UsernameStep({ onNext, onBack, animationClass }: Omit<SignupWizardProps, 'step'>) {
  const { state, dispatch } = useSignup();
  const [username, setUsername] = useState(state.username);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const err = validateUsername(username);
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    await randomDelay(800, 1200);

    if (TAKEN_USERNAMES.includes(username.toLowerCase())) {
      setLoading(false);
      setError('This username is already taken.');
      return;
    }

    dispatch({ type: 'SET_USERNAME', payload: username });
    setLoading(false);
    onNext();
  };

  return (
    <WizardLayout showGettingReady animationClass={animationClass}>
      <div className="flex flex-col flex-1 gap-10">
        <div>
          <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight mb-8">
            Create a username that fits your vibe!
          </h2>
          <Input
            label="Username"
            id="username-input"
            type="text"
            placeholder="e.g. party_lover_99"
            value={username}
            onChange={e => { setUsername(e.target.value); if (error) setError(null); }}
            onKeyDown={e => e.key === 'Enter' && handleNext()}
            error={error}
            supportingText={!error ? "All your Superlatives and invites will come your way with this name, so make it unforgettable!" : undefined}
            autoComplete="username"
            autoFocus
            maxLength={20}
          />
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleNext}
            loading={loading}
            id="username-next-btn"
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
          <Button variant="secondary" onClick={onBack} id="username-back-btn">
            Back
          </Button>
        </div>
      </div>
    </WizardLayout>
  );
}

// ============================================================
// STEP 4: Name
// ============================================================
function NameStep({ onNext, onBack, animationClass }: Omit<SignupWizardProps, 'step'>) {
  const { state, dispatch } = useSignup();
  const [name, setName] = useState(state.name);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const err = validateName(name);
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    await randomDelay(800, 1200);
    dispatch({ type: 'SET_NAME', payload: name.trim() });
    setLoading(false);
    onNext();
  };

  return (
    <WizardLayout showGettingReady animationClass={animationClass}>
      <div className="flex flex-col flex-1 gap-10">
        <div>
          <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight mb-8">
            "Name, please, for the party check!"
          </h2>
          <Input
            label="Name"
            id="name-input"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={e => { setName(e.target.value); if (error) setError(null); }}
            onKeyDown={e => e.key === 'Enter' && handleNext()}
            error={error}
            supportingText={!error ? "This is the name shown to members and requests. Cannot be changed later." : undefined}
            autoComplete="name"
            autoFocus
            maxLength={50}
          />
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleNext}
            loading={loading}
            id="name-next-btn"
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
          <Button variant="secondary" onClick={onBack} id="name-back-btn">
            Back
          </Button>
        </div>
      </div>
    </WizardLayout>
  );
}

// ============================================================
// STEP 5: Age (Single Clean DOB + Automatic Age Calculation)
// ============================================================

function AgeStep({ onNext, onBack, animationClass }: Omit<SignupWizardProps, 'step'>) {
  const { state, dispatch } = useSignup();

  // Restore DOB and age from context if previously entered
  const [dob, setDob] = useState<string>(state.dob || '');
  const [age, setAge] = useState<string>(state.age || '');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Reference to invisible native date input
  const dateInputRef = React.useRef<HTMLInputElement>(null);

  // Today's date in local ISO string (YYYY-MM-DD)
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Min DOB = 100 years ago
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100);
  const minDobIso = `${minDate.getFullYear()}-${String(minDate.getMonth() + 1).padStart(2, '0')}-${String(minDate.getDate()).padStart(2, '0')}`;

  const openPicker = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker?.();
      } catch {
        dateInputRef.current.focus();
      }
    }
  };

  /** When date of birth is selected, auto-calculate age and validate */
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDob(val);

    if (!val) {
      setAge('');
      setError('Please select your date of birth.');
      return;
    }

    const result = validateDob(val);
    if (result.error) {
      setError(result.error);
      if (result.age !== null) {
        setAge(String(result.age));
      } else {
        setAge('');
      }
    } else {
      setError(null);
      setAge(String(result.age));
    }
  };

  const handleNext = async () => {
    if (!dob) {
      setError('Please select your date of birth.');
      return;
    }

    const result = validateDob(dob);
    if (result.error) {
      setError(result.error);
      return;
    }

    const calculatedAge = String(result.age);
    setError(null);
    setLoading(true);
    await randomDelay(400, 700);
    dispatch({ type: 'SET_AGE', payload: calculatedAge });
    dispatch({ type: 'SET_DOB', payload: dob });
    setLoading(false);
    onNext();
  };

  const hasValidDob = Boolean(dob) && !error && Boolean(age);

  return (
    <WizardLayout showGettingReady animationClass={animationClass}>
      <div className="flex flex-col flex-1 gap-8">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight">
            How many years have you been partying?
          </h2>

          {/* ── SINGLE AGE / DATE OF BIRTH INPUT AREA ── */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="dob-native-input"
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A9A9A]"
            >
              Age
            </label>

            {/* Main single dark input field */}
            <div
              onClick={openPicker}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openPicker();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Age - Click to select date of birth"
              id="age-input-field"
              className={`
                relative w-full rounded-xl px-4 py-3.5 bg-[#111111] border transition-all duration-150 cursor-pointer flex items-center justify-between group
                ${
                  error
                    ? 'border-[#EF4444] ring-1 ring-[#EF4444]'
                    : 'border-[#222222] hover:border-[#444444] focus-within:border-[#A855F7] focus-within:ring-1 focus-within:ring-[#A855F7]'
                }
              `}
            >
              {/* Inside display text */}
              <div className="flex-1 min-w-0 pr-3">
                {hasValidDob ? (
                  <span className="text-[#F5F5F5] font-semibold text-[0.95rem] tracking-wide select-none">
                    {age} years old
                  </span>
                ) : dob && error ? (
                  <span className="text-[#EF4444] font-medium text-[0.95rem] select-none">
                    {age ? `${age} years old` : 'Invalid date'}
                  </span>
                ) : (
                  <span className="text-[#555555] text-xs sm:text-[0.92rem] select-none truncate block">
                    Select your birthday / Age automatically calculated
                  </span>
                )}
              </div>

              {/* Calendar icon */}
              <Calendar
                className="w-5 h-5 text-[#9A9A9A] group-hover:text-white transition-colors shrink-0"
                aria-hidden="true"
              />

              {/* Invisible native date input layered over container for native picker trigger */}
              <input
                ref={dateInputRef}
                type="date"
                id="dob-native-input"
                aria-label="Date of birth"
                value={dob}
                onChange={handleDobChange}
                max={todayIso}
                min={minDobIso}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                style={{ colorScheme: 'dark' }}
                tabIndex={-1}
              />
            </div>

            {/* Supporting text below */}
            {error ? (
              <p id="age-error" className="text-[#EF4444] text-xs font-medium mt-1" role="alert">
                {error}
              </p>
            ) : hasValidDob ? (
              <p className="text-xs text-[#9A9A9A] font-medium flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block" />
                Born on {formatDob(dob)}
              </p>
            ) : (
              <p id="age-hint" className="text-[#666666] text-xs leading-relaxed mt-1">
                Click anywhere in the field to choose your birthday.
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleNext}
            loading={loading}
            id="age-next-btn"
            disabled={loading || (dob !== '' && Boolean(error))}
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
          <Button variant="secondary" onClick={onBack} id="age-back-btn">
            Back
          </Button>
        </div>
      </div>
    </WizardLayout>
  );
}


// ============================================================
// STEP 6: Pronouns
// ============================================================
const PRONOUN_OPTIONS = ['he', 'him', 'his', 'she', 'her', 'hers', 'they', 'them', 'theirs', 'ze', 'zir', 'zirs', 've'];
const MAX_PRONOUNS = 3;

function PronounsStep({ onNext, onBack, animationClass }: Omit<SignupWizardProps, 'step'>) {
  const { state, dispatch } = useSignup();
  const { showToast } = useToast();
  const [selected, setSelected] = useState<string[]>(state.pronouns);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePronoun = (p: string) => {
    if (selected.includes(p)) {
      setSelected(prev => prev.filter(x => x !== p));
    } else {
      if (selected.length >= MAX_PRONOUNS) {
        showToast(`You can select up to ${MAX_PRONOUNS} pronouns.`, 'info');
        return;
      }
      setSelected(prev => [...prev, p]);
    }
  };

  const handleNext = async () => {
    setSheetOpen(false);
    setLoading(true);
    await randomDelay(800, 1200);
    dispatch({ type: 'SET_PRONOUNS', payload: selected });
    setLoading(false);
    onNext();
  };

  const displayValue = selected.length > 0 ? selected.join(', ') : '';

  return (
    <WizardLayout showGettingReady animationClass={animationClass}>
      <div className="flex flex-col flex-1 gap-10">
        <div>
          <h2 className="text-3xl font-black text-[#F5F5F5] leading-tight mb-8">
            Which pronouns feel right for you?
          </h2>

          {/* Pronoun selector trigger */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#9A9A9A]">
              Pronouns
            </label>
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="field-input text-left flex items-center justify-between focus:border-purple-500"
              id="pronouns-select-btn"
              aria-haspopup="dialog"
              aria-expanded={sheetOpen}
            >
              <span className={displayValue ? 'text-[#F5F5F5]' : 'text-[#555] text-sm'}>
                {displayValue || 'Tap to select pronouns'}
              </span>
              <ChevronDown size={18} className="text-[#9A9A9A] flex-shrink-0" />
            </button>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleNext}
            loading={loading}
            id="pronouns-next-btn"
          >
            {loading ? 'Saving...' : 'Next'}
          </Button>
          <Button variant="secondary" onClick={onBack} id="pronouns-back-btn">
            Back
          </Button>
        </div>
      </div>

      {/* Bottom Sheet / Modal */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Select Pronouns"
        subtitle={`Select up to ${MAX_PRONOUNS}`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
          {PRONOUN_OPTIONS.map(p => {
            const isChecked = selected.includes(p);
            const isDisabled = !isChecked && selected.length >= MAX_PRONOUNS;
            return (
              <label
                key={p}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl cursor-pointer
                  transition-colors duration-150
                  ${isChecked ? 'bg-purple-500/10' : 'hover:bg-white/5'}
                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                `}
              >
                <input
                  type="checkbox"
                  className="pronoun-checkbox"
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => !isDisabled && togglePronoun(p)}
                  aria-label={p}
                />
                <span className="text-[#F5F5F5] font-semibold text-sm uppercase tracking-widest">
                  {p}
                </span>
              </label>
            );
          })}

          {/* Prefer not to say */}
          <div className="mt-4 pt-4 border-t border-[#222]">
            <button
              className="w-full text-center text-sm text-[#9A9A9A] hover:text-[#F5F5F5] transition-colors py-3 font-medium"
              onClick={() => { setSelected([]); setSheetOpen(false); }}
              id="pronouns-prefer-not-btn"
            >
              Prefer not to say
            </button>
          </div>
        </div>

        {/* Confirm button in sheet */}
        {selected.length > 0 && (
          <div className="mt-4">
            <Button
              variant="primary"
              onClick={() => setSheetOpen(false)}
              id="pronouns-confirm-btn"
            >
              Confirm ({selected.length} selected)
            </Button>
          </div>
        )}
      </BottomSheet>
    </WizardLayout>
  );
}

// ============================================================
// STEP 7: Invite Code
// ============================================================
const INVITE_HIGHLIGHT_WORDS = ['GOOD HAIR DAY', 'HALLOWEEN', 'INTENTIONS', 'ALSO', 'ICONIC', 'SPELLING'];

function highlightWords(text: string): React.ReactNode {
  let remaining = text;
  const parts: React.ReactNode[] = [];
  let key = 0;

  // Simple approach: split by highlight words
  const allHighlights = INVITE_HIGHLIGHT_WORDS.sort((a, b) => b.length - a.length);

  while (remaining.length > 0) {
    let found = false;
    for (const word of allHighlights) {
      const idx = remaining.indexOf(word);
      if (idx === 0) {
        parts.push(
          <span
            key={key++}
            style={{
              background: 'linear-gradient(135deg, #A855F7, #D946EF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {word}
          </span>
        );
        remaining = remaining.slice(word.length);
        found = true;
        break;
      }
    }
    if (!found) {
      // Find the next highlight word position
      let nextIdx = remaining.length;
      for (const word of allHighlights) {
        const idx = remaining.indexOf(word);
        if (idx > 0 && idx < nextIdx) nextIdx = idx;
      }
      parts.push(<span key={key++}>{remaining.slice(0, nextIdx)}</span>);
      remaining = remaining.slice(nextIdx);
    }
  }

  return <>{parts}</>;
}

const MARKETING_LINES = [
  { text: 'KINDNESS = GOOD HAIR DAY' },
  { text: 'SIP? CHIP IN.' },
  { text: 'GHOSTING IS FOR HALLOWEEN.' },
  { text: 'OUTFITS LOUD, INTENTIONS CLEAR.' },
  { text: 'JOINING? FREE. HOSTING? ALSO FREE.' },
  { text: 'EARLY IS ICONIC.' },
  { text: 'YES. SPELLING MISTAKE.' },
];

function InviteStep({ onNext, onBack, animationClass }: Omit<SignupWizardProps, 'step'>) {
  const { state, dispatch } = useSignup();
  const { showToast } = useToast();
  const [code, setCode] = useState(state.inviteCode);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    setCode(val);
    if (error) setError(null);
  };

  const handleSignUp = async () => {
    if (code) {
      const err = validateInviteCode(code);
      if (err) { setError(err); return; }
    }
    setError(null);
    setLoading(true);
    await randomDelay(1200, 1500);

    if (code === 'INVALID') {
      setLoading(false);
      showToast('This invite code could not be verified.', 'error');
      setError('This invite code could not be verified.');
      return;
    }

    dispatch({ type: 'SET_INVITE_CODE', payload: code });
    setLoading(false);
    onNext();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-0 py-0 md:py-8">
      <div
        className={`
          w-full max-w-[520px] min-h-screen md:min-h-0
          bg-[#050505] md:bg-[#0a0a0a] md:border md:border-[#1a1a1a] md:rounded-2xl
          px-6 py-8 flex flex-col
          ${animationClass}
        `}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10">
          <span className="logo-e text-3xl" aria-label="Nubpack">E</span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A9A9A]">
            Getting Ready
          </span>
        </div>

        {/* Marketing copy */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-2 mb-10">
            {MARKETING_LINES.map(({ text }, i) => (
              <p
                key={i}
                className="text-[22px] md:text-[24px] font-black uppercase leading-tight tracking-tight text-[#F5F5F5]"
              >
                {highlightWords(text)}
              </p>
            ))}
          </div>

          {/* Invite code input */}
          <div className="flex flex-col gap-6">
            <Input
              label="Enter Invite Code (Optional)"
              id="invite-code-input"
              type="text"
              placeholder="e.g. PARTY2024"
              value={code}
              onChange={handleCodeChange}
              onKeyDown={e => e.key === 'Enter' && handleSignUp()}
              error={error}
              supportingText={!error ? "Enter invite code and get up to +30 HVTS!" : undefined}
              autoCapitalize="characters"
              autoComplete="off"
              maxLength={12}
            />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Button
            variant="primary"
            onClick={handleSignUp}
            loading={loading}
            id="invite-signup-btn"
          >
            {loading ? 'Creating Profile...' : 'Sign Up'}
          </Button>
          <Button variant="secondary" onClick={onBack} id="invite-back-btn">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Main Wizard Orchestrator
// ============================================================
export default function SignupWizard({ step, onNext, onBack, animationClass }: SignupWizardProps) {
  switch (step) {
    case 'email':
      return <EmailStep onNext={onNext} onBack={onBack} animationClass={animationClass} />;
    case 'otp':
      return <OTPStep onNext={onNext} onBack={onBack} animationClass={animationClass} />;
    case 'username':
      return <UsernameStep onNext={onNext} onBack={onBack} animationClass={animationClass} />;
    case 'name':
      return <NameStep onNext={onNext} onBack={onBack} animationClass={animationClass} />;
    case 'age':
      return <AgeStep onNext={onNext} onBack={onBack} animationClass={animationClass} />;
    case 'pronouns':
      return <PronounsStep onNext={onNext} onBack={onBack} animationClass={animationClass} />;
    case 'invite':
      return <InviteStep onNext={onNext} onBack={onBack} animationClass={animationClass} />;
    default:
      return null;
  }
}
