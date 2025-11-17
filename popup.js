const DEFAULTS = {
  hideStories: true,
  hideNotes: true,
  useXPath: true,
  debugMode: false,
};

function get(key) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(key, (res) => resolve(res[key]));
  });
}

function set(obj) {
  return new Promise((resolve) => {
    chrome.storage.sync.set(obj, resolve);
  });
}

async function init() {
  const hideStories = (await get('hideStories')) ?? DEFAULTS.hideStories;
  const hideNotes = (await get('hideNotes')) ?? DEFAULTS.hideNotes;
  const useXPath = (await get('useXPath')) ?? DEFAULTS.useXPath;
  const debugMode = (await get('debugMode')) ?? DEFAULTS.debugMode;

  document.getElementById('hideStories').checked = hideStories;
  document.getElementById('hideNotes').checked = hideNotes;
  document.getElementById('useXPath').checked = useXPath;
  document.getElementById('debugMode').checked = debugMode;

  document.getElementById('hideStories').addEventListener('change', (e) => set({ hideStories: e.target.checked }));
  document.getElementById('hideNotes').addEventListener('change', (e) => set({ hideNotes: e.target.checked }));
  document.getElementById('useXPath').addEventListener('change', (e) => set({ useXPath: e.target.checked }));
  document.getElementById('debugMode').addEventListener('change', (e) => set({ debugMode: e.target.checked }));
}

document.addEventListener('DOMContentLoaded', init);
