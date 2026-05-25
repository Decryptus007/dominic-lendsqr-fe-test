import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';
import mockUsers from '../public/mock-users.json';

// Type-safe fetch mock using standard globalThis (recognized natively by TypeScript)
globalThis.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockUsers),
    statusText: 'OK',
  } as Response)
);

// Clear localStorage before each test to maintain clean state
beforeEach(() => {
  localStorage.clear();
});
