import { useStore } from '../store/useStore.js'
import { todayISO } from '../lib/format.js'
import { t } from '../lib/i18n.js'
import {
  mealsOf, markSlot, setReminders, setSlotEnabled, setSlotTime, slotLogged,
} from '../lib/meals.js'
import { syncReminder } from '../lib/mobile.js'
import Icon from '../components/Icon.jsx'
import { Button } from '../components/ui.jsx'

export default function Meals() {
  const S = useStore(s => s.S)
  const update = useStore(s => s.update)
  const meals = mealsOf(S)
  const today = todayISO()

  const persist = (next, interactive = false) => {
    update(s => { s.meals = next })
    syncReminder({ ...S, meals: next }, interactive).catch(() => {})
  }

  return (
    <div className="narrow">
      <div className="hdr">
        <div style={{ flex: 1 }}>
          <h1>{t('Meals')}</h1>
          <div className="sub">{t('Fuel the work. Reminders stay on this phone.')}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="row between" style={{ marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 600 }}>{t('Today')}</div>
            <div className="muted small">{today}</div>
          </div>
          <Icon name="flame" style={{ color: 'var(--acc)', fontSize: 22 }} />
        </div>
        {meals.slots.filter(s => s.enabled).map(slot => {
          const done = slotLogged(S, today, slot.id)
          return (
            <div key={slot.id} className="lrow tap" onClick={() => persist(markSlot(S, today, slot.id, !done))}>
              <span className="lrow-i" style={{ color: done ? 'var(--acc)' : 'var(--label-2)' }}>
                <Icon name={done ? 'checkCircle' : 'bowl'} />
              </span>
              <span className="lrow-m">
                <span className="lrow-t">{slot.name}</span>
                <span className="lrow-s">{slot.time}{done ? ' · ' + t('Logged') : ''}</span>
              </span>
              <span className="lrow-k"><Icon name={done ? 'check' : 'plus'} /></span>
            </div>
          )
        })}
        {!meals.slots.some(s => s.enabled) && (
          <div className="muted small">{t('Turn on a meal slot below to start logging.')}</div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 14 }}>
        <div className="lrow tap" onClick={() => persist(setReminders(S, !meals.reminders), true)}>
          <span className="lrow-i" style={{ color: 'var(--acc)' }}><Icon name="bell" /></span>
          <span className="lrow-m">
            <span className="lrow-t">{t('Meal reminders')}</span>
            <span className="lrow-s">{t('Notify at each enabled meal time')}</span>
          </span>
          <span className="lrow-v">{meals.reminders ? t('On') : t('Off')}</span>
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, marginBottom: 6 }}>{t('Meal slots')}</div>
        {meals.slots.map(slot => (
          <div key={slot.id} className="lrow">
            <span className="lrow-i" style={{ color: slot.enabled ? 'var(--acc)' : 'var(--label-3)' }}>
              <Icon name="bowl" />
            </span>
            <span className="lrow-m">
              <span className="lrow-t">{slot.name}</span>
              <span className="lrow-s">
                <input
                  type="time"
                  value={slot.time}
                  aria-label={t('Time for {0}', slot.name)}
                  onChange={e => persist(setSlotTime(S, slot.id, e.target.value))}
                  style={{
                    background: 'transparent', border: 'none', color: 'var(--label-2)',
                    fontSize: 13, padding: 0, fontFamily: 'inherit',
                  }}
                />
              </span>
            </span>
            <Button
              size="sm"
              variant={slot.enabled ? 'primary' : 'ghost'}
              onClick={() => persist(setSlotEnabled(S, slot.id, !slot.enabled), true)}
            >
              {slot.enabled ? t('On') : t('Off')}
            </Button>
          </div>
        ))}
      </div>

      <p className="muted small" style={{ marginTop: 16, lineHeight: 1.45, padding: '0 4px' }}>
        {t('Meals sync with your TriFuel profile. Linking to wger nutrition diaries comes next.')}
      </p>
    </div>
  )
}
