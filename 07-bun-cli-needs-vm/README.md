# 07 · Bun + SQLite

Bun's built-in SQLite. Zero deps beyond `forge-orm` — `bun run` and you're querying.

## Run it

Bun's SQLite uses native bindings, so this needs a real OS — not StackBlitz. All free:

- **[Open in CodeSandbox DevBox](https://codesandbox.io/p/sandbox/github/johnsonfash/forge-orm-examples/main/07-bun-sqlite-blog)** — real cloud VM, click & run
- **[Open in Replit](https://replit.com/new/github/johnsonfash/forge-orm-examples)** — has a Bun template
- **[Open in GitHub Codespaces](https://codespaces.new/johnsonfash/forge-orm-examples?devcontainer_path=.devcontainer/devcontainer.json)** — install Bun in the devcontainer
- **Locally** —
  ```sh
  curl -fsSL https://bun.sh/install | bash
  bun install && bun run dev
  ```
