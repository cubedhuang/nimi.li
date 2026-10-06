import { client } from '@kulupu-linku/sona/client';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { fetchKu } from './ku';
import type { Response as CfResponse } from '@cloudflare/workers-types';

const CACHE_PREFIX = 'https://nimi.li/_cache/';

type Cached<T> = { data: T; lastUpdated: number };

async function putCache(
	platform: App.Platform,
	cacheKey: string,
	data: unknown
) {
	const response = new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 's-maxage=3600'
		}
	}) as unknown as CfResponse;
	await platform.caches.default.put(cacheKey, response);
}

export function ensureOk<
	R extends { ok: boolean; status: number; statusText: string; url: string }
>(res: R) {
	if (!res.ok) {
		throw new Error(
			`request to ${res.url} failed: ${res.status} ${res.statusText}`
		);
	}

	return res;
}

async function makeCachedRequest<T>(
	platform: App.Platform | undefined,
	key: string,
	fetchData: () => Promise<T>
) {
	if (!platform) {
		return await fetchData();
	}

	const cache = platform.caches.default;
	const cacheKey = `${CACHE_PREFIX}${key}`;
	const cached = await cache.match(cacheKey);
	if (cached) {
		return cached.json() as Promise<T>;
	}

	const kv = platform.env.CACHE_KV;
	const kvCached = (await kv.get(key, 'json')) as Cached<T> | null;

	const oneHour = 60 * 60 * 1000;
	const isStale = !kvCached || Date.now() - kvCached.lastUpdated > oneHour;

	if (!isStale) {
		platform.context.waitUntil(putCache(platform, cacheKey, kvCached.data));
		return kvCached.data;
	}

	const refresh = fetchData().then(async (data) => {
		await Promise.all([
			putCache(platform, cacheKey, data),
			kv.put(
				key,
				JSON.stringify({
					data,
					lastUpdated: Date.now()
				} satisfies Cached<T>)
			)
		]).catch((e) => console.error('cache write failed', key, e));

		return data;
	});

	if (kvCached) {
		platform.context.waitUntil(
			refresh.catch((e) => console.error('refresh failed', key, e))
		);
		return kvCached.data;
	}

	return await refresh;
}

type RequestEvent = {
	fetch: typeof globalThis.fetch;
	platform: App.Platform | undefined;
};

export async function getWords({
	fetch,
	platform,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(platform, `words:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.words.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getGlyphs({
	fetch,
	platform,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(platform, `glyphs:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.glyphs.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getSandboxWords({
	fetch,
	platform,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(platform, `sandbox_words:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.sandbox.words.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getSandboxGlyphs({
	fetch,
	platform,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(platform, `sandbox_glyphs:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.sandbox.glyphs.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getLukaPonaSigns({
	fetch,
	platform,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(platform, `luka_pona_signs:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.luka_pona.signs.$get({
				query: { lang }
			})
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getLanguages({ platform, fetch }: RequestEvent) {
	return makeCachedRequest(platform, 'languages', () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.languages.$get()
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getLipamanka({ platform, fetch }: RequestEvent) {
	return makeCachedRequest(platform, 'lipamanka', async () => {
		const rawText = await fetch('https://lipamanka.gay/essays/dictionary')
			.then(ensureOk)
			.then((res) => res.text());

		const re =
			/<details(?: open)?>\s*?<summary id="([^"]+)">.*?<\/summary>\s*([\s\S]*?)\s*<\/details>/g;

		const words: Record<string, string> = {};

		let match: RegExpExecArray | null;
		while ((match = re.exec(rawText))) {
			const [, word, definition] = match;

			if (word === 'mije-and-meli') {
				words['mije'] = words['meli'] = definition;
			}

			words[word] = definition;
		}

		return words;
	}).catch((e) => {
		console.error('lipamanka failed', e);
		return {} as Record<string, string>;
	});
}

export async function getKu({ platform, fetch }: RequestEvent) {
	return makeCachedRequest(platform, 'ku', () => fetchKu({ fetch }));
}
