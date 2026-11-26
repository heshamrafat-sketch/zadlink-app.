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
​- name: Clean hidden characters
run: |
python3 -c '
import glob
for path in glob.glob("/.ts", recursive=True) + glob.glob("/.js", recursive=True):
if "node_modules" in path:
continue
with open(path, "r", encoding="utf-8", errors="ignore") as f:
data = f.read()
cleaned = data.replace("\u200b", "").replace("\ufeff", "").replace("\u200c", "").replace("\u200d", "")
if cleaned != data:
with open(path, "w", encoding="utf-8") as f:
f.write(cleaned)
'
​- name: Install and Build
run: |
npm ci || npm install
npm run build
