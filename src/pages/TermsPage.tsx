import Button from '../components/ui/Button';
import { LogoE } from '../components/wizard/WizardLayout';

interface TermsPageProps {
  onAccept: () => void;
  animationClass?: string;
}

export default function TermsPage({ onAccept, animationClass = 'screen-enter' }: TermsPageProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-0 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="hidden md:block absolute top-1/3 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A855F7, transparent 70%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />

      <div
        className={`
          w-full max-w-full md:max-w-2xl lg:max-w-3xl min-h-screen md:min-h-0
          bg-[#050505] md:bg-[#0d0d0d] md:border md:border-[#1e1e1e] md:rounded-3xl
          p-6 sm:p-8 md:p-12 flex flex-col relative z-10 md:shadow-2xl md:shadow-purple-950/20
          ${animationClass}
        `}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-3">
            <LogoE size="md" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#444] hidden sm:inline">
              Nubpack Terms
            </span>
          </div>
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A9A9A] bg-[#141414] px-3 py-1 rounded-full border border-[#222]">
            Step 0
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-wide text-white mb-6">
              House Rules & Vibe Protocol
            </h2>
            <p
              className="text-[#E0E0E0] font-semibold text-sm sm:text-base md:text-lg leading-[1.85] tracking-wide uppercase"
              style={{ wordBreak: 'break-word' }}
            >
              By using this app, you're agreeing to keep things fun,
              safe, and respectful. And also agreeing to our terms and
              conditions. Pointless drama is out—treat others how you'd want
              to be treated. Everything here is looking for reasons to party,
              so bring your best vibe and expect the same from others.
              Let's party responsibly and make every experience a legendary one!
            </p>
          </div>

          <div className="mt-12 md:mt-16 flex flex-col items-center gap-4">
            <p className="text-[#9A9A9A] text-xs font-medium text-center tracking-wide uppercase">
              To proceed, accept Terms and Conditions
            </p>
            <Button
              variant="primary"
              onClick={onAccept}
              id="terms-accept-btn"
              className="w-full md:max-w-md py-5 text-base"
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

