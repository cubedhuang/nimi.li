import { client } from '@kulupu-linku/sona/client';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

type Cached<T> = { data: T; lastUpdated: number };

async function makeCachedRequest<T>(
	platform: App.Platform | undefined,
	key: string,
	fetchData: () => Promise<T>
) {
	if (!platform) {
		return await fetchData();
	}
	const kv = platform.env.CACHE_KV;

	const cached = (await kv.get(key, 'json')) as Cached<T> | null;

	const oneHour = 60 * 60 * 1000;
	const isStale = !cached || Date.now() - cached.lastUpdated > oneHour;

	if (!isStale) return cached.data;

	const refresh = fetchData().then((data) =>
		kv.put(
			key,
			JSON.stringify({
				data,
				lastUpdated: Date.now()
			} satisfies Cached<T>)
		)
	);

	if (cached) {
		platform.context.waitUntil(refresh);
		return cached.data;
	}

	await refresh;
	return ((await kv.get(key, 'json')) as Cached<T>).data;
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
			.then((res) => res.json())
	);
}

export async function getLanguages({ platform, fetch }: RequestEvent) {
	return makeCachedRequest(platform, 'languages', () =>
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.languages.$get()
			.then((res) => res.json())
	);
}

export async function getLipamanka({ platform, fetch }: RequestEvent) {
	return makeCachedRequest(platform, 'lipamanka', async () => {
		const rawText = await fetch('https://lipamanka.gay/essays/dictionary')
			.then((res) => res.text())
			.catch(() => '');
		if (!rawText) {
			error(500, 'Failed to fetch lipamanka data');
		}

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
	});
}
