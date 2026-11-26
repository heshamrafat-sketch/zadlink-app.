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
find . -maxdepth 4 -type f ( -name ".ts" -o -name ".tsx" -o -name ".js" -o -name ".jsx" ) ! -path "/node_modules/" -exec sed -i 's/\xE2\x80\x8B//g' {} +
if [ -f "zadlink-app/package.json" ]; then
cd zadlink-app
fi
npm ci || npm install
npm run build
