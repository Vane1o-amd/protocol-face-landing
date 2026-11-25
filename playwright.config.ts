import { defineConfig } from "@playwright/test";

// Runs against the production build: `npm run test:e2e` builds first.
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  use: { baseURL: "http://localhost:3123" },
  webServer: {
    command: "npx next start -p 3123",
    url: "http://localhost:3123",
    reuseExistingServer: !process.env.CI,
  },
});
