/**
 * Clamp a raw devicePixelRatio for canvas backing-store sizing. Mobile
 * (<640px) caps at 1.5 because canvas fill cost scales with dpr^2 and the
 * hero animations were the dominant main-thread cost on low-end mobile.
 * Desktop keeps the prior cap of 2. Bogus input floors at 1.
 */
export function clampDpr(rawDpr: number, viewportWidth: number): number {
  const safe = Number.isFinite(rawDpr) && rawDpr >= 1 ? rawDpr : 1;
  const ceiling = viewportWidth < 640 ? 1.5 : 2;
  return Math.min(safe, ceiling);
}
