#!/bin/sh
# Builds the Chrome Web Store upload at dist/sevasek-classic-search.zip.
set -e
cd "$(dirname "$0")"
mkdir -p dist
rm -f dist/sevasek-classic-search.zip
zip -qr dist/sevasek-classic-search.zip manifest.json content.js icons
