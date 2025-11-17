# Instagram Detox — Hide Stories & Notes

Removes Instagram Stories and Notes on desktop with a lightweight Chrome extension. Includes a popup to toggle each feature.

## Install (Unpacked)

1. Build not required — this is a plain Manifest V3 extension.
2. Open Chrome: `chrome://extensions/`.
3. Toggle `Developer mode` (top-right).
4. Click `Load unpacked` and select this folder: `c:\\YoussefENSI_backup\\instagram-detox`.
5. Navigate to `https://www.instagram.com/` and refresh.

## How It Works

- CSS rules are scoped behind HTML attributes set by the script, enabling toggling without reloading CSS.
- A MutationObserver watches DOM changes and re-applies hides if Instagram updates the layout dynamically.

## Files

- `manifest.json`: Chrome extension manifest (MV3).
- `content-script.js`: Detects and hides Stories/Notes, handles SPA navigations, reads settings from `chrome.storage`.
- `styles.css`: Attribute-scoped CSS that hides elements only when toggles are enabled.
- `popup.html` / `popup.js`: Popup UI to toggle Stories, Notes, XPath fallback, and debug logs.

## Permissions

- `storage`: to persist toggle settings from the popup.

## Troubleshooting

- If Stories reappear after an Instagram update, reload the tab. The observer should re-apply.
- If Chrome reports an error on load, ensure you selected the project root folder when loading unpacked.
- If Instagram layout changes significantly, open an issue with a screenshot/URL so selectors can be refined.

## Notes

- Targets: `https://www.instagram.com/*`, `https://instagram.com/*`, `https://m.instagram.com/*`.
- Tested in modern Chrome; uses `:has()` in CSS where available. JS + XPath fallback provide resilience.

## Popup Toggles

- Hide Stories: Enables/disables hiding the stories tray.
- Hide Notes: Enables/disables hiding the notes panel.
- Use XPath fallback: Uses XPath targets for stubborn layouts.
- Debug logs: Logs matched elements and actions to the DevTools console.

## Advanced

- Settings live in `chrome.storage.sync` and apply across Chrome profiles where sync is enabled.
- Content script avoids hiding `HTML`, `BODY`, and `MAIN` to prevent over-hiding.
