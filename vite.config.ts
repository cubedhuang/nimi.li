import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({ preprocess: vitePreprocess(), adapter: adapter() })
	],
	optimizeDeps: {
		// prevent reload during tests with dev server
		include: ['bits-ui']
	}
});
