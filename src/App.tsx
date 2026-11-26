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
​- name: Remove zero-width spaces (\u200b) from source files
run: |
node -e '
const fs = require("fs");
const path = require("path");
function cleanDir(dir) {
if (!fs.existsSync(dir)) return;
for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
const full = path.join(dir, entry.name);
if (entry.isDirectory()) cleanDir(full);
else if (/.(ts|tsx|js|jsx|css|html|json)$/.test(entry.name)) {
const raw = fs.readFileSync(full, "utf8");
const cleaned = raw.replace(/\u200b/g, "");
if (cleaned !== raw) fs.writeFileSync(full, cleaned, "utf8");
}
}
}
cleanDir("src");
'
​- name: Setup Node
uses: actions/setup-node@v4
with:
node-version: 20
​- name: Install dependencies and build
run: |
npm ci || npm install
npm run build
