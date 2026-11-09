# Architecture

## 1. What exists?

Google results page → `content.js` (content script declared in `manifest.json`) → hidden AI Overview block

## 2. Who owns what?

- `manifest.json` → which pages the script runs on
- `content.js` → finding and hiding the block
- `test.js` → behaviour check in real Chromium against fake pages
- `icons/` → extension icons, rendered from the sevasek.com favicon
- `store/` → Chrome Web Store listing copy and images, not shipped in the zip
- `build.sh` → the store zip, run locally and by `.github/workflows/build.yml` on every merge to `main`

## 3. What may depend on what?

`content.js` depends only on the page DOM.

`content.js` ✕ network, storage or extension permissions

## 4. How does data move?

DOM mutation → find "AI Overview" headings → climb to the largest ancestor with no organic result → hide it, and restore any earlier choice that is no longer right

## 5. What must stay true?

- An organic result is never hidden. The climb stops at any ancestor holding an `a h3`.
- Selection is recomputed on every mutation, because results stream in after the heading.
- The extension requests no permissions.
- The store zip contains only `manifest.json`, `content.js` and `icons/`.

## 6. When should an agent stop?

Stop and ask before adding permissions, sending any data off the page, or publishing to the Chrome Web Store.
