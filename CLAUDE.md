# CLAUDE.md — Health Akhada App

This file documents the codebase structure, conventions, and workflows for AI assistants working on this repository.

---

## Project Overview

**Health Akhada App** is a premium luxury fitness web application with the tagline "Train • Transform • Transcend". It blends traditional Indian Akhada training philosophy with modern AI-powered fitness technology. The app is 100% client-side — no backend, no external API calls, no authentication server.

**Live deployment:** Vercel + GitHub Pages (push to `main` auto-deploys).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Tailwind CSS (CDN), custom CSS |
| Logic | Vanilla JavaScript (ES6+) |
| Charts | ECharts.js v5.4.3 (CDN) |
| Animations | Anime.js v3.2.1 (CDN) |
| Fonts | Google Fonts (Bebas Neue, Inter, Oswald) |
| Storage | Browser `localStorage` |
| Build | None — static files, no bundler |
| Package manager | None — no `package.json` |

All dependencies are loaded via CDN. There is no build step and no `npm install`.

---

## Repository Structure

```
health-akhada-app/
├── index.html                   # Main dashboard (Body Intelligence Card, energy score)
├── workout.html                 # AI Form Coach (form scoring, rep counting)
├── nutrition.html               # Nutrition Hub (calorie/macro tracking, meal scanner)
├── progress.html                # Progress Analytics (charts, PRs, achievements)
├── about.html                   # Community & About (social feed, leaderboard)
├── main.js                      # Core app init, localStorage helpers, global utilities
├── body-intelligence.js         # Gabbit Ring integration & NADI/AGNI/SHAKTI AI system
├── functional-enhancements.js   # Class-based data management (WorkoutSession, NutritionTracker, etc.)
├── vercel.json                  # Vercel static site configuration
├── README.md                    # User-facing project documentation
└── .github/workflows/
    ├── ci.yml                   # CI: validates required files exist
    ├── deploy.yml               # CD: deploys to GitHub Pages on push to main
    └── notify.yml               # Deployment notification summaries
```

---

## JavaScript Architecture

### `main.js` — Core Module

Initializes the app on page load and exposes a global `window.HealthAkhada` object.

Key responsibilities:
- `initializeApp()` — entry point, loads user data or creates defaults
- `createDefaultUser()` — seeds initial user profile into localStorage
- `loadUserData()` / `saveUserData(data)` — localStorage I/O for user profile
- `getWorkoutData()` / `saveWorkoutData(data)` — workout history persistence
- `getNutritionData()` / `saveNutritionData(data)` — nutrition persistence
- `updateEnergyScore(score)` — mutates and persists energy score
- `setupAnimations()` — wires up Anime.js entrance animations
- Utilities: `formatDate()`, `formatTime()`, `calculateCaloriesBurned(duration, intensity)`

**Global object:** `window.HealthAkhada` — used by HTML pages to call shared functions.

### `body-intelligence.js` — AI Body Intelligence

Implements the three-system body intelligence engine:

| System | Measures | States |
|---|---|---|
| **NADI** | Nervous system (HRV, stress, sleep) | PUSH / NORMAL / PROTECT |
| **AGNI** | Metabolic fire (body temp, resting HR, recovery) | HIGH / MEDIUM / LOW |
| **SHAKTI** | Training readiness (recovery score, weekly load, trend) | PUSH / NORMAL / DELOAD |

Key functions:
- `calculateNADI()`, `calculateAGNI()`, `calculateSHAKTI()` — state computation
- `generateWorkoutRecommendation()` — produces AI recommendation string from NADI+AGNI+SHAKTI combination
- `syncGabbitRing()` — simulates biometric data with small random variations
- `updateBodyIntelligenceCard()` — refreshes the dashboard UI card

**Note:** Gabbit Ring data is fully simulated. No real device SDK is integrated.

### `functional-enhancements.js` — Data Classes

Four classes with `localStorage` persistence:

| Class | Purpose |
|---|---|
| `WorkoutSession` | Tracks an active workout (exercises, sets, reps, form score, calories) |
| `NutritionTracker` | Daily meals, macros, water intake with static `load()` factory |
| `ProgressTracker` | Long-term weight, measurements, photos, achievements |
| `FormAnalyzer` | Per-session form scoring and correction logging |

Achievement system: 6 pre-defined achievements (`first_workout`, `week_streak`, `fifty_workouts`, `hundred_workouts`, `goal_weight`, `year_active`) unlocked via `checkAchievements()`.

---

## localStorage Data Schema

All data lives in `localStorage` — no server, no cookies. Keys:

```
healthAkhadaUser        → { id, name, email, joinDate, membershipTier, energyScore,
                            streak, totalWorkouts, totalHours, caloriesBurned, preferences }
healthAkhadaWorkouts    → { currentWorkout, workoutHistory, personalRecords }
healthAkhadaNutrition   → { dailyGoal, caloriesConsumed, macros, waterIntake, meals }
gabbitRingData          → { hrv, restingHR, bodyTemp, sleepQuality, sleepDuration,
                            stressLevel, recoveryScore, weeklyLoad, trend }
bodyIntelligence        → { nadi, agni, shakti, recommendation, timestamp }
nutritionTracker        → NutritionTracker serialized state
progressTracker         → ProgressTracker serialized state
```

