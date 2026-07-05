import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// No wasm plugin, no COOP/COEP headers, no worker wiring — IndexedDB
// is native to every browser. That's the point of this example.
export default defineConfig({
  plugins: [react()],
})
