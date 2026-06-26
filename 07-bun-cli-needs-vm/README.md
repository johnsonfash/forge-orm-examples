# 07 · Bun + SQLite

Bun's built-in SQLite. Zero deps beyond `forge-orm` — `bun run` and you're querying.

## Run it

Bun's SQLite uses native bindings, so this needs a real OS — not StackBlitz. All free:

- **[Open in GitHub Codespaces](https://codespaces.new/johnsonfash/forge-orm-examples?devcontainer_path=.devcontainer/devcontainer.json)** — 60 free hrs/month. After it boots:
  ```sh
  curl -fsSL https://bun.sh/install | bash
  source ~/.bashrc
  cd 07-bun-cli-needs-vm && bun install && bun run dev
  ```
- **[Open in Gitpod](https://gitpod.io/#https://github.com/johnsonfash/forge-orm-examples)** — same install steps after boot.
- **Locally** —
  ```sh
  curl -fsSL https://bun.sh/install | bash
  npx degit johnsonfash/forge-orm-examples/07-bun-cli-needs-vm my-bun-demo
  cd my-bun-demo && bun install && bun run dev
  ```

## Why Bun's SQLite?

Bun ships SQLite as a built-in — zero deps, faster cold-start than better-sqlite3. forge-orm auto-detects the Bun runtime and uses `bun:sqlite` directly.