Default values (defined in `main.js`):
- Daily calorie goal: 2,500 kcal
- Macro targets: Protein 180g, Carbs 250g, Fat 70g
- Intensity calorie factors: low=5, medium=8, high=12 (kcal/min)

---

## Design System

**Color palette:**

| Token | Value | Usage |
|---|---|---|
| Primary Black | `#000000` | Backgrounds |
| Accent Gold | `#D4AF37` | Highlights, CTAs, borders |
| Glass BG | `rgba(0,0,0,0.6)` | Card backgrounds |
| Status Green | Tailwind `green-*` | PUSH / HIGH states |
| Status Blue | Tailwind `blue-*` | NORMAL / LOW states |
| Status Red | Tailwind `red-*` | PROTECT / critical |
| Status Orange | Tailwind `orange-*` | HIGH AGNI / warnings |

**Typography:**
- Headings: `Bebas Neue` (bold, uppercase)
- Body text: `Inter`
- Accent labels: `Oswald`

**UI patterns:**
- Glass-morphism cards with `backdrop-blur`
- SVG-based circular progress rings
- Gradient buttons (gold)
- Emoji iconography (no SVG icon library)
- Anime.js entrance animations on page load

---

## Simulated vs. Real Features

| Feature | Status |
|---|---|
| localStorage data persistence | Real |
| Achievement unlock logic | Real |
| Energy score & macro calculations | Real |
| Weight/measurement tracking | Real |
| Page navigation | Real |
| Gabbit Ring biometric data | Simulated (random variations) |
| Camera feed / skeleton overlay | Placeholder (emoji) |
| AI form scoring | Simulated (random values) |
| Meal photo scanner | UI only |
| Leaderboard data | Hardcoded |
| AI grocery list | UI placeholder |

When extending features, keep this distinction clear. Mark UI-only sections with a `// SIMULATED` comment.

---

## Development Workflow

### Running Locally

No build step needed. Serve the static files with any HTTP server:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

Or use VS Code Live Server extension, `npx serve`, etc.

### Making Changes

1. Edit HTML, CSS (Tailwind classes inline), or JS files directly.
2. Refresh browser — no rebuild required.
3. Test `localStorage` state via browser DevTools → Application → Local Storage.
4. Clear localStorage with `localStorage.clear()` in the console to reset app state.

### Branch Convention

- `main` — production branch, auto-deploys to Vercel & GitHub Pages
- Feature branches: `feature/<description>` or `claude/<description>`
- Always develop on a feature branch, never directly on `main`

### Commit Style

Follow conventional commits:
```
feat: add calorie tracking export
fix: correct macro calculation rounding
docs: update CLAUDE.md with new data schema
style: adjust gold accent opacity on mobile
```

---

## CI/CD Pipelines

### `ci.yml` — Continuous Integration
- Triggers: push to `main`/`develop`, pull requests
- Validates that all required HTML and JS files exist
- Node.js 18 environment (used only for CI tooling, not the app itself)

### `deploy.yml` — GitHub Pages Deployment
- Triggers: push to `main`, manual dispatch
- Uploads entire repo as static artifact and deploys to GitHub Pages
- Only one concurrent deployment allowed (concurrency lock)

### `notify.yml` — Deployment Notifications
- Triggers: push to `main`, deployment status events
- Generates a deployment summary in the GitHub Actions step summary

---

## Adding New Pages

1. Create `<pagename>.html` following the structure of an existing page.
2. Include the same CDN scripts (Tailwind, Anime.js, ECharts) in `<head>`.
3. Add the bottom navigation bar (`<nav>`) with the new page highlighted.
4. Link `main.js` and any feature-specific JS at the bottom of `<body>`.
5. Update the CI validation in `.github/workflows/ci.yml` to check the new file.
6. Update `vercel.json` if needed (currently matches `*.html` and `*.js` automatically).

---

## Adding New JavaScript Modules

1. Create a new `.js` file in the project root.
2. Attach any public API to a named namespace on `window` (e.g., `window.MyFeature = { ... }`).
3. Include the script tag in every HTML page that needs it.
4. Persist state to `localStorage` using a unique, namespaced key.
5. Document the localStorage key in the schema section of this file.

---

## Key Conventions

- **No modules/imports** — all JS is global-scope via `window.*` namespacing.
- **No TypeScript** — plain ES6+ JavaScript only.
- **No build tools** — do not introduce webpack, Vite, Rollup, etc. without a deliberate decision.
- **Tailwind via CDN** — do not add a Tailwind build pipeline unless explicitly required.
- **localStorage only** — do not add external API calls or a backend without a deliberate architectural decision.
- **Dark theme by default** — all UI components must respect the black/gold design system.
- **Mobile-first** — Tailwind responsive classes should target mobile (`sm:`, `md:`) before desktop.
- **Keep simulated features clearly marked** — comment `// SIMULATED` near placeholder implementations.
