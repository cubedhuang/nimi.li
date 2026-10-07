import { error } from '@sveltejs/kit';
import {
	getGlyphs,
	getLipamanka,
	getLukaPonaSigns,
	getSandboxGlyphs,
	getSandboxWords,
	getWords
} from '#lib/server/fetch.js';
import { combinedWordSort, getOwn, getWordRecognition } from '#lib/util.js';
import { distance } from 'fastest-levenshtein';

export async function load({ fetch, locals, params, setHeaders }) {
	const [wordData, glyphs, sandboxGlyphs, lukaPona, lipamanka] =
		await Promise.all([
			getWords({ fetch, lang: locals.lang }),
			getGlyphs({ fetch, lang: locals.lang }),
			getSandboxGlyphs({ fetch, lang: locals.lang }),
			getLukaPonaSigns({ fetch, lang: locals.lang }),
			getLipamanka({ fetch })
		]);

	const word = getOwn(wordData, params.nimi);
	const words = Object.values(wordData);
	const wordGlyphs = Object.values(glyphs)
		.concat(Object.values(sandboxGlyphs))
		.filter((glyph) => glyph.word_id === params.nimi)
		.sort((a, b) => getWordRecognition(b) - getWordRecognition(a));

	if (!word) {
		const sandbox = await getSandboxWords({
			fetch,
			lang: locals.lang
		});

		const sandboxWords = Object.values(sandbox);
		const sandboxWord = getOwn(sandbox, params.nimi);

		if (sandboxWord) {
			const index = sandboxWords.indexOf(sandboxWord);
			setHeaders({ 'Cache-Control': 's-maxage=3600' });

			return {
				word: sandboxWord,
				glyphs: wordGlyphs,
				next:
					index === sandboxWords.length - 1
						? undefined
						: sandboxWords[index + 1].id,
				previous: index === 0 ? undefined : sandboxWords[index - 1].id
			};
		}

		const closest = words
			.map(({ word }) => ({
				word,
				distance: distance(word, params.nimi)
			}))
			.filter(
				({ word, distance }) =>
					distance < 3 || word.startsWith(params.nimi)
			)
			.sort((a, b) => a.distance - b.distance)
			.slice(0, 10)
			.map(({ word }) => word);

		if (params.nimi.length >= 10) {
			if (params.nimi.length >= 10) closest.pop();
			closest.push('kijetesantakalu');
		}

		error(404, 'Not found', { closest });
	}

	const sortedWords = words.sort(combinedWordSort);
	const index = sortedWords.indexOf(word);

	setHeaders({ 'Cache-Control': 's-maxage=3600' });

	return {
		word,
		glyphs: wordGlyphs,
		signs: Object.values(lukaPona).filter(
			(word) => params.nimi === word.definition
		),
		lipamanka: getOwn(lipamanka, params.nimi),
		next:
			index === words.length - 1 ? undefined : sortedWords[index + 1].id,
		previous: index === 0 ? undefined : sortedWords[index - 1].id
	};
}
