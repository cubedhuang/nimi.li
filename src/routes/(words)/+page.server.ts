import { client } from '@kulupu-linku/sona/client';
import { PUBLIC_BASE_URL } from '$env/static/public';

export async function load({ fetch, locals, setHeaders }) {
	const [words, languages, lipamanka] = await Promise.all([
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.words.$get({ query: { lang: locals.lang } })
			.then((res) => res.json()),
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.languages.$get()
			.then((res) => res.json()),
		fetch('/internal/api/lipamanka').then((res) => res.json()) as Promise<
			Record<string, string>
		>
	]);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return { words, languages, lipamanka };
}
