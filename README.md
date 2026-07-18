# CalcVerse

A premium, 100% offline Calculator & Converter Android app — 45+ tools across Calculators, Unit Converters, Developer Tools, and Text Tools. Built with React + Vite + TypeScript + Tailwind v4 + Framer Motion, packaged for Android with Capacitor.

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Framer Motion for all animation
- Zustand (persisted) for favorites, recents, history & settings
- Capacitor 8 for the native Android shell (Haptics, Status Bar, Splash Screen)
- Self-hosted fonts (`@fontsource`) — no network calls, works fully offline

## What's included

- **27 Calculators**: Basic, Scientific, Percentage, Discount, GST, EMI, Loan, SIP, FD, RD, Simple/Compound Interest, Profit & Loss, Margin, Age, BMI, BMR, Calories, Water Intake, Date Difference, Time Calculator, Fuel Cost, Tip, Split Bill, CGPA, Attendance, Electricity Bill.
- **13 Unit Converter categories**: Length, Weight, Area, Volume, Temperature, Speed, Pressure, Energy, Power, Data Storage, Time, Angle, Frequency.
- **8 Developer Tools**: Base64, Binary/Hex/Octal, ASCII, UUID, Password Generator, Hash Generator (SHA-1/256/384/512), Roman Numerals, Random Number.
- **5 Text Tools**: Character Counter, Word Counter, Reverse Text, Remove Extra Spaces, Case Converter.
- Home (greeting, recents, favorites, popular), Categories, Favorites, Settings (theme, animations, haptics), instant Search.
- Every calculator page includes a formula/example accordion, copy/share result, and per-tool history.

## Getting started

```bash
npm install
npm run dev        # local dev server
npm run build      # production web build -> dist/
```

## Building the Android APK

The native Android project already exists in `android/`. To build and run it you'll need Android Studio (or the Android command-line SDK) installed locally — that part can't be done inside this sandbox since it requires the Android SDK/Gradle toolchain and Google's Maven repositories.

```bash
npm run build          # rebuild the web app
npx cap sync android    # copy the latest web build into the native project
npx cap open android    # opens the project in Android Studio
```

From Android Studio: **Build → Generate Signed Bundle / APK**, choose APK, create/select a keystore, and build the release variant. You can also run `./gradlew assembleDebug` from inside `android/` once the Android SDK is installed to produce an installable debug APK directly.

App id: `com.calcverse.app` · Version: `1.0.0`

## Project structure

```
src/
  components/      Reusable UI (BottomNav, cards, form fields, result tape, etc.)
  pages/            Screens, grouped by calculators / converters / devtools / texttools
  constants/        Tool registry, calculator definitions, unit conversion tables
  hooks/            Zustand store, theme hook
  utils/            Formatting, safe math expression evaluator, haptics
  animations/       Shared Framer Motion variants
```

## Testing

A route-level smoke test mounts the real app (via `HashRouter`) at all 63 routes and fails if any route throws or logs a real console error:

```bash
npm test
```

This is how a critical bug was caught and fixed: every generic calculator page (everything except Basic/Scientific) was hitting an infinite re-render loop because its Zustand selector filtered the history array inline (`s.history.filter(...)`), returning a new array reference on every render. That's fixed now — the store's array is selected directly and filtered locally with `useMemo`. All 63 routes pass.

## Notes on scope

This is a large, from-scratch build. Every tool listed above is fully implemented with real logic (not placeholders) — EMI/SIP/FD/RD use standard financial formulas, hashes use the Web Crypto API, unit conversions cover 60+ individual units. A couple of areas to flag honestly:
- The RD (Recurring Deposit) formula uses the common quarterly-compounding approximation used by Indian banks; actual bank payouts can vary slightly by institution.
- "Hash Generator" covers SHA-1/256/384/512 (via the browser's native, audited Web Crypto API) rather than MD5, which isn't natively available in-browser.
- App icon/splash use a generated placeholder mark (Σ) — swap `android/app/src/main/res/mipmap-*` and `drawable/splash.png` with real brand assets before publishing.
