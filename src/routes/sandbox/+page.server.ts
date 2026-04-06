import { client } from '@kulupu-linku/sona/client';
import { PUBLIC_BASE_URL } from '$env/static/public';

export async function load({ fetch, setHeaders }) {
	const [words, languages] = await Promise.all([
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.sandbox.words.$get({ query: {} })
			.then((res) => res.json()),
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v2.languages.$get()
			.then((res) => res.json())
	]);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return { words, languages };
}
