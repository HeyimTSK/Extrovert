// Validation utilities

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required.';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) return 'Please enter a valid email address.';
  return null;
}

export function validateUsername(username: string): string | null {
  if (!username) return 'Username is required.';
  if (username.includes(' ')) return 'Spaces are not allowed in usernames.';
  if (username.length < 3) return 'Username must be at least 3 characters.';
  if (username.length > 20) return 'Username cannot exceed 20 characters.';
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) return 'Use only letters, numbers, and underscores.';
  return null;
}

export const TAKEN_USERNAMES = ['admin', 'nubpack', 'test', 'unavailable'];

export function validateName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return 'Name is required.';
  if (trimmed.length < 2) return 'Please enter a valid name.';
  if (trimmed.length > 50) return 'Name cannot exceed 50 characters.';
  const nameRegex = /^[a-zA-Z\s''-]+$/;
  if (!nameRegex.test(trimmed)) return 'Please enter a valid name.';
  if (/^\d+$/.test(trimmed)) return 'Please enter a valid name.';
  return null;
}

export function validateAge(age: string): string | null {
  if (!age) return 'Age is required.';
  const num = parseInt(age, 10);
  if (isNaN(num)) return 'Please enter a valid age.';
  if (num < 18) return 'Sorry, you must be at least 18 years old to join.';
  if (num > 100) return 'Please enter a valid age.';
  return null;
}

/** Calculate age from ISO date string (YYYY-MM-DD), safely handling timezones and leap years */
export function calculateAgeFromDob(dobIso: string): number | null {
  if (!dobIso) return null;
  const parts = dobIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  const [year, month, day] = parts;
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  let age = todayYear - year;
  const hasHadBirthdayThisYear =
    todayMonth > month || (todayMonth === month && todayDay >= day);
  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }
  return age;
}

/** Validate date of birth string (YYYY-MM-DD) */
export function validateDob(dobIso: string): { age: number | null; error: string | null } {
  if (!dobIso) {
    return { age: null, error: 'Please select your date of birth.' };
  }
  const parts = dobIso.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    return { age: null, error: 'Please enter a valid date of birth.' };
  }
  const [year, month, day] = parts;
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();

  // Check if date is in the future
  if (
    year > todayYear ||
    (year === todayYear && month > todayMonth) ||
    (year === todayYear && month === todayMonth && day > todayDay)
  ) {
    return { age: null, error: 'Date of birth cannot be in the future.' };
  }

  const age = calculateAgeFromDob(dobIso);
  if (age === null || isNaN(age)) {
    return { age: null, error: 'Please enter a valid date of birth.' };
  }

  if (age < 18) {
    return { age, error: 'Sorry, you must be at least 18 years old to join.' };
  }

  if (age > 100) {
    return { age, error: 'Please enter a valid date of birth (maximum age 100).' };
  }

  return { age, error: null };
}

/** Format ISO date YYYY-MM-DD for display e.g. "September 7, 2001" */
export function formatDob(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return isoDate;
  const [y, m, d] = parts;
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}


export function validateOTP(otp: string): string | null {
  if (otp.length !== 6) return 'Please enter the complete 6-digit OTP.';
  if (!/^\d{6}$/.test(otp)) return 'OTP must contain only digits.';
  return null;
}

export function validateInviteCode(code: string): string | null {
  if (!code) return null; // Optional
  if (code.length > 12) return 'Invite code cannot exceed 12 characters.';
  if (!/^[a-zA-Z0-9]+$/.test(code)) return 'Invite code must be alphanumeric.';
  return null;
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function randomDelay(minMs: number, maxMs: number): Promise<void> {
  const ms = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
  return delay(ms);
}
