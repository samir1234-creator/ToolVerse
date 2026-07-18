import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, act } from '@testing-library/react';
import App from '@/App';
import { tools } from '@/constants/tools';
import { unitCategories } from '@/constants/converters';

const staticRoutes = ['/', '/categories', '/favorites', '/settings', '/search', '/calculator/basic', '/calculator/scientific'];
const categoryRoutes = ['calculators', 'converters', 'devtools', 'texttools'].map((c) => `/category/${c}`);
const toolRoutes = tools.map((t) => t.route);
const allRoutes = Array.from(new Set([...staticRoutes, ...categoryRoutes, ...toolRoutes]));

describe('every route renders without throwing', () => {
  let errors: unknown[] = [];
  let originalError: typeof console.error;

  beforeEach(() => {
    errors = [];
    originalError = console.error;
    console.error = (...args: unknown[]) => {
      errors.push(args);
      originalError(...args);
    };
  });

  afterEach(() => {
    console.error = originalError;
    cleanup();
  });

  for (const route of allRoutes) {
    it(`renders ${route}`, async () => {
      window.location.hash = `#${route}`;
      let container: HTMLElement | undefined;
      await act(async () => {
        const result = render(<App />);
        container = result.container;
        await new Promise((r) => setTimeout(r, 1200)); // let splash screen clear + effects flush
      });
      expect(container?.innerHTML.length).toBeGreaterThan(0);
      const seriousErrors = errors.filter(
        (e) =>
          !String((e as unknown[])[0]).includes('not wrapped in act') &&
          !String((e as unknown[])[0]).includes('React Router Future Flag')
      );
      expect(seriousErrors).toEqual([]);
    });
  }

  it('sanity: covered every unit category route', () => {
    for (const c of unitCategories) {
      expect(toolRoutes).toContain(`/converter/${c.id}`);
    }
  });
});
