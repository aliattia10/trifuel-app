// TriFuel product branding. Upstream is openGym (AGPL); user-facing copy says TriFuel.
export const APP_NAME = 'TriFuel'
export const APP_ID = 'app.trifuel.mobile'
/** Rewrite leftover upstream product name in translated UI strings. */
export function brandCopy(s) {
  if (typeof s !== 'string' || !s.includes('openGym') && !s.includes('OpenGym') && !s.includes('opengym')) return s
  return s
    .replace(/\bopenGym\b/g, APP_NAME)
    .replace(/\bOpenGym\b/g, APP_NAME)
    .replace(/\bopengym\.ch\b/g, 'trifuel.app')
}
