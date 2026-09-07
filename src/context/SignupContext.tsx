import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface SignupState {
  email: string;
  newsletterSubscribed: boolean;
  otpVerified: boolean;
  username: string;
  name: string;
  age: string;
  dob: string; // ISO date string e.g. "2000-09-07"
  pronouns: string[];
  inviteCode: string;
  isAuthenticated: boolean; // set to true after successful signup
}

type Action =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_NEWSLETTER'; payload: boolean }
  | { type: 'SET_OTP_VERIFIED'; payload: boolean }
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_AGE'; payload: string }
  | { type: 'SET_DOB'; payload: string }
  | { type: 'SET_PRONOUNS'; payload: string[] }
  | { type: 'SET_INVITE_CODE'; payload: string }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'UPDATE_PROFILE'; payload: { name: string; pronouns: string[] } }
  | { type: 'LOAD_STATE'; payload: SignupState }
  | { type: 'RESET' };

export const STORAGE_KEY = 'nubpack_signup_state';
export const SIGNUP_COMPLETED_KEY = 'signupCompleted';
export const AUTH_KEY = 'isAuthenticated';
export const TICKETS_KEY = 'nubpack_user_tickets';
export const SOCIAL_CONNECTIONS_KEY = 'nubpack_social_connections';

const initialState: SignupState = {
  email: '',
  newsletterSubscribed: false,
  otpVerified: false,
  username: '',
  name: '',
  age: '',
  dob: '',
  pronouns: [],
  inviteCode: '',
  isAuthenticated: false,
};

function getInitialState(): SignupState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const isAuth = localStorage.getItem(AUTH_KEY) === 'true';
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<SignupState>;
      return { ...initialState, ...parsed, isAuthenticated: isAuth };
    }
  } catch {
    // Ignore storage parse errors
  }
  return initialState;
}

function signupReducer(state: SignupState, action: Action): SignupState {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_NEWSLETTER':
      return { ...state, newsletterSubscribed: action.payload };
    case 'SET_OTP_VERIFIED':
      return { ...state, otpVerified: action.payload };
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_AGE':
      return { ...state, age: action.payload };
    case 'SET_DOB':
      return { ...state, dob: action.payload };
    case 'SET_PRONOUNS':
      return { ...state, pronouns: action.payload };
    case 'SET_INVITE_CODE':
      return { ...state, inviteCode: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'UPDATE_PROFILE':
      return { ...state, name: action.payload.name, pronouns: action.payload.pronouns };
    case 'LOAD_STATE':
      return action.payload;
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}


interface SignupContextType {
  state: SignupState;
  dispatch: React.Dispatch<Action>;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(signupReducer, initialState, getInitialState);

  // Persist state on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);


  return (
    <SignupContext.Provider value={{ state, dispatch }}>
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const ctx = useContext(SignupContext);
  if (!ctx) throw new Error('useSignup must be used within SignupProvider');
  return ctx;
}
