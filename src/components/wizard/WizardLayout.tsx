import React from 'react';

interface WizardLayoutProps {
  children: React.ReactNode;
  showGettingReady?: boolean;
  animationClass?: string;
}

function LogoE({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };
  return (
    <span className={`logo-e ${sizeMap[size]}`} aria-label="Nubpack">
      E
    </span>
  );
}

export { LogoE };

export default function WizardLayout({
  children,
  showGettingReady = false,
  animationClass = 'screen-enter',
}: WizardLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-0 md:p-8 lg:p-12 relative overflow-hidden">
      {/* Background ambient lighting for desktop */}
      <div
        className="hidden md:block absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-15 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #A855F7, transparent 70%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />
      <div
        className="hidden md:block absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D946EF, transparent 70%)', filter: 'blur(90px)' }}
        aria-hidden="true"
      />

      {/* Main responsive container */}
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
              Nubpack
            </span>
          </div>
          {showGettingReady && (
            <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#9A9A9A] bg-[#141414] px-3 py-1 rounded-full border border-[#222]">
              Getting Ready
            </span>
          )}
        </div>

        {/* Page content */}
        <div className="flex flex-col flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

