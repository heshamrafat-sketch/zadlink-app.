
name: Build

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Clean hidden characters
        run: |
          python3 <<'PY'
          import glob
          import os

          patterns = [
              "**/*.ts",
              "**/*.tsx",
              "**/*.js",
              "**/*.jsx",
              "**/*.mjs",
              "**/*.cjs"
          ]

          files = set()

          for pattern in patterns:
              files.update(glob.glob(pattern, recursive=True))

          hidden_chars = [
              "\u200b",
              "\ufeff",
              "\u200c",
              "\u200d"
          ]

          for path in files:
              if "node_modules" in path.split(os.sep):
                  continue

              if ".git" in path.split(os.sep):
                  continue

              try:
                  with open(path, "r", encoding="utf-8") as f:
                      data = f.read()

                  cleaned = data

                  for char in hidden_chars:
                      cleaned = cleaned.replace(char, "")

                  if cleaned != data:
                      with open(path, "w", encoding="utf-8") as f:
                          f.write(cleaned)

                      print(f"Cleaned: {path}")

              except Exception as e:
                  print(f"Skipped {path}: {e}")
          PY

      - name: Install and Build
        run: |
          npm ci || npm install
          npm run build
