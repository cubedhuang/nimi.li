import { error, json } from '@sveltejs/kit';
import {
	getGlyphs,
	getLipamanka,
	getSandboxGlyphs,
	getSandboxWords,
	getWords
} from '$lib/server/fetch';
import { getWordRecognition } from '$lib/util';
import type { WordDetail } from '$lib/types';

export async function GET({ fetch, locals, params, platform, setHeaders }) {
	const { id } = params;

	const [words, glyphs, sandboxGlyphs, lipamanka] = await Promise.all([
		getWords({ fetch, platform, lang: locals.lang }),
		getGlyphs({ fetch, platform, lang: locals.lang }),
		getSandboxGlyphs({ fetch, platform, lang: locals.lang }),
		getLipamanka({ fetch, platform })
	]);

	const word =
		words[id] ??
		(await getSandboxWords({ fetch, platform, lang: locals.lang }))[id];

	if (!word) {
		error(404, 'Word not found');
	}

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return json({
		word,
		glyphs: Object.values(glyphs)
			.concat(Object.values(sandboxGlyphs))
			.filter((glyph) => glyph.word_id === id)
			.sort((a, b) => getWordRecognition(b) - getWordRecognition(a)),
		lipamanka: lipamanka[id] ?? null
	} satisfies WordDetail);
}
