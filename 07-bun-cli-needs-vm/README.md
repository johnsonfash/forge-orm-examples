# 07 · Bun + SQLite

Bun's built-in SQLite. Zero deps beyond `forge-orm`.

## Run it (no typing — auto-runs on click)

Bun's SQLite uses native bindings, needs a real OS — not StackBlitz. Three click-and-run options:

- **[Run on Replit](https://replit.com/new/github/johnsonfash/forge-orm-examples)** — pick the `07-bun-cli-needs-vm` folder, hit Run. The `.replit` config auto-installs Bun + runs. Has Asia datacenters (faster from Nigeria).
- **[Run on CodeSandbox](https://codesandbox.io/p/devbox/github/johnsonfash/forge-orm-examples/main/07-bun-cli-needs-vm)** — `.codesandbox/tasks.json` auto-installs Bun + runs.
- **[Open in GitHub Codespaces](https://codespaces.new/johnsonfash/forge-orm-examples?devcontainer_path=.devcontainer/devcontainer.json)** — manual: install Bun, then `cd 07-bun-cli-needs-vm && bun install && bun run dev`.

Local (fastest):

```sh
curl -fsSL https://bun.sh/install | bash
npx degit johnsonfash/forge-orm-examples/07-bun-cli-needs-vm my-demo
cd my-demo && bun install && bun run dev
```

## Why Bun's SQLite?

Bun ships SQLite as a built-in — zero deps, faster cold-start than better-sqlite3. forge-orm auto-detects the Bun runtime and uses `bun:sqlite` directly.
