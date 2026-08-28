import {
	getGlyphs,
	getLanguages,
	getSandboxGlyphs,
	getSandboxWords
} from '$lib/server/fetch.js';
import { toListGlyph, toListWord } from '$lib/server/project';
import { getWordRecognition } from '$lib/util';
import type { ListGlyph } from '$lib/types';

export async function load({ fetch, platform, locals, setHeaders }) {
	const [words, glyphs, sandboxGlyphs, languages] = await Promise.all([
		getSandboxWords({ fetch, platform, lang: locals.lang }),
		getGlyphs({ fetch, platform, lang: locals.lang }),
		getSandboxGlyphs({ fetch, platform, lang: locals.lang }),
		getLanguages({ fetch, platform })
	]);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return {
		words: Object.fromEntries(
			Object.entries(words).map(([id, word]) => [
				id,
				toListWord(word, locals.lang)
			])
		),
		glyphs: Object.groupBy(
			Object.values(glyphs)
				.concat(Object.values(sandboxGlyphs))
				.filter((glyph) => glyph.word_id in words)
				.sort((a, b) => getWordRecognition(b) - getWordRecognition(a))
				.map(toListGlyph),
			(glyph) => glyph.word_id
			// typescript is evil and groupBy gives a Partial<...>
		) as Record<string, ListGlyph[]>,
		languages
	};
}
