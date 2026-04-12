import { getLipamanka, getWords } from '$lib/server/fetch.js';

export async function load({ fetch, locals, platform }) {
	const [words, lipamanka] = await Promise.all([
		getWords({ fetch, platform, lang: locals.lang }),
		getLipamanka({ fetch, platform })
	]);

	return { words, lipamanka };
}
