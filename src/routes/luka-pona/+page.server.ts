import {
	getLukaPonaSigns,
	getSandboxWords,
	getWords
} from '$lib/server/fetch.js';
import type { SignData } from '$lib/types';

export async function load({ fetch, locals, platform, setHeaders }) {
	const [words, sandbox, lukaPona] = await Promise.all([
		getWords({ fetch, platform, lang: locals.lang }),
		getSandboxWords({ fetch, platform, lang: locals.lang }),
		getLukaPonaSigns({ fetch, platform, lang: locals.lang })
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
