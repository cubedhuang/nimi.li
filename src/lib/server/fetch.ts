import { client } from '@kulupu-linku/sona/client';
import { PUBLIC_BASE_URL } from '$app/env/public';
import { fetchKu } from './ku';
import type {
	CacheStorage as CfCacheStorage,
	Response as CfResponse
} from '@cloudflare/workers-types';
import { env, waitUntil } from 'cloudflare:workers';

const CACHE_PREFIX = 'https://nimi.li/_cache/';

type Cached<T> = { data: T; lastUpdated: number };

function getEdgeCache() {
	return (caches as unknown as CfCacheStorage).default;
}

function getKv() {
	try {
		return env.CACHE_KV;
	} catch {
		return undefined;
	}
}

async function putCache(cacheKey: string, data: unknown) {
	const response = new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 's-maxage=3600'
		}
	}) as unknown as CfResponse;
	await getEdgeCache().put(cacheKey, response);
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

async function makeCachedRequest<T>(key: string, fetchData: () => Promise<T>) {
	const kv = getKv();
	if (!kv) {
		return await fetchData();
	}

	const cache = getEdgeCache();
	const cacheKey = `${CACHE_PREFIX}${key}`;
	const cached = await cache.match(cacheKey);
	if (cached) {
		return cached.json() as Promise<T>;
	}

	const kvCached = (await kv.get(key, 'json')) as Cached<T> | null;

	const oneHour = 60 * 60 * 1000;
	const isStale = !kvCached || Date.now() - kvCached.lastUpdated > oneHour;

	if (!isStale) {
		waitUntil(putCache(cacheKey, kvCached.data));
		return kvCached.data;
	}

	const refresh = fetchData().then(async (data) => {
		await Promise.all([
			putCache(cacheKey, data),
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
		waitUntil(
			refresh.catch((e) => console.error('refresh failed', key, e))
		);
		return kvCached.data;
	}

	return await refresh;
}

type RequestEvent = {
	fetch: typeof globalThis.fetch;
};

export async function getWords({
	fetch,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(`words:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.words.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getGlyphs({
	fetch,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(`glyphs:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.glyphs.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getSandboxWords({
	fetch,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(`sandbox_words:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.sandbox.words.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getSandboxGlyphs({
	fetch,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(`sandbox_glyphs:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.sandbox.glyphs.$get({ query: { lang } })
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getLukaPonaSigns({
	fetch,
	lang
}: RequestEvent & { lang: string }) {
	return makeCachedRequest(`luka_pona_signs:${lang}`, () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.luka_pona.signs.$get({
				query: { lang }
			})
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getLanguages({ fetch }: RequestEvent) {
	return makeCachedRequest('languages', () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.languages.$get()
			.then(ensureOk)
			.then((res) => res.json())
	);
}

export async function getLipamanka({ fetch }: RequestEvent) {
	return makeCachedRequest('lipamanka', async () => {
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

export async function getKu({ fetch }: RequestEvent) {
	return makeCachedRequest('ku', () => fetchKu({ fetch }));
}
