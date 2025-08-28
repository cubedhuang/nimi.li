import { client } from '@kulupu-linku/sona/client';

export async function load({ fetch, setHeaders }) {
	const [words, languages] = await Promise.all([
		client({ fetch })
			.v1.sandbox.$get({ query: {} })
			.then((res) => res.json()),
		client({ fetch })
			.v1.languages.$get()
			.then((res) => res.json())
	]);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return { words, languages };
}
