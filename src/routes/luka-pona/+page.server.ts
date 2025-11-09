import { client } from '@kulupu-linku/sona/client';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { SignData } from '$lib/types';

export async function load({ fetch, setHeaders }) {
	const [words, sandbox, lukaPona] = await Promise.all([
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v1.words.$get({ query: { lang: 'en' } })
			.then((res) => res.json()),
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v1.sandbox.$get({ query: { lang: 'en' } })
			.then((res) => res.json()),
		client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v1.luka_pona.signs.$get({ query: { lang: 'en' } })
			.then((res) => res.json())
	]);

	const lukaPonaData = Object.values(lukaPona);
	const signs: Record<string, SignData> = {};

	for (const sign of Object.values(lukaPonaData)) {
		if (signs[sign.definition]) {
			signs[sign.definition].signs.push(sign);
		} else {
			signs[sign.definition] = {
				id: sign.definition,
				words: sign.definition
					.split(', ')
					.map((w) => words[w] ?? sandbox[w]),
				signs: [sign]
			};
		}
	}

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return {
		signs: Object.values(signs).sort((a, b) =>
			a.words[0].id.localeCompare(b.words[0].id)
		)
	};
}
