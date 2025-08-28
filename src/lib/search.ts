import type { LocalizedWord } from '@kulupu-linku/sona';
import { distance } from 'fastest-levenshtein';

import { getTranslation, getUcsur, normalize } from './util';

export function filter(
	words: LocalizedWord[],
	search: string,
	$language: string
) {
	search = normalize(search);

	if (!search) {
		return words;
	}

	return words
		.map((word) => [word, scoreSearch(word, search, $language)] as const)
		.filter(([, score]) => score > 0)
		.sort((a, b) => b[1] - a[1])
		.map(([word]) => word);
}

export function scoreMatch(
	content: string | string[] | undefined,
	search: string
) {
	if (!content) return 0;

	if (Array.isArray(content)) {
		if (content.length === 0) return 0;

		let score = 0;
		for (const item of content) {
			score += scoreMatch(item, search);
		}

		return score / content.length;
	}

	const normalized = normalize(content);
	const includes = normalized.includes(search);

	if (includes) {
		return content === search ? 10 : 1;
	}

	const distanceScore =
		distance(normalized, search) / (normalized.length + 1);
	if (distanceScore > 0.3) {
		return 0;
	}

	return 1 - distanceScore;
}

export function scoreSearch(
	word: LocalizedWord,
	search: string,
	$language: string
) {
	const translation = getTranslation(word, $language);

	let score =
		scoreMatch(word.word, search) * 500 +
		scoreMatch(translation.definition, search) * 50 +
		scoreMatch(word.source_language, search) * 20 +
		scoreMatch(word.creator, search) * 20;

	const pu = word.pu_verbatim?.[$language as 'en'] ?? word.pu_verbatim?.en;
	if (pu) {
		score += scoreMatch(pu, search) * 50;
	}

	if (word.ku_data) {
		score += scoreMatch(Object.keys(word.ku_data), search) * 10;
	}

	if (translation.etymology) {
		for (const etymology of translation.etymology) {
			score += scoreMatch(etymology.language, search) * 10;
			score += scoreMatch(etymology.definition, search) * 10;
		}
	}

	if (getUcsur(word) === search) {
		score += 1000;
	}

	return score;
}
