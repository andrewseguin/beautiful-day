export const mobileMatch = '(max-width: 700px)';

export function isMobile(): boolean {
  return window.matchMedia(mobileMatch).matches;
}
