import { describe, expect, it } from 'vitest'
import { buildMealNotifications, MEAL_REMINDER_ID_BASE } from './meal-reminders.js'
import { markSlot } from './meals.js'

describe('buildMealNotifications', () => {
  it('schedules enabled slots ahead of now', () => {
    const now = new Date(2026, 5, 9, 7, 0, 0) // 09 Jun 2026 07:00
    const notes = buildMealNotifications({ meals: { reminders: true } }, now)
    expect(notes.length).toBeGreaterThan(0)
    expect(notes[0].id).toBeGreaterThanOrEqual(MEAL_REMINDER_ID_BASE)
    expect(notes.every(n => n.schedule.at > now)).toBe(true)
  })
  it('skips a slot already logged today', () => {
    const now = new Date(2026, 5, 9, 7, 0, 0)
    const iso = '2026-06-09'
    const S = { meals: markSlot({}, iso, 'breakfast', true) }
    const notes = buildMealNotifications(S, now)
    expect(notes.some(n => n.extra?.slotId === 'breakfast' && n.extra?.day === iso)).toBe(false)
  })
  it('schedules nothing when reminders are off', () => {
    expect(buildMealNotifications({ meals: { reminders: false } }, new Date())).toEqual([])
  })
})
