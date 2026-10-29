// Meal reminders for TriFuel: one local notification per enabled slot per upcoming day.
// IDs sit in the 3000– range so they never collide with workout reminders (1000) or nudges (2000).
import { isoOf } from './format.js'
import { mealsOf } from './meals.js'
import { t } from './i18n-core.js'

export const MEAL_REMINDER_WINDOW_DAYS = 14
export const MEAL_REMINDER_ID_BASE = 3000
// Enough room for window × max slots (we allow up to 8 slots).
export const MEAL_REMINDER_ID_SPAN = MEAL_REMINDER_WINDOW_DAYS * 8

const hhmm = v => {
  const m = /^(\d{2}):(\d{2})$/.exec(v || '')
  return m ? [Number(m[1]), Number(m[2])] : null
}

/**
 * Pure schedule for meal reminders. Injectable `now` for tests.
 * Skips slots already logged for that calendar day.
 */
export function buildMealNotifications(S, now = new Date()) {
  const meals = mealsOf(S)
  if (!meals.reminders) return []
  const slots = meals.slots.filter(s => s.enabled)
  if (!slots.length) return []
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12)
  const notifications = []
  for (let offset = 0; offset < MEAL_REMINDER_WINDOW_DAYS; offset++) {
    const day = new Date(date)
    day.setDate(date.getDate() + offset)
    const iso = isoOf(day)
    const dayLog = meals.log[iso] || {}
    slots.forEach((slot, si) => {
      if (dayLog[slot.id]?.at || dayLog[slot.id]?.items?.length) return
      const hm = hhmm(slot.time)
      if (!hm) return
      const at = new Date(day)
      at.setHours(hm[0], hm[1], 0, 0)
      if (at <= now) return
      notifications.push({
        id: MEAL_REMINDER_ID_BASE + offset * 8 + si,
        title: t('Meal time'),
        body: t('Time for {0}. Log it in TriFuel when you’re done.', slot.name),
        schedule: { at, allowWhileIdle: true },
        extra: { kind: 'meal', slotId: slot.id, day: iso },
      })
    })
  }
  return notifications
}

export function mealReminderCancelIds() {
  return Array.from({ length: MEAL_REMINDER_ID_SPAN }, (_, i) => ({ id: MEAL_REMINDER_ID_BASE + i }))
}
