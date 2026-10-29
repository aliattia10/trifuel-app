# TriFuel (fork of openGym)

This repository is a fork of [openGym](https://github.com/DuarteSantos8/openGym) rebranded and extended for **TriFuel**.

## License

openGym is **AGPL-3.0**. TriFuel inherits that: if you distribute a modified version (including a hosted service that users interact with), you must offer the corresponding source under AGPL-3.0. See `LICENSE` and `NOTICE.md`.

Exercise demo media in the catalogue may be subject to Gym Visual / other third-party terms — do not assume you can redistribute those assets outside this project’s existing packaging.

## What’s different

- App name / package: **TriFuel** (`app.trifuel.mobile`)
- Default accent: blue (`sky`) on charcoal dark theme
- **Meals** tab: daily meal slots, logging, and local notification reminders
- Upstream remote kept as `upstream` for pulling openGym fixes

## Backend

openGym’s own sync API remains the primary backend for training data.

Meal data lives in the synced profile (`S.meals`) like weigh-ins and notes. A bridge to the TriFuel wger nutrition API (`https://trifuel.trifuel.workers.dev`) is stubbed in `frontend/src/lib/wger-nutrition.js` for a later phase.

## Dev

```bash
cd frontend
npm install
npm run dev
```

Mobile: `npm run build:mobile` then open `frontend/ios` / `frontend/android`.
