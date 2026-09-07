import { useState, useEffect, useCallback } from 'react';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import TermsPage from './pages/TermsPage';
import SignupWizard from './pages/SignupWizard';
import type { WizardStep } from './pages/SignupWizard';
import SuccessPage from './pages/SuccessPage';
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/EventsPage';
import TicketsPage from './pages/TicketsPage';
import SocialPage from './pages/SocialPage';
import ProfilePage from './pages/ProfilePage';
import AppLayout from './components/layout/AppLayout';
import ToastContainer from './components/ui/Toast';
import {
  SignupProvider,
  useSignup,
  SIGNUP_COMPLETED_KEY,
  AUTH_KEY,
  TICKETS_KEY,
  SOCIAL_CONNECTIONS_KEY,
} from './context/SignupContext';
import type { SignupState } from './context/SignupContext';
import { ToastProvider, useToast } from './context/ToastContext';
import type { EventItem, UserTicket } from './data/eventsData';


type AppPage =
  | 'landing'
  | 'login'
  | 'terms'
  | WizardStep
  | 'success'
  | 'dashboard'
  | 'events'
  | 'tickets'
  | 'social'
  | 'profile';

const WIZARD_STEPS: WizardStep[] = ['email', 'otp', 'username', 'name', 'age', 'pronouns', 'invite'];
const PROTECTED_ROUTES = ['/dashboard', '/events', '/tickets', '/social', '/profile'] as const;

/** Determine initial page based on URL pathname and authentication state */
function getInitialPage(): AppPage {
  if (typeof window === 'undefined') return 'landing';

  const path = window.location.pathname;
  let isAuth = false;
  try {
    isAuth = localStorage.getItem(AUTH_KEY) === 'true';
  } catch {}

  // Protected routes check
  if (PROTECTED_ROUTES.includes(path as typeof PROTECTED_ROUTES[number])) {
    if (isAuth) {
      return path.replace('/', '') as AppPage;
    } else {
      // Unauthenticated visit to protected route: redirect to login
      window.history.replaceState({}, '', '/login');
      return 'login';
    }
  }

  // Public /login route
  if (path === '/login') {
    if (isAuth) {
      window.history.replaceState({}, '', '/dashboard');
      return 'dashboard';
    }
    return 'login';
  }

  // Root route "/" or any other route shows landing
  return 'landing';
}

