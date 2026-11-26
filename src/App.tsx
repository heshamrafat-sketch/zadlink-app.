name: Build
​on:
push:
branches: [ main ]
workflow_dispatch:
​jobs:
build:
runs-on: ubuntu-latest
​steps:
- name: Checkout
uses: actions/checkout@v4
​- name: Setup Node
uses: actions/setup-node@v4
with:
node-version: 20
​- name: Build
run: |
PKG_DIR=$(find . -maxdepth 3 -name "package.json" -not -path "/node_modules/" | head -n 1 | xargs dirname)
echo "Using project directory: $PKG_DIR"
cd "PKG_DIR"
node -e "
const fs = require('fs');
const path = require('path');
function walk(dir) {
if (!fs.existsSync(dir)) return;
for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
const full = path.join(dir, entry.name);
if (entry.isDirectory() && entry.name !== 'node_modules') walk(full);
else if (entry.isFile() && /\.(ts|tsx|js|jsx)/.test(entry.name)) {
const raw = fs.readFileSync(full, 'utf8');
const cleaned = raw.replace(/[\u200b\u200c\u200d\ufeff]/g, '');
if (cleaned !== raw) fs.writeFileSync(full, cleaned, 'utf8');
}
}
}
walk('src');
"
npm ci || npm install
npm run build
