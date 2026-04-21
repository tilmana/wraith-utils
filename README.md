# wraith-utils

> **Authorized use only.** This module is part of [Wraith](https://github.com/tilmana/wraith), an educational security research tool. Do not use against systems without explicit permission. See the [LICENSE](../../LICENSE) for details.

Session intelligence gatherer module for Wraith.

## What it does

One-shot collection of browser, hardware, network, locale, storage, preference, and fingerprint data from the hooked page. All data is gathered at session start via `capture.init` collectors.

## UI

- **Panel**: summary stat cards (URL, connected time, referrer)
- **View**: grouped detail sections covering display, browser, hardware, locale, network, storage, preferences, and fingerprint

## Capture

All collectors are `capture.init` (one-shot at session start, persist: true):

| Key | Fields |
|-----|--------|
| `display` | `screenWidth`, `screenHeight`, `availWidth`, `availHeight`, `colorDepth`, `pixelDepth`, `devicePixelRatio`, `windowWidth`, `windowHeight`, `outerWidth`, `outerHeight`, `orientation` |
| `browser` | `userAgent`, `language`, `languages`, `platform`, `vendor`, `cookieEnabled`, `doNotTrack`, `onLine`, `plugins` |
| `hardware` | `hardwareConcurrency`, `deviceMemory`, `maxTouchPoints` |
| `locale` | `timeZone`, `locale`, `calendar`, `utcOffset` |
| `network` | `type`, `effectiveType`, `downlink`, `rtt`, `saveData` (via `navigator.connection` — null if unavailable) |
| `storage` | `localStorage` (full contents), `sessionStorage` (full contents), `cookies` (raw string), `indexedDB` (boolean), `cookieEnabled` |
| `preferences` | `darkMode`, `reducedMotion`, `highContrast`, `forcedColors` |
| `fingerprint` | `canvas` (last 40 chars of dataURL), `webgl` (`vendor`, `renderer`, `version`, `glslVersion`) |

## Commands

None.

## Install

Register in `server/src/index.ts` and `ui/src/main.tsx`. See the main Wraith README for details.
