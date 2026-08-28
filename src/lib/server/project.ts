import type { Glyph, Word } from '@kulupu-linku/sona';

import { RECOGNITION_PERIOD } from '$lib/util';
import type { ListGlyph, ListWord } from '$lib/types';

export function toListWord(word: Word, lang: string): ListWord {
	const recognition = word.usage[RECOGNITION_PERIOD];

	const listWord: ListWord = {
		id: word.id,
		word: word.word,
		author: word.author,
		author_source: word.author_source,
		book: word.book,
		coined_era: word.coined_era,
		creation_date: word.creation_date,
		deprecated: word.deprecated,
		glyph_ids: word.glyph_ids,
		parent_id: word.parent_id,
		primary_glyph_id: word.primary_glyph_id,
		representations: word.representations,
		source_language: word.source_language,
		translations: word.translations,
		usage_category: word.usage_category,
		usage:
			recognition === undefined
				? {}
				: { [RECOGNITION_PERIOD]: recognition }
	};

	if (word.ku_data) {
		listWord.ku_search = Object.keys(word.ku_data);
	}

	if (word.pu_verbatim) {
		listWord.pu_search =
			word.pu_verbatim[lang as keyof typeof word.pu_verbatim] ??
			word.pu_verbatim.en;
	}

	return listWord;
}

export function toListGlyph(glyph: Glyph): ListGlyph {
	return {
		id: glyph.id,
		word_id: glyph.word_id,
		usage_category: glyph.usage_category,
		svg: glyph.svg
	};
}
