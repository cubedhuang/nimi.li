// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare namespace App {
	interface Locals {
		lang: string;
	}

	// interface PageData {}

	interface Error {
		closest?: string[];
	}

	interface Platform {
		env: {
			CACHE_KV: import('@cloudflare/workers-types').KVNamespace;
		};
		context: import('@cloudflare/workers-types').ExecutionContext;
	}
}
