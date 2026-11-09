# Sevasek Classic Search

A small Chrome extension that removes the AI Overview block from Google Search results, so the page starts with the web results.

It's about 40 lines of JavaScript with no dependencies. You can read all of it in [`content.js`](content.js).

## Privacy and permissions

- It collects no data and makes no network requests.
- It requests no extension permissions, such as tabs, storage or history.
- Its script runs only on Google Search results pages on `www.google.com` and `www.google.com.au`.

Chrome may still describe this as being able to read and change your data on those sites, because that's what running a script on a page means.

## Install

The extension isn't on the Chrome Web Store yet. To install it from source:

1. Download or clone this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and select the repo folder.

It works in other Chromium browsers that allow unpacked extensions. There's nothing to configure.

## How it works

Google's class names change often, so the extension looks for the visible "AI Overview" heading instead. It hides the largest surrounding block that contains no normal search result. It checks again whenever the page changes, because results load in stages.

The block is only hidden. Google still generates the AI Overview, and the extension doesn't change your search or ranking.

## Limits

- It only recognises the English "AI Overview" heading, so it needs Google to be displayed in English.
- It runs on two Google domains. Add others under `matches` in [`manifest.json`](manifest.json).
- It doesn't remove the AI Mode tab or AI answers inside "People also ask".
- If Google rewords the heading, the extension stops matching until it's updated.

Found a problem? [Open an issue](https://github.com/sevasek/sevasek-classic-search/issues) with the search you ran and what you saw.

## Development

The test loads the extension into real Chromium against simulated results pages, and makes no requests to Google. It needs [Playwright](https://playwright.dev) and Chromium at `/usr/bin/chromium`.

```sh
NODE_PATH=$(mise where playwright)/node_modules node test.js
```

`NODE_PATH` must point at the `node_modules` folder that contains Playwright, so adjust it if you didn't install Playwright with mise.

See [`ARCHITECTURE.md`](ARCHITECTURE.md) for how the parts fit together and what must stay true.

## Build

`./build.sh` creates the Chrome Web Store upload at `dist/sevasek-classic-search.zip`. Listing copy and images are in [`store/`](store).

Every merge to `main` runs the same script in GitHub Actions and attaches the zip to the run as an artifact. GitHub wraps artifacts in their own zip, so unzip the download once before uploading it to the store.

## License

[MIT](LICENSE)

Built by [Sevasek](https://sevasek.com). Not affiliated with or endorsed by Google. Google Search is a trademark of Google LLC.
