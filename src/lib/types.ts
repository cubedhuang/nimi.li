import type { Glyph, Sign, Word } from '@kulupu-linku/sona';

export type CompoundData = Record<string, Compound>;

export interface Compound {
	compound: string;
	uses: Record<string, number>;
	glyphs?: string[];
}

export type SignData = {
	id: string;
	words: Word[];
	signs: Sign[];
};

export type ListWord = Omit<
	Word,
	| 'audio'
	| 'author_verbatim'
	| 'image'
	| 'ku_data'
	| 'pu_verbatim'
	| 'resources'
	| 'see_also'
	| 'svg'
> & {
	// terms for searching
	ku_search?: string[];
	pu_search?: string;
};

export type ListGlyph = Pick<
	Glyph,
	'id' | 'word_id' | 'usage_category' | 'svg'
>;

export type WordDetail = {
	word: Word;
	glyphs: Glyph[];
	lipamanka: string | null;
};
