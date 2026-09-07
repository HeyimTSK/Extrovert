import Button from '../components/ui/Button';

interface LandingPageProps {
  onContinue: () => void;
  onNavigateToLogin: () => void;
}

export default function LandingPage({ onContinue, onNavigateToLogin }: LandingPageProps) {
  return (
    <div className="landing-bg min-h-screen flex flex-col items-center justify-between relative overflow-hidden">


      {/* Layered gradient orbs */}
      <div className="landing-gradient-1" aria-hidden="true" />
      <div className="landing-gradient-2" aria-hidden="true" />
      <div className="landing-gradient-3" aria-hidden="true" />
      <div className="landing-gradient-4" aria-hidden="true" />
      <div className="landing-gradient-5" aria-hidden="true" />

      {/* Mountain silhouette */}
      <div className="mountain-shadow" aria-hidden="true" />
      <div className="mountain-shadow-overlay" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl lg:max-w-5xl mx-auto px-6 py-12 md:py-16 flex-1 justify-between">
        {/* Logo area */}
        <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center gap-8 md:gap-10">
          {/* Stylized E logo */}
          <div className="relative">
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl"
              aria-label="Nubpack logo"
            >
              <span
                className="text-4xl md:text-5xl font-black italic text-white leading-none"
                style={{ textShadow: '0 0 30px rgba(255,255,255,0.5)' }}
              >
                E
              </span>
            </div>
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 -z-10 w-20 h-20 md:w-24 md:h-24 rounded-2xl md:rounded-3xl bg-white/20 blur-xl" aria-hidden="true" />
          </div>

          {/* Tagline */}
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
              An app only for
            </p>
            <h1
              className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black uppercase text-white leading-none tracking-tight"
              style={{ textShadow: '0 0 80px rgba(255,255,255,0.2)' }}
            >
              EXTRO
              <br />
              VERTS
            </h1>
          </div>

          {/* Warning text */}
          <p className="text-xs sm:text-sm md:text-base text-white/60 text-center max-w-md leading-relaxed font-medium">
            Warning: Entering may lead to spontaneous dancing, electric connections, and unsolicited high-fives!
          </p>
        </div>

        {/* Bottom CTA content */}
        <div className="w-full max-w-md mx-auto pt-10 pb-6 flex flex-col gap-3.5">
          <Button
            variant="primary"
            onClick={onContinue}
            className="shadow-2xl shadow-purple-950/40 text-base md:text-lg py-5 w-full"
            id="landing-continue-btn"
          >
            Get Started
          </Button>

          <button
            type="button"
            onClick={onNavigateToLogin}
            id="landing-login-btn"
            className="w-full py-4 text-xs font-bold uppercase tracking-widest text-[#AAA] hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10"
          >
            Already a member? Log In
          </button>
        </div>
      </div>
    </div>
  );
}

