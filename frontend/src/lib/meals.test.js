import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MEAL_SLOTS, dayLogOf, markSlot, mealsOf, setReminders, setSlotEnabled, setSlotTime, slotLogged,
} from './meals.js'

describe('mealsOf', () => {
  it('fills defaults for a profile that never had meals', () => {
    const m = mealsOf({})
    expect(m.slots).toEqual(DEFAULT_MEAL_SLOTS)
    expect(m.reminders).toBe(true)
    expect(m.log).toEqual({})
  })
  it('keeps a saved slot list and reminder flag', () => {
    const m = mealsOf({ meals: { slots: [{ id: 'b', name: 'Brunch', time: '10:00', enabled: true }], reminders: false, log: { '2026-06-01': {} } } })
    expect(m.slots).toHaveLength(1)
    expect(m.slots[0].name).toBe('Brunch')
    expect(m.reminders).toBe(false)
    expect(m.log['2026-06-01']).toEqual({})
  })
})

describe('marking a slot', () => {
  it('logs and clears a meal for a day', () => {
    let S = { meals: null }
    S = { meals: markSlot(S, '2026-06-09', 'breakfast', true) }
    expect(slotLogged(S, '2026-06-09', 'breakfast')).toBe(true)
    expect(dayLogOf(S, '2026-06-09').breakfast.at).toBeTypeOf('number')
    S = { meals: markSlot(S, '2026-06-09', 'breakfast', false) }
    expect(slotLogged(S, '2026-06-09', 'breakfast')).toBe(false)
  })
})

describe('slot edits', () => {
  it('changes time and enabled', () => {
    let S = {}
    S = { meals: setSlotTime(S, 'lunch', '13:15') }
    expect(mealsOf(S).slots.find(s => s.id === 'lunch').time).toBe('13:15')
    S = { meals: setSlotEnabled(S, 'snack', true) }
    expect(mealsOf(S).slots.find(s => s.id === 'snack').enabled).toBe(true)
    S = { meals: setReminders(S, false) }
    expect(mealsOf(S).reminders).toBe(false)
  })
})
