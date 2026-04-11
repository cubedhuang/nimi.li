import { getLanguages, getSandboxWords } from '$lib/server/fetch.js';

export async function load({ fetch, platform, locals, setHeaders }) {
	const [words, languages] = await Promise.all([
		getSandboxWords({ fetch, platform, lang: locals.lang }),
		getLanguages({ fetch, platform })
	]);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return { words, languages };
}
