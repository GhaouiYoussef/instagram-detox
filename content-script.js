(function () {
  const USE_XPATH = true; // set to false if XPath becomes brittle
  const DEBUG = false; // set to true to log matches
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

  function hideElement(el) {
    if (!el || el.hasAttribute(HIDDEN_ATTR)) return;
    const tag = (el.tagName || '').toUpperCase();
    if (tag === 'BODY' || tag === 'HTML' || tag === 'MAIN') return; // never hide containers that hold the entire page/feed
    el.style.display = 'none';
    el.setAttribute(HIDDEN_ATTR, 'true');
    if (DEBUG) console.log('[IG-Detox] Hidden:', el);
  }

  function findStoriesContainers(root = document) {
    const found = new Set();

    for (const sel of selectors) {
      try {
        root.querySelectorAll(sel).forEach((node) => {
          hideElement(node);
          found.add(node);
        });
      } catch (e) {
        // ignore invalid selector on older engines
      }
    }

    // Removed broad heuristic that could hide too much content

      // Try XPath-based matching from user-provided structure
      if (USE_XPATH) {
        for (const xp of xpaths) {
          try {
            const res = document.evaluate(xp, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            const node = res.singleNodeValue;
            if (node) {
              hideElement(node);
              found.add(node);
              if (DEBUG) console.log('[IG-Detox] XPath matched:', xp, node);
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
            if (node) {
              hideElement(node);
              found.add(node);
              if (DEBUG) console.log('[IG-Detox] Notes XPath matched:', xp, node);
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

  // Initial pass
  run();
})();
