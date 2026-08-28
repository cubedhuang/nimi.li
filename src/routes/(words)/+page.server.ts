import { getGlyphs, getSandboxGlyphs, getWords } from '$lib/server/fetch.js';
import { toListGlyph, toListWord } from '$lib/server/project.js';
import { getWordRecognition } from '$lib/util.js';
import type { ListGlyph } from '$lib/types.js';

export async function load({ fetch, locals, platform }) {
	const [words, glyphs, sandboxGlyphs] = await Promise.all([
		getWords({ fetch, platform, lang: locals.lang }),
		getGlyphs({ fetch, platform, lang: locals.lang }),
		getSandboxGlyphs({ fetch, platform, lang: locals.lang })
	]);

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
		) as Record<string, ListGlyph[]>
	};
}
