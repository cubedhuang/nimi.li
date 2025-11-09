import { client } from '@kulupu-linku/sona/client';
import { json } from '@sveltejs/kit';
import { PUBLIC_BASE_URL } from '$env/static/public';

export async function GET({ fetch, url, setHeaders }) {
	const lang = url.searchParams.get('lang') ?? 'en';

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return json(
		await client({ fetch, baseUrl: PUBLIC_BASE_URL })
			.v1.sandbox.$get({ query: { lang } })
			.then((res) => res.json())
	);
}
