# Hoppity — a Postman-style API client

A lightweight, fully client-side HTTP client built with **React 18 + TypeScript + Vite**.
No backend — every piece of state (tabs, history, collections, theme) is persisted to
**LocalStorage**.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build
npm run preview  # preview the production build
npm run lint     # type-check only (tsc --noEmit)
```

> Requires Node.js 18+.

## Features

| # | Feature | Notes |
|---|---------|-------|
| 1 | HTTP methods | GET / POST / PUT / PATCH / DELETE via a color-coded dropdown |
| 2 | URL input + validation | Non-empty, must start with `http://`/`https://`, parseable |
| 3 | Query parameters | Add / edit / delete; final URL auto-generated with query string |
| 4 | Headers manager | Add / edit / delete; toggled per-row |
| 5 | Request body | Raw text or JSON with live validation + beautify |
| 6 | Send request | Axios-based service layer in `services/httpClient.ts` |
| 7 | Response viewer | Status, headers, pretty-printed JSON or raw text |
| 8 | Error handling | Network / timeout / client / server errors, never crashes |
| 9 | Clear request | Resets method, URL, params, headers, body |
| 10 | History | Persisted; reopen, delete one, clear all |
| 11 | Collections | Create / rename / delete; save & load requests |
| 12 | Import collections | JSON file import with structure validation |
| 13 | Export collections | Download a collection as `<name>.json` |
| 14 | Multi-tabs | Independent state per tab; open / close / switch |
| 15 | Dark mode | CSS-variable theming, persisted preference |
| 16 | Responsive | Sidebar collapses into a drawer on small screens |
| 17 | Loading state | Disabled Send button, spinner, "Sending Request…" |
| 18 | Storage utilities | Typed helpers in `storage/` |
| 19 | Type definitions | Strong interfaces in `types/`, zero `any` |
| 20 | Code quality | Modular structure, custom hooks, error boundary |

### Bonus
JSON syntax highlighting · copy-response button · response time & size ·
keyboard shortcuts (`Ctrl/Cmd + Enter` send, `+T` new tab, `+W` close tab, `+S` save) ·
drag & drop collection import.

## Project structure

```
src/
├── components/      UI + feature components (RequestBuilder, ResponseViewer, …)
├── context/         React context providers (theme, tabs, history, collections)
├── hooks/           Custom hooks (useTabs, useSendRequest, useKeyboardShortcuts, …)
├── pages/           Top-level page layout (Home)
├── services/        Axios HTTP client
├── storage/         Typed LocalStorage utilities
├── styles/          Global CSS + theme variables
├── types/           Shared TypeScript interfaces
└── utils/           URL/JSON/format/id/import-export helpers
```

## Notes on CORS

Because requests run directly from the browser, target servers must send permissive
CORS headers. A "network error" with no response usually means the server blocked the
cross-origin request — try a CORS-friendly API such as `https://jsonplaceholder.typicode.com/posts`.