function AppContent() {
  const [page, setPage] = useState<AppPage>(getInitialPage);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const { state, dispatch } = useSignup();
  const { showToast } = useToast();

  // ── Persistent Tickets State ──
  const [tickets, setTickets] = useState<UserTicket[]>(() => {
    try {
      const saved = localStorage.getItem(TICKETS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Seed with 1 initial ticket if user completed signup
    return [
      {
        id: 'TKT-924180',
        eventId: 1,
        eventTitle: 'Neon Nights',
        venue: 'Club Noir, Worli, Mumbai',
        date: 'Tonight',
        time: '10:00 PM – 4:30 AM',
        ticketType: 'VIP EXTROVERT PASS',
        obtainedAt: new Date().toISOString(),
        qrCodeData: 'NUBPACK-TKT-924180-VERIFIED',
        status: 'CONFIRMED',
      },
    ];
  });

  // ── Persistent Social Connections State ──
  const [connectedUserIds, setConnectedUserIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(SOCIAL_CONNECTIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return ['user_1']; // Initial connection
  });

  // Save tickets on change
  useEffect(() => {
    try {
      localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    } catch {}
  }, [tickets]);

  // Save social connections on change
  useEffect(() => {
    try {
      localStorage.setItem(SOCIAL_CONNECTIONS_KEY, JSON.stringify(connectedUserIds));
    } catch {}
  }, [connectedUserIds]);

  const animationClass = direction === 'forward' ? 'screen-enter' : 'screen-enter-back';

  // Navigation with URL synchronization
  const navigate = useCallback((to: AppPage | string, dir: 'forward' | 'back' = 'forward') => {
    const targetPage = to.startsWith('/') ? (to.replace('/', '') as AppPage) : (to as AppPage);
    const targetUrl = targetPage === 'landing' ? '/' : `/${targetPage}`;

    setDirection(dir);
    window.history.pushState({}, '', targetUrl);
    setPage(targetPage);
  }, []);

  // Synchronize browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      let isAuth = false;
      try {
        isAuth = localStorage.getItem(AUTH_KEY) === 'true';
      } catch {}

      if (PROTECTED_ROUTES.includes(path as typeof PROTECTED_ROUTES[number])) {
        if (isAuth) {
          setPage(path.replace('/', '') as AppPage);
        } else {
          window.history.replaceState({}, '', '/login');
          setPage('login');
        }
      } else if (path === '/login') {
        if (isAuth) {
          window.history.replaceState({}, '', '/dashboard');
          setPage('dashboard');
        } else {
          setPage('login');
        }
      } else if (path === '/' || path === '') {
        setPage('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // ── Ticket Handler ──
  const handleTicketObtained = (event: EventItem) => {
    // Prevent duplicate tickets
    if (tickets.some(t => t.eventId === event.id)) return;

    const randomId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTicket: UserTicket = {
      id: randomId,
      eventId: event.id,
      eventTitle: event.title,
      venue: `${event.venue}, ${event.city}`,
      date: event.date,
      time: event.time,
      ticketType: 'VIP GUESTLIST PASS',
      obtainedAt: new Date().toISOString(),
      qrCodeData: `NUBPACK-${randomId}-CONFIRMED`,
      status: 'CONFIRMED',
    };

    setTickets(prev => [newTicket, ...prev]);
  };

  const handleRemoveTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  // ── Social Connection Handler ──
  const handleToggleConnect = (userId: string) => {
    setConnectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // ── Profile Update Handler ──
  const handleUpdateProfile = (updated: { name: string; pronouns: string[] }) => {
    dispatch({ type: 'UPDATE_PROFILE', payload: updated });
  };

  // ── Authentication Handlers ──
  const handleLoginSuccess = (userProfile: SignupState) => {
    dispatch({ type: 'LOAD_STATE', payload: { ...userProfile, isAuthenticated: true } });
    navigate('/dashboard');
  };

  const handleEnterParty = () => {
    try {
      localStorage.setItem(SIGNUP_COMPLETED_KEY, 'true');
      localStorage.setItem(AUTH_KEY, 'true');
    } catch {}

    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    navigate('/dashboard');
  };

  const handleLogout = () => {
    try {
      // Set session to unauthenticated but PRESERVE user profile in STORAGE_KEY!
      localStorage.setItem(AUTH_KEY, 'false');
    } catch {}

    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    showToast('Logged out successfully.', 'info');
    navigate('/login', 'back');
  };

  const handleStartNewSignup = () => {
    // Clear temporary wizard inputs for a fresh registration
    dispatch({ type: 'RESET' });
    navigate('terms');
  };

  // ── Forward Navigation in Signup Wizard ──
  const handleNext = () => {
    if (page === 'landing') { navigate('terms'); return; }
    if (page === 'terms') { navigate('email'); return; }

    const idx = WIZARD_STEPS.indexOf(page as WizardStep);
    if (idx >= 0 && idx < WIZARD_STEPS.length - 1) {
      navigate(WIZARD_STEPS[idx + 1]);
    } else if (idx === WIZARD_STEPS.length - 1) {
      navigate('success');
    }
  };

  // ── Back Navigation in Signup Wizard ──
  const handleBack = () => {
    if (page === 'terms') { navigate('landing', 'back'); return; }
    if (page === 'email') { navigate('terms', 'back'); return; }

    const idx = WIZARD_STEPS.indexOf(page as WizardStep);
    if (idx > 0) {
      navigate(WIZARD_STEPS[idx - 1], 'back');
    } else if (idx === 0) {
      navigate('terms', 'back');
    }
  };

  // Check if current page is one of the protected routes
  const isProtectedRoute = ['dashboard', 'events', 'tickets', 'social', 'profile'].includes(page);
  const currentPath = `/${page}`;
  const userTicketEventIds = tickets.map(t => String(t.eventId));

  return (
    <div className="relative">
      <ToastContainer />

      {/* ── PUBLIC ROUTES ── */}
      {page === 'landing' && (
        <LandingPage
          onContinue={handleNext}
          onNavigateToLogin={() => navigate('/login')}
        />
      )}

      {page === 'login' && (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToSignup={handleStartNewSignup}
          onNavigateToLanding={() => navigate('landing', 'back')}
        />
      )}

      {page === 'terms' && (
        <TermsPage onAccept={handleNext} animationClass={animationClass} />
      )}

      {WIZARD_STEPS.includes(page as WizardStep) && (
        <SignupWizard
          step={page as WizardStep}
          onNext={handleNext}
          onBack={handleBack}
          animationClass={animationClass}
        />
      )}

      {page === 'success' && (
        <SuccessPage state={state} onEnterParty={handleEnterParty} />
      )}

      {/* ── PROTECTED APPLICATION ROUTES (Wrapped in AppLayout) ── */}
      {isProtectedRoute && (
        <AppLayout
          currentPath={currentPath}
          onNavigate={navigate}
          onLogout={handleLogout}
          state={state}
          ticketCount={tickets.length}
        >
          {page === 'dashboard' && (
            <DashboardPage
              state={state}
              userTickets={userTicketEventIds}
              onTicketObtained={handleTicketObtained}
              onNavigate={navigate}
              onLogout={handleLogout}
            />
          )}

          {page === 'events' && (
            <EventsPage
              userTickets={userTicketEventIds}
              onTicketObtained={handleTicketObtained}
              onNavigate={navigate}
            />
          )}

          {page === 'tickets' && (
            <TicketsPage
              tickets={tickets}
              onRemoveTicket={handleRemoveTicket}
              onNavigate={navigate}
            />
          )}

          {page === 'social' && (
            <SocialPage
              connectedUserIds={connectedUserIds}
              onToggleConnect={handleToggleConnect}
            />
          )}

          {page === 'profile' && (
            <ProfilePage
              state={state}
              onUpdateProfile={handleUpdateProfile}
              onLogout={handleLogout}
            />
          )}
        </AppLayout>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SignupProvider>
        <AppContent />
      </SignupProvider>
    </ToastProvider>
  );
}
