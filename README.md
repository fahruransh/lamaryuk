# LamarYuk 💖

Catat dan pantau perjalanan lamaran kerjamu dengan manis — a job-application tracker PWA.

## Features

- **Home** — overview of your applications
- **Add / Edit Application** — log a new job application or update an existing one
- **History** — browse all past applications
- **Detail** — per-application detail view
- **Dashboard** — charts and stats on your application journey (Recharts)
- **Settings** — app preferences
- **Offline-first** — applications are stored locally in IndexedDB and synced when back online
- **PWA** — installable, works offline (vite-plugin-pwa)

## Tech

- React 18 + Vite
- React Router
- Zustand (state) + IndexedDB via `idb` (local storage)
- Recharts (dashboard charts)
- Tailwind CSS, Lucide icons
- Google APIs
- Vercel-ready (`vercel.json` included)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal (default [http://localhost:5173](http://localhost:5173)).

## Production build

```bash
npm run build
npm run preview
```
