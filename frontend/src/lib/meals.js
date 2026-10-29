// TriFuel meals: daily slots (breakfast / lunch / …), a per-day log, and reminder flags.
// Stored on the synced profile (`S.meals`) the same way weigh-ins and day notes are — no separate
// server schema yet. A later phase can push/pull against wger nutrition (lib/wger-nutrition.js).

import { uid } from './format.js'

export const DEFAULT_MEAL_SLOTS = [
  { id: 'breakfast', name: 'Breakfast', time: '08:00', enabled: true },
  { id: 'lunch', name: 'Lunch', time: '12:30', enabled: true },
  { id: 'dinner', name: 'Dinner', time: '19:00', enabled: true },
  { id: 'snack', name: 'Snack', time: '16:00', enabled: false },
]

/** Shape every profile ends up with, including ones from before TriFuel. */
export function mealsOf(S) {
  const m = S?.meals
  const slots = Array.isArray(m?.slots) && m.slots.length
    ? m.slots.map(normalizeSlot).filter(Boolean)
    : DEFAULT_MEAL_SLOTS.map(s => ({ ...s }))
  return {
    slots,
    reminders: m?.reminders !== false,
    log: m?.log && typeof m.log === 'object' ? m.log : {},
  }
}

function normalizeSlot(s) {
  if (!s || typeof s !== 'object') return null
  const id = typeof s.id === 'string' && s.id ? s.id : uid()
  const name = typeof s.name === 'string' && s.name.trim() ? s.name.trim() : 'Meal'
  const time = /^\d{2}:\d{2}$/.test(s.time) ? s.time : '12:00'
  return { id, name, time, enabled: s.enabled !== false }
}

/** Entries logged for `iso` (YYYY-MM-DD), keyed by slot id. */
export function dayLogOf(S, iso) {
  const log = mealsOf(S).log[iso]
  return log && typeof log === 'object' ? log : {}
}

export function slotLogged(S, iso, slotId) {
  const e = dayLogOf(S, iso)[slotId]
  return !!(e && (e.items?.length || e.note || e.at))
}

/** Toggle or write a quick “done” mark for a slot on a day. */
export function markSlot(S, iso, slotId, done = true) {
  const meals = mealsOf(S)
  const day = { ...(meals.log[iso] || {}) }
  if (done) {
    day[slotId] = { ...(day[slotId] || {}), at: Date.now(), items: day[slotId]?.items || [] }
  } else {
    delete day[slotId]
  }
  const log = { ...meals.log }
  if (Object.keys(day).length) log[iso] = day
  else delete log[iso]
  return { ...meals, log }
}

export function setSlotTime(S, slotId, time) {
  const meals = mealsOf(S)
  if (!/^\d{2}:\d{2}$/.test(time)) return meals
  return {
    ...meals,
    slots: meals.slots.map(s => (s.id === slotId ? { ...s, time } : s)),
  }
}

export function setSlotEnabled(S, slotId, enabled) {
  const meals = mealsOf(S)
  return {
    ...meals,
    slots: meals.slots.map(s => (s.id === slotId ? { ...s, enabled: !!enabled } : s)),
  }
}

export function setReminders(S, on) {
  return { ...mealsOf(S), reminders: !!on }
}
