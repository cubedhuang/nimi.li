import { client } from '@kulupu-linku/sona/client';
import { json } from '@sveltejs/kit';

export async function GET({ fetch, url, setHeaders }) {
	const lang = url.searchParams.get('lang') ?? 'en';

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return json(
		await client({ fetch })
			.v1.sandbox.$get({ query: { lang } })
			.then(res => res.json())
	);
}
