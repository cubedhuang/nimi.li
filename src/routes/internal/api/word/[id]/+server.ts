import { error } from '@sveltejs/kit';
import {
	getGlyphs,
	getLipamanka,
	getSandboxGlyphs,
	getSandboxWords,
	getWords
} from '#lib/server/fetch.js';
import { getOwn, getWordRecognition } from '#lib/util.js';
import type { WordDetail } from '#lib/types.js';

export async function GET({ fetch, locals, params, setHeaders }) {
	const { id } = params;

	const [words, glyphs, sandboxGlyphs, lipamanka] = await Promise.all([
		getWords({ fetch, lang: locals.lang }),
		getGlyphs({ fetch, lang: locals.lang }),
		getSandboxGlyphs({ fetch, lang: locals.lang }),
		getLipamanka({ fetch })
	]);

	const word =
		getOwn(words, id) ??
		getOwn(await getSandboxWords({ fetch, lang: locals.lang }), id);

	if (!word) {
		error(404, 'Word not found');
	}

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return Response.json({
		word,
		glyphs: Object.values(glyphs)
			.concat(Object.values(sandboxGlyphs))
			.filter((glyph) => glyph.word_id === id)
			.sort((a, b) => getWordRecognition(b) - getWordRecognition(a)),
		lipamanka: getOwn(lipamanka, id) ?? null
	} satisfies WordDetail);
}
