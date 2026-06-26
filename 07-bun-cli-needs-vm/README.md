# 07 · Bun + SQLite

Bun's built-in SQLite. Zero deps beyond `forge-orm`.

## Run it (auto-runs on click)

Bun's SQLite uses native bindings, needs a real OS — not StackBlitz. Both options auto-install Bun + auto-run:

- **[Run on Replit](https://replit.com/new/github/johnsonfash/forge-orm-examples)** — pick the `07-bun-cli-needs-vm` folder, hit Run. `.replit` config uses the Bun runtime module.
- **[Run on CodeSandbox](https://codesandbox.io/p/devbox/github/johnsonfash/forge-orm-examples/main/07-bun-cli-needs-vm)** — `.codesandbox/tasks.json` installs Bun then runs the demo.

Local (fastest):

```sh
curl -fsSL https://bun.sh/install | bash
npx degit johnsonfash/forge-orm-examples/07-bun-cli-needs-vm my-demo
cd my-demo && bun install && bun run dev
```

## Why Bun's SQLite?

Bun ships SQLite as a built-in — zero deps, faster cold-start than better-sqlite3. forge-orm auto-detects the Bun runtime and uses `bun:sqlite` directly.
