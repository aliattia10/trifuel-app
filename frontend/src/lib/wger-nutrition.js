// Stub: TriFuel’s wger nutrition backend (Render / Cloudflare Worker).
// Meals today sync inside openGym’s profile (`S.meals`). When we wire this up, the Meals tab
// will pull nutrition plans / diary entries from the same account as the Flutter client.
export const WGER_BASE = 'https://trifuel.trifuel.workers.dev'

export async function fetchNutritionPlans(_token) {
  // Not connected yet — returns empty so the UI can stay local-first.
  return { results: [], source: 'local' }
}

export function wgerNutritionEnabled() {
  return false
}
