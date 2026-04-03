import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock Fetch API
global.fetch = vi.fn();

// Mock Temporal API globally
(global as any).Temporal = {
  Now: {
    plainDateISO: vi.fn(() => ({
      toLocaleString: vi.fn((locale, options) => 'April 2'),
    })),
    zonedDateTimeISO: vi.fn(() => ({
      add: vi.fn(() => ({
        startOfDay: vi.fn(() => ({
          since: vi.fn(() => ({
            total: vi.fn(() => 3600), // Mock 1 hour revalidation
          })),
        })),
      })),
    })),
  },
};
