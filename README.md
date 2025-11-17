# Instagram Detox

Hide distracting Instagram UI elements (Stories, Notes, Profile Suggestions) on desktop. Stay focused on what you actually want to see.

> Zero tracking. No network calls. All logic runs locally in your browser.

---

## ✨ Features

- Hide Stories bar (avatars carousel)
- Hide Notes panel
- Hide Profile Suggestions sidebar
- Optional XPath fallback for layout shifts
- One-click popup toggles (instant, no reload of extension)
- Debug mode to inspect what was hidden

---

## 🚀 Install (Unpacked)

1. Build not required — this is a plain Manifest V3 extension.
2. Open Chrome: `chrome://extensions/`.
3. Toggle `Developer mode` (top-right).
4. Click `Load unpacked` and select this folder: `c:\\YoussefENSI_backup\\instagram-detox`.
5. Navigate to `https://www.instagram.com/` and refresh.

## 🧠 How It Works

- CSS rules are scoped behind HTML attributes set by the script, enabling toggling without reloading CSS.
- A MutationObserver watches DOM changes and re-applies hides if Instagram updates the layout dynamically.

## 📂 File Overview

- `manifest.json`: Chrome extension manifest (MV3).
- `content-script.js`: Detects and hides Stories/Notes, handles SPA navigations, reads settings from `chrome.storage`.
- `styles.css`: Attribute-scoped CSS that hides elements only when toggles are enabled.
- `popup.html` / `popup.js`: Popup UI to toggle Stories, Notes, Suggestions, XPath fallback, and debug logs.

## 🔐 Permissions & Privacy

- `storage` only: Used to remember your toggle preferences (Stories/Notes/Suggestions/XPath/Debug).
- No external requests, analytics, or tracking.
- Does not modify or intercept Instagram network calls—pure DOM/CSS manipulation.

---

## 🛠 Troubleshooting

- Stories/Notes/Suggestions reappear: Refresh the page (SPA updates may briefly re-render before the observer runs).
- Nothing hides: Ensure the extension is loaded (check `chrome://extensions/`) and the toggles are ON in the popup.
- Over‑hiding (too much removed): Turn off XPath fallback and/or Debug to see what matched.
- Layout changed: Open an issue with a screenshot + DOM snippet or XPath.

---

## 🌐 Scope & Compatibility

- Domains: `https://www.instagram.com/*`, `https://instagram.com/*`, `https://m.instagram.com/*`.
- Browser: Optimized for current Chrome. Other Chromium browsers may work (Edge, Brave, Vivaldi) but untested.
- CSS `:has()` usage: Fallback logic (JS + XPath) ensures continuity if not supported.

---

## 🧩 Popup Toggles

- Hide Stories: Stories avatar tray.
- Hide Notes: Notes bubble area.
- Hide Suggestions: Right sidebar account recommendations.
- XPath Fallback: Extra robustness if Instagram shifts markup; turn off if things over-hide.
- Debug Logs: See matches in DevTools Console (`F12` → Console).

Changes usually apply immediately; a full page refresh helps after large Instagram updates.

---

## ⚙️ Advanced / Internals

- Settings stored in `chrome.storage.sync` (sync across profiles if enabled).
- Attribute flags (`data-ig-detox-*`) drive CSS scoping for instant toggle effects.
- MutationObserver batches DOM changes for efficient re-hide cycles.
- Safety guard prevents hiding structural roots (`HTML`, `BODY`, `MAIN`).

---

## ❓ FAQ

**Will this work if Instagram redesigns?**  Often yes—selectors + XPath + heuristics provide layered fallback. If it breaks, disable XPath or send a DOM sample.

**Mobile support?**  Not targeted. Some elements may still hide on `m.instagram.com`, but layout differences aren’t guaranteed.

**Performance impact?**  Minimal. Observer runs lightweight checks; no heavy loops.

**Can I sync settings between devices?**  Yes, if Chrome Sync is enabled.

**Can I pause everything?**  Turn off all toggles (or I can add a single “Pause” toggle—open an issue if desired).

---

## 🗺 Roadmap Ideas

- Single “Focus Mode” master switch
- Optional hide for Reels tab button
- Per-domain profiles or temporary session pause
- Export/import settings JSON

Open issues or PRs to prioritize features.

---

## 🤝 Contributing

1. Fork repo
2. Create feature branch (`feat/something`)
3. Keep changes minimal & documented
4. Submit PR with screenshots if UI changes

---

## ✅ Quick Recap

Load → Toggle → Focus. That’s it.

Enjoy a calmer Instagram.
