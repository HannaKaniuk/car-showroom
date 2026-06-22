#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

VITE_BASE_PATH=/car-showroom/ npm run build

cd dist
git init -q
git checkout -q -b gh-pages
git add -A
git commit -q -m "Deploy to GitHub Pages"
git push -f origin gh-pages
rm -rf .git

echo "Deployed: https://hannakaniuk.github.io/car-showroom/"
