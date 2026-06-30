// Service worker for MAID - Manifest V3

// Set to true to enable verbose console logging during development.
const DEBUG = false;

// Single source of truth for reserved storage keys (file-type filter flags).
// Any key NOT in this set is treated as a URL → folder rule.
const FILE_TYPE_KEYS = new Set(['torrents', 'images', 'music', 'docs', 'arch']);

// Open or focus options page using the dedicated API (no "tabs" permission needed)
function openOrFocusOptionsPage() {
  chrome.runtime.openOptionsPage();
}

// Called when the user clicks on the browser action icon.
chrome.action.onClicked.addListener(function () {
  openOrFocusOptionsPage();
});

// Handle service worker lifecycle
self.addEventListener('install', (event) => {
  if (DEBUG) console.log('MAID service worker installing...');
  self.skipWaiting(); // Forces service worker activation
});

self.addEventListener('activate', (event) => {
  if (DEBUG) console.log('MAID service worker activated!');
  event.waitUntil(clients.claim()); // Take control immediately
});

// Main download interception logic
// The listener returns true to use the suggest callback asynchronously.
// The service worker is kept alive by the browser for the duration of the
// onDeterminingFilename event — no setInterval heartbeat is needed or effective.
chrome.downloads.onDeterminingFilename.addListener((item, suggest) => {
  if (DEBUG) console.log('MAID: Download intercepted!', item.filename, 'from', item.url);

  const currentUrl = item.url;
  const originalFilename = item.filename;

  // Get all storage data
  chrome.storage.local.get(null, (storage) => {

    // --- Priority 1: URL-based rules ---
    // Collect all URL rule keys (exclude the file-type flags), then sort them
    // alphabetically so that matching is stable and predictable across runs.
    const urlRuleKeys = Object.keys(storage)
      .filter(key => !FILE_TYPE_KEYS.has(key))
      .sort(); // stable, deterministic order

    let finalFilename = originalFilename;
    let urlMatched = false;

    for (const key of urlRuleKeys) {
      if (currentUrl.includes(key)) {
        if (DEBUG) console.log('URL match found:', key, '->', storage[key]);
        finalFilename = storage[key] + '/' + originalFilename;
        urlMatched = true;
        break; // First (alphabetically stable) match wins
      }
    }

    // --- Priority 2: File-type rules (only applied if NO URL rule matched) ---
    // This prevents double-nesting like "Images/GitHub/file.jpg".
    if (!urlMatched) {
      const lowerFilename = originalFilename.toLowerCase();

      if ((storage.torrents === true || storage.torrents === 'true') && lowerFilename.endsWith('.torrent')) {
        if (DEBUG) console.log('Torrents folder applied');
        finalFilename = 'Torrents/' + originalFilename;
      } else if ((storage.music === true || storage.music === 'true') && (lowerFilename.endsWith('.mp3') || lowerFilename.endsWith('.wav'))) {
        if (DEBUG) console.log('Music folder applied');
        finalFilename = 'Music/' + originalFilename;
      } else if ((storage.images === true || storage.images === 'true') && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(originalFilename)) {
        if (DEBUG) console.log('Images folder applied');
        finalFilename = 'Images/' + originalFilename;
      } else if ((storage.docs === true || storage.docs === 'true') && /\.(doc|docx|ppt|pptx|rtf|xls|xlsx|pdf|txt)$/i.test(originalFilename)) {
        if (DEBUG) console.log('Documents folder applied');
        finalFilename = 'Documents/' + originalFilename;
      } else if ((storage.arch === true || storage.arch === 'true') && /\.(zip|rar|dmg|7z|tar|gz)$/i.test(originalFilename)) {
        if (DEBUG) console.log('Archives folder applied');
        finalFilename = 'Archives/' + originalFilename;
      }
    }

    if (DEBUG) console.log('Final filename:', finalFilename);
    suggest({ filename: finalFilename, conflictAction: 'uniquify' });
  });

  // Return true to signal that suggest() will be called asynchronously
  return true;
});
