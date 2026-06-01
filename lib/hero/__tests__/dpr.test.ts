import { describe, it, expect } from 'vitest';
import { clampDpr } from '../dpr';

describe('clampDpr', () => {
  it('caps desktop (>=640px) at 2', () => {
    expect(clampDpr(3, 1280)).toBe(2);
    expect(clampDpr(1, 1280)).toBe(1);
  });
  it('caps mobile (<640px) at 1.5 to halve fill cost', () => {
    expect(clampDpr(3, 390)).toBe(1.5);
    expect(clampDpr(2, 390)).toBe(1.5);
  });
  it('never returns below 1, even for bogus input', () => {
    expect(clampDpr(0, 390)).toBe(1);
    expect(clampDpr(NaN, 1280)).toBe(1);
    expect(clampDpr(undefined as unknown as number, 1280)).toBe(1);
  });
});
