import { client } from '@kulupu-linku/sona/client';

export async function load({ fetch, setHeaders }) {
	const [words, languages, lipamanka] = await Promise.all([
		client({ fetch })
			.v1.words.$get({ query: { lang: 'en' } })
			.then(res => res.json()),
		client({ fetch })
			.v1.languages.$get()
			.then(res => res.json()),
		fetch('/internal/api/lipamanka').then(res => res.json()) as Promise<
			Record<string, string>
		>
	]);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return { words, languages, lipamanka };
}
