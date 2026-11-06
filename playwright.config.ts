import { defineConfig, devices } from '@playwright/test';

const port = 4173;

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: `http://localhost:${port}`,
		...devices['Desktop Chrome']
	},
	webServer: {
		command: `pnpm exec vite dev --port ${port} --strictPort`,
		url: `http://localhost:${port}/about`
	}
});
