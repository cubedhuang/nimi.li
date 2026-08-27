import {
	getGlyphs,
	getLipamanka,
	getSandboxGlyphs,
	getWords
} from '$lib/server/fetch.js';
import { getWordRecognition } from '$lib/util.js';
import type { Glyph } from '@kulupu-linku/sona';

export async function load({ fetch, locals, platform }) {
	const [words, glyphs, sandboxGlyphs, lipamanka] = await Promise.all([
		getWords({ fetch, platform, lang: locals.lang }),
		getGlyphs({ fetch, platform, lang: locals.lang }),
		getSandboxGlyphs({ fetch, platform, lang: locals.lang }),
		getLipamanka({ fetch, platform })
	]);

	return {
		words,
		glyphs: Object.groupBy(
			Object.values(glyphs)
				.concat(Object.values(sandboxGlyphs))
				.filter((glyph) => glyph.word_id in words)
				.sort((a, b) => getWordRecognition(b) - getWordRecognition(a)),
			(glyph) => glyph.word_id
			// typescript is evil and groupBy gives a Partial<...>
		) as Record<string, Glyph[]>,
		lipamanka
	};
}
