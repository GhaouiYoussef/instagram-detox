(function () {
  // Defaults; can be overridden via chrome.storage (popup)
  let SETTINGS = {
    hideStories: true,
    hideNotes: true,
    hideSuggestions: true,
    useXPath: true,
    debugMode: false,
  };
  const HIDDEN_ATTR = 'data-ig-detox-hidden';

  // Story + Notes selectors (safe, narrow where possible)
  const selectors = [
    '[aria-label="Stories"]',
    '[aria-label="stories" i]',
    'section:has(ul li a[href^="/stories/"])',
    'section:has(ul li a[aria-label*="stories" i])',
    'div:has(> div > ul li a[href^="/stories/"])',
    // Notes-related guesses (kept conservative)
    '[aria-label="Notes"]',
    '[role="region"][aria-label="Notes"]'
  ];

  const xpaths = [
    "//*[@id='mount_0_0_Jz']/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div[1]/div/div/div[1]/div",
    "//*[starts-with(@id,'mount_')]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div[1]/div/div/div[1]/div"
  ];

  // Notes-specific XPath from user (exact path on current layout)
  const xpathsNotes = [
    "/html/body/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div/section/div/div/div/div[1]/div[1]/div/div[4]/div[1]"
  ];

  // Profile suggestions (right sidebar) XPath provided by user
  const xpathsSuggestions = [
    "/html/body/div[1]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/section/main/div[1]/div[2]/div"
  ];

  function debug(...args) { if (SETTINGS.debugMode) console.log('[IG-Detox]', ...args); }

  function hideElement(el) {
    if (!el || el.hasAttribute(HIDDEN_ATTR)) return;
    const tag = (el.tagName || '').toUpperCase();
    if (tag === 'BODY' || tag === 'HTML' || tag === 'MAIN') return; // never hide containers that hold the entire page/feed
    el.style.display = 'none';
    el.setAttribute(HIDDEN_ATTR, 'true');
    debug('Hidden:', el);
  }

  function unhideAll() {
    document.querySelectorAll('[' + HIDDEN_ATTR + ']').forEach((el) => {
      el.style.display = '';
      el.removeAttribute(HIDDEN_ATTR);
    });
  }

  function findStoriesContainers(root = document) {
    const found = new Set();

    // Apply attribute flags for CSS-scoped rules
    document.documentElement.setAttribute('data-ig-detox-stories', SETTINGS.hideStories ? 'true' : 'false');
    document.documentElement.setAttribute('data-ig-detox-notes', SETTINGS.hideNotes ? 'true' : 'false');
    document.documentElement.setAttribute('data-ig-detox-suggestions', SETTINGS.hideSuggestions ? 'true' : 'false');

    for (const sel of selectors) {
      try {
        // Only apply the CSS-like hides via JS if they correspond to enabled categories
        const lower = sel.toLowerCase();
        const isStorySel = lower.includes('stories') || lower.includes('/stories/');
        const isNotesSel = lower.includes('notes');
        const isSuggestionsSel = lower.includes('suggest');
        if ((isStorySel && !SETTINGS.hideStories) ||
            (isNotesSel && !SETTINGS.hideNotes) ||
            (isSuggestionsSel && !SETTINGS.hideSuggestions)) {
          // skip
        } else {
          root.querySelectorAll(sel).forEach((node) => {
            hideElement(node);
            found.add(node);
          });
        }
      } catch (e) {
        // ignore invalid selector on older engines
      }
    }

    // Removed broad heuristic that could hide too much content

      // Try XPath-based matching from user-provided structure
      if (SETTINGS.useXPath) {
        for (const xp of xpaths) {
          try {
            const res = document.evaluate(xp, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const node = res.singleNodeValue;
            if (node && SETTINGS.hideStories) {
              hideElement(node);
              found.add(node);
              debug('XPath matched (stories):', xp, node);
            }
          } catch (e) {
            // ignore XPath issues
          }
        }
        // Notes XPath fallback(s)
        for (const xp of xpathsNotes) {
          try {
            const res = document.evaluate(xp, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const node = res.singleNodeValue;
            if (node && SETTINGS.hideNotes) {
              hideElement(node);
              found.add(node);
              debug('XPath matched (notes):', xp, node);
            }
          } catch (e) {
            // ignore XPath issues
          }
        }
        // Suggestions XPath fallback(s)
        for (const xp of xpathsSuggestions) {
          try {
            const res = document.evaluate(xp, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const node = res.singleNodeValue;
            if (node && SETTINGS.hideSuggestions) {
              hideElement(node);
              found.add(node);
              debug('XPath matched (suggestions):', xp, node);
            }
          } catch (e) {
            // ignore XPath issues
          }
        }
      }

    return Array.from(found);
  }

  function run() {
    findStoriesContainers();
  }

  // Observe DOM changes for SPA updates
  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      run();
    });
  };

  const observer = new MutationObserver(schedule);
  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
      run();
    });
  }

  // React to URL changes (client-side navigation)
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      run();
    }
  }, 800);

  // Settings management
  function loadSettingsAndRun() {
    try {
      chrome.storage.sync.get(['hideStories','hideNotes','hideSuggestions','useXPath','debugMode'], (res) => {
        SETTINGS = {
          hideStories: res.hideStories ?? SETTINGS.hideStories,
          hideNotes: res.hideNotes ?? SETTINGS.hideNotes,
          hideSuggestions: res.hideSuggestions ?? SETTINGS.hideSuggestions,
          useXPath: res.useXPath ?? SETTINGS.useXPath,
          debugMode: res.debugMode ?? SETTINGS.debugMode,
        };
        // Reset prior inline hides if a feature was turned off
        unhideAll();
        run();
      });
    } catch (e) {
      // If chrome.storage is unavailable, proceed with defaults
      run();
    }
  }

  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'sync') return;
      let changed = false;
      for (const k of ['hideStories','hideNotes','hideSuggestions','useXPath','debugMode']) {
        if (k in changes) { SETTINGS[k] = changes[k].newValue; changed = true; }
      }
      if (changed) {
        unhideAll();
        schedule();
      }
    });
  } catch (e) {}

  // Initial pass (with settings)
  loadSettingsAndRun();
})();
