import { getLanguages, getLipamanka, getWords } from '$lib/server/fetch.js';

export async function load({ fetch, locals, platform }) {
	const [words, languages, lipamanka] = await Promise.all([
		getWords({ fetch, platform, lang: locals.lang }),
		getLanguages({ fetch, platform }),
		getLipamanka({ fetch, platform })
	]);

	return { words, languages, lipamanka };
}
