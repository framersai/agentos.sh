import { describe, it, expect } from 'vitest';
import { shouldRenderImmediately } from '../lazy-visible-policy';

describe('shouldRenderImmediately', () => {
  it('renders immediately during SSR (no window)', () => {
    expect(shouldRenderImmediately({ hasWindow: false, hasIO: true, saveData: false })).toBe(true);
  });
  it('renders immediately when IntersectionObserver is unavailable', () => {
    expect(shouldRenderImmediately({ hasWindow: true, hasIO: false, saveData: false })).toBe(true);
  });
  it('defers (false) in a normal browser with IO', () => {
    expect(shouldRenderImmediately({ hasWindow: true, hasIO: true, saveData: false })).toBe(false);
  });
  it('still defers under save-data (we want LESS data, so gate stays on)', () => {
    expect(shouldRenderImmediately({ hasWindow: true, hasIO: true, saveData: true })).toBe(false);
  });
});
