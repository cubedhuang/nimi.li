import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: adapter({
				routes: {
					include: ['/*'],
					// wildcard instead of a new rule because otherwise we run out of exclude rules on Cloudflare
					exclude: ['<build>', '<files>', '/internal/api/ss/*']
				}
			})
		})
	],
	optimizeDeps: {
		// prevent reload during tests with dev server
		include: ['bits-ui']
	}
});
