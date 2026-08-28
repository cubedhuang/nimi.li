/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;
const GLYPH_CACHE = 'glyphs';
const PRECACHE_FILES = files.filter((file) => !file.includes('/fonts/'));
const ASSETS = [...build, ...PRECACHE_FILES];

const GLYPH_ORIGIN = 'https://raw.githubusercontent.com';
const GLYPH_PATH_PREFIX = '/lipu-linku/ijo/';

function isGlyphRequest(url: URL) {
	return (
		url.origin === GLYPH_ORIGIN &&
		url.pathname.startsWith(GLYPH_PATH_PREFIX)
	);
}

async function revalidate(cache: Cache, request: Request) {
	try {
		const response = await fetch(request);

		if (response.ok) {
			await cache.put(request, response.clone());
		}
	} catch {
		//
	}
}

self.addEventListener('install', (event) => {
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	async function deleteOldCaches() {
		const keys = await caches.keys();

		const old = keys.filter((key) => key !== CACHE && key !== GLYPH_CACHE);

		await Promise.all(old.map((key) => caches.delete(key)));
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const isGlyph = isGlyphRequest(url);
		const cache = await caches.open(isGlyph ? GLYPH_CACHE : CACHE);

		if (isGlyph) {
			const response = await cache.match(event.request);

			if (response) {
				event.waitUntil(revalidate(cache, event.request));
				return response;
			}
		} else if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}
		}

		try {
			const response = await fetch(event.request);

			if (response.ok) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				return response;
			}

			throw err;
		}
	}

	event.respondWith(respond());
});
