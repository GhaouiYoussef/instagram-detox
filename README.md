# Instagram Detox — Hide Stories

Removes the Stories section from Instagram on desktop using a lightweight Chrome extension.

## Install (Unpacked)

1. Build not required — this is a plain Manifest V3 extension.
2. Open Chrome: `chrome://extensions/`.
3. Toggle `Developer mode` (top-right).
4. Click `Load unpacked` and select this folder: `c:\\YoussefENSI_backup\\instagram-detox`.
5. Navigate to `https://www.instagram.com/` and refresh.

## How It Works

- Content CSS hides likely Stories containers via accessible labels and structure.
- A MutationObserver watches DOM changes and hides Stories if Instagram updates the layout dynamically.

## Files

- `manifest.json`: Chrome extension manifest (MV3).
- `content-script.js`: JS that detects and hides the Stories tray, including SPA navigations.
- `styles.css`: CSS selectors to hide Stories where possible without JS.

## Permissions

No extra permissions beyond content script matching are used.

## Troubleshooting

- If Stories reappear after an Instagram update, reload the tab. The observer should re-apply.
- If Chrome reports an error on load, ensure you selected the project root folder when loading unpacked.
- If Instagram layout changes significantly, open an issue with a screenshot/URL so selectors can be refined.

## Notes

- Targets: `https://www.instagram.com/*`, `https://instagram.com/*`, `https://m.instagram.com/*`.
- Tested in modern Chrome; uses `:has()` in CSS where available. JS provides fallback.

# key
**Hardening added**

- USE_XPATH flag: If Instagram changes and the absolute XPath starts misfiring, set USE_XPATH = false at the top of content-script.js.
- DEBUG flag: Set DEBUG = true to log exactly which node was hidden for quick verification.
