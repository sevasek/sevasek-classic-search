// Google's class names churn, so find the block by its visible heading.
// "AI OverviewGenerating" is how the heading reads while the answer streams in.
// ponytail: English only, add localized headings if the UI language changes.
const HEADING = /^AI Overview($|[A-Z])/;
const MARK = 'data-classic-search-hidden';

// The largest ancestor of the heading that holds no organic result.
function boxFor(heading) {
  let box = heading;
  for (let p = box.parentElement; p; box = p, p = p.parentElement) {
    if (p.matches('#rso, #center_col, body') || p.querySelector('a h3')) break;
  }
  return box;
}

function sweep() {
  const boxes = new Set();
  for (const h of document.querySelectorAll('h1, h2, [role="heading"]')) {
    if (HEADING.test(h.textContent.trim()) && !h.closest('a')) boxes.add(boxFor(h));
  }
  // Results stream in after the heading, so a box chosen early can be too big.
  // Recompute on every pass and restore anything no longer chosen.
  for (const el of document.querySelectorAll(`[${MARK}]`)) {
    if (!boxes.has(el)) {
      el.removeAttribute(MARK);
      el.style.removeProperty('display');
    }
  }
  for (const box of boxes) {
    box.setAttribute(MARK, '');
    box.style.setProperty('display', 'none', 'important');
  }
}

// Observer callbacks run before paint, so the block never flashes on screen.
new MutationObserver(sweep).observe(document, { childList: true, subtree: true });
sweep();
