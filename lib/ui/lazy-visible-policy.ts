export interface LazyVisibleEnv {
  hasWindow: boolean;
  hasIO: boolean;
  saveData: boolean;
}

/**
 * Decide whether a LazyVisible boundary should render its children eagerly
 * instead of waiting for the IntersectionObserver. Eager when there is no
 * window (SSR/static export — children must be in the HTML for crawlers) or no
 * IntersectionObserver (defensive; ancient browsers). saveData does NOT force
 * eager: gating means less code/data, which is what save-data wants.
 */
export function shouldRenderImmediately(env: LazyVisibleEnv): boolean {
  if (!env.hasWindow) return true;
  if (!env.hasIO) return true;
  return false;
}
