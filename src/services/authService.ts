/**
 * authService — mock authentication layer.
 *
 * Uses localStorage to persist the session across page refreshes.
 * In a real app this would be replaced with a JWT/cookie-based solution.
 *
 * Key: 'lsqr_auth_token'
 * Value: a truthy string when logged-in, absent when logged-out.
 */

const AUTH_KEY = 'lsqr_auth_token';

/** Returns true if a session token exists in localStorage. */
export const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem(AUTH_KEY));
};

/**
 * Simulates a login request.
 * Accepts any non-empty email + password (mock — no real validation).
 * Stores a token and resolves after a short artificial delay.
 */
export const login = (email: string, password: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && password) {
        // Store a simple token — value doesn't matter for a mock
        localStorage.setItem(AUTH_KEY, btoa(`${email}:${Date.now()}`));
        resolve();
      } else {
        reject(new Error('Email and password are required.'));
      }
    }, 800); // simulate network latency
  });
};

/** Clears the session token and cached user data, effectively logging the user out. */
export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem('lendsqr_users');
};
