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
​- name: Clean hidden characters
run: |
node -e '
const fs = require("fs");
const path = require("path");
function walk(dir) {
if (!fs.existsSync(dir)) return;
for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
const p = path.join(dir, item.name);
if (item.isDirectory()) walk(p);
else if (/.(ts|tsx|js|jsx|css|html|json)$/.test(item.name)) {
const content = fs.readFileSync(p, "utf8");
const cleaned = content.replace(/[\u200b-\u200f\ufeff]/g, "");
if (cleaned !== content) fs.writeFileSync(p, cleaned, "utf8");
}
}
}
walk("src");
walk("zadlink-app/src");
'
​- name: Setup Node
uses: actions/setup-node@v4
with:
node-version: 20
​- name: Build
run: |
if [ -f "zadlink-app/package.json" ]; then
cd zadlink-app
fi
npm ci || npm install
npm run build
